-- Returns the subset of documents accessible to the given user for the requested permission level.
-- Documents without any permission rows are treated as public and therefore always returned.
CREATE OR REPLACE FUNCTION permitted_documents(
    IN p_user_name text,
    IN p_min_level integer DEFAULT 1
)
RETURNS SETOF document
LANGUAGE sql
STABLE
AS
$$
    SELECT d.*
    FROM document d
    WHERE (p_user_name = '__admin__')
       OR NOT EXISTS (
              SELECT 1
              FROM documentpermissions dp
              WHERE dp.document_id = d.id
          )
       OR (
              p_user_name IS NOT NULL
          AND p_user_name <> ''
          AND EXISTS (
              SELECT 1
              FROM documentpermissions dp
              WHERE dp.document_id = d.id
                AND dp.type = 2 -- EFFECTIVE permissions
                AND dp.name = p_user_name
                AND dp.level >= COALESCE(p_min_level, 0)
          )
          );
$$;
