
CREATE TABLE users (
    id                  UUID         NOT NULL DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL,
    name                VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    provider            VARCHAR(50)  NOT NULL,
    provider_user_id    VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_users                   PRIMARY KEY (id),
    CONSTRAINT uq_users_email             UNIQUE (email),
    CONSTRAINT uq_users_provider_identity UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_users_email ON users (email);

CREATE TABLE target_roles (
    id         UUID         NOT NULL DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_target_roles PRIMARY KEY (id),
    CONSTRAINT uq_target_roles_name UNIQUE (name)
);

CREATE TABLE user_target_roles (
    user_id        UUID NOT NULL,
    target_role_id UUID NOT NULL,

    CONSTRAINT pk_user_target_roles PRIMARY KEY (user_id, target_role_id),
    CONSTRAINT fk_utr_user        FOREIGN KEY (user_id)        REFERENCES users        (id) ON DELETE CASCADE,
    CONSTRAINT fk_utr_target_role FOREIGN KEY (target_role_id) REFERENCES target_roles (id) ON DELETE CASCADE
);

CREATE INDEX idx_utr_user_id        ON user_target_roles (user_id);
CREATE INDEX idx_utr_target_role_id ON user_target_roles (target_role_id);

CREATE TABLE resumes (
    id             UUID         NOT NULL DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL,
    file_name      VARCHAR(255) NOT NULL,
    storage_path   TEXT         NOT NULL,
    file_size      BIGINT,
    status         VARCHAR(50)  NOT NULL DEFAULT 'UPLOADED',
    extracted_text TEXT,
    uploaded_at    TIMESTAMP    NOT NULL DEFAULT now(),
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_resumes      PRIMARY KEY (id),
    CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_resumes_user_id ON resumes (user_id);
CREATE INDEX idx_resumes_status  ON resumes (status);

CREATE TABLE skills (
    id         UUID         NOT NULL DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_skills      PRIMARY KEY (id),
    CONSTRAINT uq_skills_name UNIQUE (name)
);

CREATE TABLE skill_aliases (
    id         UUID         NOT NULL DEFAULT gen_random_uuid(),
    skill_id   UUID         NOT NULL,
    alias      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_skill_aliases       PRIMARY KEY (id),
    CONSTRAINT uq_skill_aliases_alias UNIQUE (alias),
    CONSTRAINT fk_skill_aliases_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE INDEX idx_skill_aliases_skill_id ON skill_aliases (skill_id);
CREATE INDEX idx_skill_aliases_alias     ON skill_aliases (LOWER(alias));

CREATE TABLE user_skills (
    id         UUID      NOT NULL DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL,
    skill_id   UUID      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT pk_user_skills          PRIMARY KEY (id),
    CONSTRAINT uq_user_skills_pair     UNIQUE (user_id, skill_id),
    CONSTRAINT fk_user_skills_user     FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill    FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE INDEX idx_user_skills_user_id  ON user_skills (user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills (skill_id);

CREATE TABLE companies (
    id               UUID           NOT NULL DEFAULT gen_random_uuid(),
    name             VARCHAR(255)   NOT NULL,
    website          VARCHAR(512),
    industry         VARCHAR(255),
    employee_count   INTEGER,
    estimated_ctc    NUMERIC(15, 2),
    estimated_stipend NUMERIC(15, 2),
    ppo_available    BOOLEAN        NOT NULL DEFAULT FALSE,
    ppo_ctc          NUMERIC(15, 2),
    created_at       TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP      NOT NULL DEFAULT now(),

    CONSTRAINT pk_companies      PRIMARY KEY (id),
    CONSTRAINT uq_companies_name UNIQUE (name)
);

CREATE TABLE opportunities (
    id               UUID         NOT NULL DEFAULT gen_random_uuid(),
    company_id       UUID         NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    location         VARCHAR(255),
    work_mode        VARCHAR(50),
    employment_type  VARCHAR(50),
    application_url  TEXT,
    source           VARCHAR(255),
    external_id      VARCHAR(255),
    deduplication_key VARCHAR(255),
    posted_at        TIMESTAMP,
    expires_at       TIMESTAMP,
    created_at       TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_opportunities              PRIMARY KEY (id),
    CONSTRAINT uq_opportunities_source_external UNIQUE (source, external_id),
    CONSTRAINT fk_opportunities_company      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT
);

CREATE INDEX idx_opportunities_deduplication_key ON opportunities (deduplication_key);
CREATE INDEX idx_opportunities_company_id        ON opportunities (company_id);
CREATE INDEX idx_opportunities_employment_type   ON opportunities (employment_type);
CREATE INDEX idx_opportunities_work_mode         ON opportunities (work_mode);
CREATE INDEX idx_opportunities_posted_at         ON opportunities (posted_at DESC);
CREATE INDEX idx_opportunities_expires_at        ON opportunities (expires_at);



CREATE TABLE opportunity_skills (
    id             UUID        NOT NULL DEFAULT gen_random_uuid(),
    opportunity_id UUID        NOT NULL,
    skill_id       UUID        NOT NULL,
    priority       VARCHAR(50) NOT NULL DEFAULT 'REQUIRED',
    created_at     TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP   NOT NULL DEFAULT now(),

    CONSTRAINT pk_opportunity_skills              PRIMARY KEY (id),
    CONSTRAINT uq_opportunity_skills_pair         UNIQUE (opportunity_id, skill_id),
    CONSTRAINT fk_opportunity_skills_opportunity  FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) ON DELETE CASCADE,
    CONSTRAINT fk_opportunity_skills_skill        FOREIGN KEY (skill_id)       REFERENCES skills         (id) ON DELETE CASCADE
);

CREATE INDEX idx_opportunity_skills_opportunity_id ON opportunity_skills (opportunity_id);
CREATE INDEX idx_opportunity_skills_skill_id       ON opportunity_skills (skill_id);
CREATE INDEX idx_opportunity_skills_priority       ON opportunity_skills (priority);

CREATE TABLE applications (
    id             UUID        NOT NULL DEFAULT gen_random_uuid(),
    user_id        UUID        NOT NULL,
    opportunity_id UUID        NOT NULL,
    status         VARCHAR(50) NOT NULL DEFAULT 'SAVED',
    applied_at     TIMESTAMP,
    notes          TEXT,
    created_at     TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP   NOT NULL DEFAULT now(),

    CONSTRAINT pk_applications              PRIMARY KEY (id),
    CONSTRAINT uq_applications_user_opp    UNIQUE (user_id, opportunity_id),
    CONSTRAINT fk_applications_user        FOREIGN KEY (user_id)        REFERENCES users         (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_opportunity FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) ON DELETE CASCADE
);

CREATE INDEX idx_applications_user_id        ON applications (user_id);
CREATE INDEX idx_applications_opportunity_id ON applications (opportunity_id);
CREATE INDEX idx_applications_status         ON applications (status);

CREATE TABLE notifications (
    id         UUID         NOT NULL DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    type       VARCHAR(100) NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_notifications      PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id_is_read ON notifications (user_id, is_read);
CREATE INDEX idx_notifications_created_at      ON notifications (created_at DESC);

CREATE TABLE refresh_tokens (
    id         UUID      NOT NULL DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL,
    token      TEXT      NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT pk_refresh_tokens      PRIMARY KEY (id),
    CONSTRAINT uq_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);
