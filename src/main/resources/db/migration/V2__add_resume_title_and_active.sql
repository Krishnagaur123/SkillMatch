ALTER TABLE resumes
    ADD COLUMN title VARCHAR(255);

UPDATE resumes
SET title = file_name
WHERE title IS NULL;

ALTER TABLE resumes
    ALTER COLUMN title SET NOT NULL;

ALTER TABLE resumes
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
