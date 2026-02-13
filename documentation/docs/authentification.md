> **Notation:** identifiers_with_underscores refer to database tables or columns, while camelCase names reference Java classes, fields, or methods.

## Document Permission System

### Access-Control Model
UCE’s authorization layer follows the classical Access Control List (ACL) model: each protected object stores a list of principals (users, groups) with explicit permissions, and enforcement compares the caller’s identity against that list. The design maps to the description of ACLs in Butler Lampson’s paper on protection systems, where subjects (users, groups) receive rights over objects (documents) through per-object lists of capabilities [1]. This choice keeps the authorization state close to the document records and enables straightforward expression of per-document differences without maintaining centralized role matrices.

### Document Permission Storage
- **`documentpermissions` table** (`org.texttechnologylab.models.authentication.DocumentPermission`): stores one row per document/principal pair, constrained to be unique by `(document_id, name, type)`. `type` is an enum with `GROUP`, `USER`, and `EFFECTIVE` (the precomputed merge of the other two). `level` captures the maximum capability and matches `DOCUMENT_PERMISSION_LEVEL` (`NONE`, `READ`, `WRITE`, `OWNER`, `ADMIN`), allowing simple ordinal comparisons. Every record also tracks audit metadata (`grantedBy`, `createdAt`, `updatedAt`, `updatedBy`).
- **Attachment to documents**: `org.texttechnologylab.uce.common.models.corpus.Document` exposes `addPermission`/`removePermission` so the JPA (Java Persistence API) relationship stays synchronized. During ingest, the corpus importer (`Importer#setPermissions`) reads `Permission` annotations from CAS files and creates `DocumentPermission` instances, so imported corpora can ship predefined ACLs.
- **Administrative fallback**: documents without any permission rows are treated as public. Anonymous visitors are mapped to the constant `DocumentPermission.PUBLIC_USERNAME`, so `permitted_documents` still returns public documents while keeping protected ones hidden. The SQL helper described below returns public documents automatically so legacy datasets stay readable.

### Access Context and Manager
- **Contexts**: `DocumentAccessContext` encapsulates the current principal, caches resolved permission levels per document, and tracks functional roles via `EnumSet<DocumentAccessContext.Role>` (currently only `ADMIN`). Contexts are defined as prototype-scoped beans in `DocumentAccessConfig`, so each request gets an isolated snapshot (`documentAccessContext(String principal, EnumSet<Role> roles)`).
- **Manager**: `DocumentAccessManager` keeps a `ThreadLocal` reference to the active context. The `as`/`asAdmin` helpers temporarily push a context and return an `AutoCloseable` guard, ensuring deterministic cleanup even across nested calls. `current()` falls back to the admin bypass context (`__admin__`, role `ADMIN`) whenever authentication is disabled in `UceConfig`, preventing null contexts in standalone deployments. The `checkAccess` methods short-circuit whenever the current context has the `ADMIN` role.
- **Obtaining beans**:
  ```java
  // Inside App.initSparkRoutes(...)
  var accessManager = serviceContext.getBean(DocumentAccessManager.class);
  var contextFactory = serviceContext
          .getAutowireCapableBeanFactory()
          .getBeanProvider(DocumentAccessContext.class);
  ```
- **Typical usage**:
  ```java
  // Enter a context explicitly (e.g., CLI tool)
  var roles = java.util.EnumSet.noneOf(DocumentAccessContext.Role.class);
  try (var guard = accessManager.as(contextFactory.getObject(username, roles))) {
      var document = db.getDocumentById(42L);
      // work with the document
  }
  // guard closes automatically and restores the previous context
  ```
  ```java
  // Run background work with inherited context
  Runnable job = accessManager.wrap(() -> {
      var embeddings = ragService.getDocumentEmbeddingOfDocument(docId);
      // process embeddings
  });
  new Thread(job, "rag-worker").start();
  ```
