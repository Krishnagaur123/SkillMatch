CREATE TABLE user_profiles (
    id                   UUID         NOT NULL DEFAULT gen_random_uuid(),
    user_id              UUID         NOT NULL,
    headline             VARCHAR(255),
    about                TEXT,
    institution_name     VARCHAR(255),
    degree_name          VARCHAR(255),
    field_of_study       VARCHAR(255),
    graduation_year      INTEGER,
    cgpa                 DOUBLE PRECISION,
    experience_level     VARCHAR(50),
    current_organization VARCHAR(255),
    phone_number         VARCHAR(50),
    city                 VARCHAR(100),
    state                VARCHAR(100),
    country              VARCHAR(100),
    linkedin_url         VARCHAR(512),
    github_url           VARCHAR(512),
    portfolio_url        VARCHAR(512),
    leetcode_url         VARCHAR(512),
    codeforces_url       VARCHAR(512),
    preferred_work_mode  VARCHAR(50),
    open_to_work         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT pk_user_profiles PRIMARY KEY (id),
    CONSTRAINT uq_user_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles (user_id);
