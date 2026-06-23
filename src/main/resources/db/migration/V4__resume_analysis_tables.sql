CREATE TABLE resume_skills (
    id         UUID      NOT NULL DEFAULT gen_random_uuid(),
    resume_id  UUID      NOT NULL,
    skill_id   UUID      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT pk_resume_skills           PRIMARY KEY (id),
    CONSTRAINT uq_resume_skills_pair      UNIQUE (resume_id, skill_id),
    CONSTRAINT fk_resume_skills_resume    FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE,
    CONSTRAINT fk_resume_skills_skill     FOREIGN KEY (skill_id)  REFERENCES skills  (id) ON DELETE CASCADE
);

CREATE INDEX idx_resume_skills_resume_id ON resume_skills (resume_id);
CREATE INDEX idx_resume_skills_skill_id  ON resume_skills (skill_id);

CREATE TABLE resume_educations (
    id             UUID         NOT NULL DEFAULT gen_random_uuid(),
    resume_id      UUID         NOT NULL,
    institution    VARCHAR(255),
    degree         VARCHAR(255),
    field_of_study VARCHAR(255),
    start_year     INTEGER,
    end_year       INTEGER,
    cgpa           VARCHAR(50),
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_resume_educations        PRIMARY KEY (id),
    CONSTRAINT fk_resume_educations_resume FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
);

CREATE INDEX idx_resume_educations_resume_id ON resume_educations (resume_id);

CREATE TABLE resume_experiences (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    resume_id   UUID         NOT NULL,
    company     VARCHAR(255),
    job_title   VARCHAR(255),
    start_date  VARCHAR(100),
    end_date    VARCHAR(100),
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_resume_experiences        PRIMARY KEY (id),
    CONSTRAINT fk_resume_experiences_resume FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
);

CREATE INDEX idx_resume_experiences_resume_id ON resume_experiences (resume_id);