- **Permission checks**: `checkAccess(long, DOCUMENT_PERMISSION_LEVEL)` first consults the context cache, then asks `PostgresqlDataInterface_Impl.hasDocumentAccess(...)`. On success the granted level is cached; on failure it throws `DocumentAccessDeniedException`. A batch overload handles collections to avoid per-row queries. `permittedDocumentsExpression` returns a SQL snippet (`permitted_documents(<principal>, <level>)`) so DAOs can embed the caller identity directly into queries and stored procedures.
- **Thread helpers**: `wrap`, `wrapAdmin`, `runAsync`, and `runAsyncAdmin` capture a context and reapply it inside background threads. Long-running jobs (`SystemStatus.initSystemStatus`, RAG streaming workers, importer startup) use these helpers to retain the correct principal while executing off the request thread.

### Authentication and Effective Permissions Lifecycle
1. **Keycloak handshake** (`org.texttechnologylab.uce.web.routes.AuthenticationApi#loginCallback`): after the OAuth redirect, the backend exchanges the code for tokens, parses the ID token, and builds a `UceUser` containing username, display data, group memberships, and derived roles (e.g., the `uce-admin` group maps to `DocumentAccessContext.Role.ADMIN`). The `SessionManager` stores that `UceUser` in the Javalin session.
2. **Effective permissions**: immediately after login the backend calls `PostgresqlDataInterface_Impl.calculateEffectivePermissions(...)`. This routine unions direct user grants and group grants for the user, computes the highest level per document, and upserts `type = EFFECTIVE` rows. The SQL intentionally mirrors the ACL model so runtime checks only need to look at one row per user/document.
3. **SQL helper** (`database/14_createPermittedDocumentsFunction.sql`): `permitted_documents(principal, minLevel)` returns every document the caller can access at the requested level. It also yields documents with no ACL rows and short-circuits when the principal is `__admin__`. Most reporting procedures reference this function to avoid duplicating the access logic inside SQL.

### Request Handling and Enforcement
1. **Middleware guard** (`org.texttechnologylab.uce.web.App#initSparkRoutes`): a `before` filter resolves the request’s `UceUser`. If no user is present, the principal falls back to `DocumentPermission.PUBLIC_USERNAME`; otherwise the user’s `EnumSet<Role>` is forwarded. The filter obtains a `DocumentAccessContext` bean via `contextFactory.getObject(principal, roles)` and calls `DocumentAccessManager.as(...)`. When global authentication is disabled, the filter uses the admin bypass principal with the `ADMIN` role. The resulting guard is stored in the HTTP context and closed in the `after` filter, guaranteeing that every handler executes with an initialized context.
2. **Database services**: `PostgresqlDataInterface_Impl` methods either:
   - Embed `permitted_documents(...)` directly (e.g., `getDocumentsByCorpusId`, search stored procedures, RAG embedding queries), or
   - Call `DocumentAccessManager.checkAccess(...)` before loading or mutating a document (`getDocumentById`, `deleteDocumentById`, metadata fetches, etc.).
   The lower-level helper `hasDocumentAccess` powers the manager and any custom checks.
3. **RAG and search services**: `org.texttechnologylab.uce.common.services.RAGService` performs explicit `checkAccess` calls before reading document embeddings, sentence embeddings, or writing new vectors. When assembling SQL it also filters through `permitted_documents` so vector searches never return unauthorized content.
4. **Async/background work**: scheduled jobs (`SystemStatus.initSystemStatus`), importer startup (`uce.corpus-importer.App`), and RAG streaming threads wrap their runnables with `DocumentAccessManager.wrap*` to pin the appropriate context (usually admin) for the duration of the task.

### End-to-End Flow
1. User authenticates via Keycloak → `AuthenticationApi#loginCallback` stores `UceUser` and invokes `calculateEffectivePermissions`.
2. The next HTTP request hits the Javalin middleware, which creates a `DocumentAccessContext` for that principal and installs it via `DocumentAccessManager.as(...)`.
3. Route handlers and services run with that context. DAO methods either call `checkAccess` or execute SQL that joins against `permitted_documents(principal, level)`.
4. If a check fails, `DocumentAccessDeniedException` propagates back to the handler so the UI/API can respond with an authorization error; otherwise the DAO caches the positive result in the context for the remainder of the request.
5. After the response is sent, the `after` filter closes the guard, restoring or clearing the previous context so the thread can be reused safely.

### References
[1] [Butler W. Lampson. “Protection.” ACM Operating Systems Review, 8(1), 1974](https://dl.acm.org/doi/pdf/10.1145/775265.775268). Describes the Access Control List model adopted for UCE’s document-level authorization.
