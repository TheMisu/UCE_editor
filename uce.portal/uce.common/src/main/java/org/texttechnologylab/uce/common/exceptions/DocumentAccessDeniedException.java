package org.texttechnologylab.uce.common.exceptions;

import org.texttechnologylab.models.authentication.DocumentPermission;

public class DocumentAccessDeniedException extends Exception {

    private final String principal;
    private final long documentId;
    private final DocumentPermission.DOCUMENT_PERMISSION_LEVEL required;

    public DocumentAccessDeniedException(String principal,
                                         long documentId,
                                         DocumentPermission.DOCUMENT_PERMISSION_LEVEL required) {
        super("Principal %s requires %s on document %d".formatted(principal, required, documentId));
        this.principal = principal;
        this.documentId = documentId;
        this.required = required;
    }

    public String getPrincipal() { return principal; }
    public long getDocumentId() { return documentId; }
    public DocumentPermission.DOCUMENT_PERMISSION_LEVEL getRequired() { return required; }
}
