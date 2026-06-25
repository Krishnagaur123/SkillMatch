ALTER TABLE opportunities
    ADD COLUMN experience_level VARCHAR(50),
    ADD COLUMN is_active        BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX idx_opportunities_experience_level ON opportunities (experience_level);
CREATE INDEX idx_opportunities_is_active        ON opportunities (is_active);

CREATE TABLE opportunity_target_roles (
    id             UUID      NOT NULL DEFAULT gen_random_uuid(),
    opportunity_id UUID      NOT NULL,
    target_role_id UUID      NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT pk_opportunity_target_roles             PRIMARY KEY (id),
    CONSTRAINT uq_opportunity_target_roles_pair        UNIQUE (opportunity_id, target_role_id),
    CONSTRAINT fk_opportunity_target_roles_opportunity FOREIGN KEY (opportunity_id) REFERENCES opportunities   (id) ON DELETE CASCADE,
    CONSTRAINT fk_opportunity_target_roles_target_role FOREIGN KEY (target_role_id) REFERENCES target_roles (id) ON DELETE CASCADE
);

CREATE INDEX idx_opportunity_target_roles_opportunity_id ON opportunity_target_roles (opportunity_id);
CREATE INDEX idx_opportunity_target_roles_target_role_id ON opportunity_target_roles (target_role_id);

INSERT INTO target_roles (id, name) VALUES
    ('00000001-0000-0000-0000-000000000001', 'Backend Engineer'),
    ('00000001-0000-0000-0000-000000000002', 'Frontend Engineer'),
    ('00000001-0000-0000-0000-000000000003', 'Full Stack Engineer'),
    ('00000001-0000-0000-0000-000000000004', 'DevOps Engineer'),
    ('00000001-0000-0000-0000-000000000005', 'Data Engineer'),
    ('00000001-0000-0000-0000-000000000006', 'Machine Learning Engineer'),
    ('00000001-0000-0000-0000-000000000007', 'Mobile Engineer'),
    ('00000001-0000-0000-0000-000000000008', 'Site Reliability Engineer')
ON CONFLICT ON CONSTRAINT uq_target_roles_name DO NOTHING;

INSERT INTO companies (id, name, website, industry) VALUES
    ('00000002-0000-0000-0000-000000000001', 'Google',     'https://careers.google.com',     'Technology'),
    ('00000002-0000-0000-0000-000000000002', 'Microsoft',  'https://careers.microsoft.com',  'Technology'),
    ('00000002-0000-0000-0000-000000000003', 'Amazon',     'https://amazon.jobs',            'E-Commerce / Cloud'),
    ('00000002-0000-0000-0000-000000000004', 'Atlassian',  'https://www.atlassian.com/company/careers', 'Software'),
    ('00000002-0000-0000-0000-000000000005', 'Uber',       'https://www.uber.com/us/en/careers', 'Mobility'),
    ('00000002-0000-0000-0000-000000000006', 'Adobe',      'https://www.adobe.com/careers.html', 'Software'),
    ('00000002-0000-0000-0000-000000000007', 'Razorpay',   'https://razorpay.com/jobs',      'Fintech'),
    ('00000002-0000-0000-0000-000000000008', 'PhonePe',    'https://www.phonepe.com/careers', 'Fintech'),
    ('00000002-0000-0000-0000-000000000009', 'Flipkart',   'https://www.flipkartcareers.com', 'E-Commerce'),
    ('00000002-0000-0000-0000-000000000010', 'Salesforce', 'https://www.salesforce.com/company/careers', 'CRM / Cloud')
ON CONFLICT ON CONSTRAINT uq_companies_name DO NOTHING;

INSERT INTO opportunities (
    id, company_id, title, description, location, employment_type, experience_level,
    application_url, source, external_id, posted_at, expires_at, is_active
) VALUES

    (
        '00000003-0000-0000-0000-000000000001',
        '00000002-0000-0000-0000-000000000001',
        'Software Engineer III – Backend',
        'Join Google''s core infrastructure team to design and build scalable distributed systems. You will work on high-throughput services used by billions of users, collaborate with SRE teams, and contribute to open-source projects.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://careers.google.com/jobs/results/backend-swe-3',
        'Google Careers', 'google-be-swe3-blr-001',
        '2026-06-01 09:00:00', '2026-08-01 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000002',
        '00000002-0000-0000-0000-000000000001',
        'Software Engineering Intern – Summer 2026',
        'Google STEP intern programme. Work alongside full-time engineers on real infrastructure problems. Projects span across Search, Ads, Cloud, and YouTube. Mentorship provided throughout the internship.',
        'Hyderabad, India',
        'INTERN', 'INTERN',
        'https://careers.google.com/jobs/results/step-intern-2026',
        'Google Careers', 'google-intern-hyd-001',
        '2026-06-05 09:00:00', '2026-07-20 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000003',
        '00000002-0000-0000-0000-000000000002',
        'Senior Software Engineer – Azure Compute',
        'Be part of the team that powers Microsoft Azure''s compute fabric. Design multi-region resilient services, drive performance engineering, and mentor junior engineers. Requires deep expertise in distributed systems and cloud-native architecture.',
        'Hyderabad, India',
        'FULL_TIME', 'SENIOR',
        'https://careers.microsoft.com/us/en/job/azure-compute-senior',
        'Microsoft Careers', 'ms-azure-compute-hyd-001',
        '2026-06-03 09:00:00', '2026-08-15 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000004',
        '00000002-0000-0000-0000-000000000002',
        'Software Development Engineer – Full Stack',
        'Microsoft Teams is looking for a full stack engineer to own features end-to-end from backend API design to React UI. The ideal candidate is comfortable working across TypeScript/Node.js backends and modern React frontends.',
        'Bengaluru, India',
        'FULL_TIME', 'ENTRY',
        'https://careers.microsoft.com/us/en/job/teams-fullstack-blr',
        'Microsoft Careers', 'ms-teams-fs-blr-001',
        '2026-06-07 09:00:00', '2026-08-10 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000005',
        '00000002-0000-0000-0000-000000000003',
        'Software Development Engineer II – Amazon Pay',
        'Amazon Pay is hiring an SDE-II to scale payment infrastructure handling millions of daily transactions. You will design microservices, work with Kafka event streams, and ensure 99.999% availability.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://amazon.jobs/en/jobs/sde2-amazon-pay-blr',
        'Amazon Jobs', 'amz-pay-sde2-blr-001',
        '2026-06-02 09:00:00', '2026-07-31 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000006',
        '00000002-0000-0000-0000-000000000003',
        'DevOps Engineer – AWS Platform',
        'Join the AWS Platform engineering team to build and maintain CI/CD pipelines, manage Kubernetes clusters at scale, and drive infrastructure-as-code adoption using Terraform and Ansible.',
        'Chennai, India',
        'FULL_TIME', 'MID',
        'https://amazon.jobs/en/jobs/devops-aws-platform-che',
        'Amazon Jobs', 'amz-devops-aws-che-001',
        '2026-06-04 09:00:00', '2026-08-04 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000007',
        '00000002-0000-0000-0000-000000000004',
        'Backend Software Engineer – Jira Platform',
        'Atlassian is growing the Jira Platform team. You will build APIs consumed by hundreds of thousands of development teams worldwide, work with Kotlin microservices, Kafka, and Elasticsearch.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://www.atlassian.com/company/careers/detail/jira-be-blr',
        'Atlassian Careers', 'atl-jira-be-blr-001',
        '2026-06-06 09:00:00', '2026-08-20 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000008',
        '00000002-0000-0000-0000-000000000004',
        'Frontend Engineer – Confluence',
        'Build the next generation of Confluence using React and TypeScript. Own features from design to production, collaborate with design systems, and drive web performance improvements across the product.',
        'Sydney, Australia',
        'FULL_TIME', 'ENTRY',
        'https://www.atlassian.com/company/careers/detail/confluence-fe-syd',
        'Atlassian Careers', 'atl-confluence-fe-syd-001',
        '2026-06-08 09:00:00', '2026-08-08 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000009',
        '00000002-0000-0000-0000-000000000005',
        'Senior Backend Engineer – Uber Eats',
        'Scale the Uber Eats marketplace backend to handle millions of order events per minute. Work with Go microservices, Kafka streams, and Cassandra. Drive system design and partner with product to ship impactful features.',
        'Bengaluru, India',
        'FULL_TIME', 'SENIOR',
        'https://www.uber.com/us/en/careers/list/uber-eats-senior-be-blr',
        'Uber Careers', 'uber-eats-sbe-blr-001',
        '2026-06-03 09:00:00', '2026-08-03 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000010',
        '00000002-0000-0000-0000-000000000005',
        'Site Reliability Engineer – Core Platform',
        'Uber''s SRE team is looking for engineers to ensure the reliability of core platform services. You will own SLOs, drive incident response, build observability tooling, and automate toil using Python and Kubernetes.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://www.uber.com/us/en/careers/list/sre-core-blr',
        'Uber Careers', 'uber-sre-core-blr-001',
        '2026-06-05 09:00:00', '2026-08-05 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000011',
        '00000002-0000-0000-0000-000000000006',
        'Software Engineer – Adobe Experience Platform',
        'Adobe is hiring an engineer to work on Adobe Experience Platform, an industry-leading data platform. You will build data pipelines, REST APIs, and work closely with the ML team using Java and Python.',
        'Noida, India',
        'FULL_TIME', 'MID',
        'https://www.adobe.com/careers/job/aep-swe-noida',
        'Adobe Careers', 'adobe-aep-swe-noida-001',
        '2026-06-07 09:00:00', '2026-08-07 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000012',
        '00000002-0000-0000-0000-000000000006',
        'ML Engineer – Document Intelligence',
        'Join Adobe''s Document Intelligence team to build machine learning models for PDF understanding, layout detection, and content extraction. Work with PyTorch, Python, and large-scale document datasets.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://www.adobe.com/careers/job/doc-intelligence-mle-blr',
        'Adobe Careers', 'adobe-mle-doc-blr-001',
        '2026-06-09 09:00:00', '2026-08-09 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000013',
        '00000002-0000-0000-0000-000000000007',
        'Backend Engineer – Payments Infrastructure',
        'Razorpay is building the future of Indian fintech. As a backend engineer on the Payments Infrastructure team you will design APIs processing billions of rupees daily, work with Java/Spring Boot, PostgreSQL, and Kafka.',
        'Bengaluru, India',
        'FULL_TIME', 'ENTRY',
        'https://razorpay.com/jobs/backend-payments-infra-blr',
        'Razorpay Careers', 'razorpay-be-payments-blr-001',
        '2026-06-01 09:00:00', '2026-07-25 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000014',
        '00000002-0000-0000-0000-000000000007',
        'Software Engineering Intern – Razorpay X',
        'Razorpay X is a neobanking product for businesses. Intern in our team to build real features shipped to thousands of businesses. Work with Spring Boot, React, PostgreSQL, and learn best practices in a high-growth startup.',
        'Bengaluru, India',
        'INTERN', 'INTERN',
        'https://razorpay.com/jobs/intern-razorpayx-blr',
        'Razorpay Careers', 'razorpay-intern-x-blr-001',
        '2026-06-10 09:00:00', '2026-07-31 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000015',
        '00000002-0000-0000-0000-000000000008',
        'Senior Backend Engineer – PhonePe Switch',
        'PhonePe Switch is a mini-app platform. Help architect the backend that supports 500M users. You will lead design of high-performance Java services, work with Kafka and Redis, and collaborate with front-end and product teams.',
        'Bengaluru, India',
        'FULL_TIME', 'SENIOR',
        'https://www.phonepe.com/careers/job/switch-senior-be-blr',
        'PhonePe Careers', 'phonepe-switch-sbe-blr-001',
        '2026-06-02 09:00:00', '2026-08-02 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000016',
        '00000002-0000-0000-0000-000000000008',
        'Data Engineer – Analytics Platform',
        'Build and maintain PhonePe''s analytics data platform processing petabytes of transaction data. Skills required: Python, Kafka, Spark, PostgreSQL. Drive data quality initiatives and enable business intelligence across the company.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://www.phonepe.com/careers/job/data-engineer-analytics-blr',
        'PhonePe Careers', 'phonepe-de-analytics-blr-001',
        '2026-06-06 09:00:00', '2026-08-06 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000017',
        '00000002-0000-0000-0000-000000000009',
        'SDE-I – Search & Discovery',
        'Flipkart''s Search & Discovery team powers product search for 400M customers. As SDE-I you will build search ranking APIs, work with Elasticsearch and Java Spring Boot, and ship A/B experiments that directly impact conversion.',
        'Bengaluru, India',
        'FULL_TIME', 'ENTRY',
        'https://www.flipkartcareers.com/job/sde1-search-blr',
        'Flipkart Careers', 'flipkart-sde1-search-blr-001',
        '2026-06-04 09:00:00', '2026-07-28 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000018',
        '00000002-0000-0000-0000-000000000009',
        'DevOps Engineer – Cloud Infrastructure',
        'Flipkart is seeking a DevOps engineer to manage Kubernetes clusters, build CI/CD pipelines, and drive cloud cost optimisation using Terraform. You will work alongside application teams to ensure platform reliability.',
        'Bengaluru, India',
        'FULL_TIME', 'MID',
        'https://www.flipkartcareers.com/job/devops-cloud-infra-blr',
        'Flipkart Careers', 'flipkart-devops-cloud-blr-001',
        '2026-06-08 09:00:00', '2026-08-08 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000019',
        '00000002-0000-0000-0000-000000000010',
        'Software Engineer – Salesforce Core Platform',
        'Salesforce Core Platform team is hiring. Build the trusted multi-tenant cloud that underpins all Salesforce products. You will work with Java, distributed systems, and REST APIs at massive scale.',
        'Hyderabad, India',
        'FULL_TIME', 'MID',
        'https://www.salesforce.com/company/careers/job/core-swe-hyd',
        'Salesforce Careers', 'sf-core-swe-hyd-001',
        '2026-06-05 09:00:00', '2026-08-05 23:59:59', TRUE
    ),

    (
        '00000003-0000-0000-0000-000000000020',
        '00000002-0000-0000-0000-000000000010',
        'Senior Full Stack Engineer – Salesforce Heroku',
        'Heroku is hiring a senior full stack engineer to improve the developer experience of its PaaS platform. You will build Node.js backend services, a React dashboard, and integrate with cloud infrastructure APIs.',
        'Hyderabad, India',
        'FULL_TIME', 'SENIOR',
        'https://www.salesforce.com/company/careers/job/heroku-senior-fs-hyd',
        'Salesforce Careers', 'sf-heroku-sfe-hyd-001',
        '2026-06-09 09:00:00', '2026-08-20 23:59:59', TRUE
    );

INSERT INTO opportunity_skills (id, opportunity_id, skill_id, priority)
SELECT gen_random_uuid(), opp.id, s.id, 'REQUIRED'
FROM (VALUES
    ('00000003-0000-0000-0000-000000000001', 'Java'),
    ('00000003-0000-0000-0000-000000000001', 'Spring Boot'),
    ('00000003-0000-0000-0000-000000000001', 'Microservices'),
    ('00000003-0000-0000-0000-000000000001', 'Kubernetes'),
    ('00000003-0000-0000-0000-000000000001', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000001', 'System Design'),
    ('00000003-0000-0000-0000-000000000001', 'Docker'),

    ('00000003-0000-0000-0000-000000000002', 'Java'),
    ('00000003-0000-0000-0000-000000000002', 'Python'),
    ('00000003-0000-0000-0000-000000000002', 'Data Structures'),
    ('00000003-0000-0000-0000-000000000002', 'Algorithms'),
    ('00000003-0000-0000-0000-000000000002', 'Git'),

    ('00000003-0000-0000-0000-000000000003', 'Java'),
    ('00000003-0000-0000-0000-000000000003', 'Microservices'),
    ('00000003-0000-0000-0000-000000000003', 'Kubernetes'),
    ('00000003-0000-0000-0000-000000000003', 'Azure'),
    ('00000003-0000-0000-0000-000000000003', 'System Design'),
    ('00000003-0000-0000-0000-000000000003', 'Docker'),
    ('00000003-0000-0000-0000-000000000003', 'Terraform'),

    ('00000003-0000-0000-0000-000000000004', 'TypeScript'),
    ('00000003-0000-0000-0000-000000000004', 'Node.js'),
    ('00000003-0000-0000-0000-000000000004', 'React'),
    ('00000003-0000-0000-0000-000000000004', 'REST'),
    ('00000003-0000-0000-0000-000000000004', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000004', 'Docker'),

    ('00000003-0000-0000-0000-000000000005', 'Java'),
    ('00000003-0000-0000-0000-000000000005', 'Spring Boot'),
    ('00000003-0000-0000-0000-000000000005', 'Kafka'),
    ('00000003-0000-0000-0000-000000000005', 'Microservices'),
    ('00000003-0000-0000-0000-000000000005', 'System Design'),
    ('00000003-0000-0000-0000-000000000005', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000005', 'Redis'),

    ('00000003-0000-0000-0000-000000000006', 'Kubernetes'),
    ('00000003-0000-0000-0000-000000000006', 'Terraform'),
    ('00000003-0000-0000-0000-000000000006', 'Docker'),
    ('00000003-0000-0000-0000-000000000006', 'CI/CD'),
    ('00000003-0000-0000-0000-000000000006', 'AWS'),
    ('00000003-0000-0000-0000-000000000006', 'Ansible'),
    ('00000003-0000-0000-0000-000000000006', 'Python'),

    ('00000003-0000-0000-0000-000000000007', 'Kotlin'),
    ('00000003-0000-0000-0000-000000000007', 'Kafka'),
    ('00000003-0000-0000-0000-000000000007', 'Elasticsearch'),
    ('00000003-0000-0000-0000-000000000007', 'Microservices'),
    ('00000003-0000-0000-0000-000000000007', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000007', 'REST'),

    ('00000003-0000-0000-0000-000000000008', 'React'),
    ('00000003-0000-0000-0000-000000000008', 'TypeScript'),
    ('00000003-0000-0000-0000-000000000008', 'GraphQL'),
    ('00000003-0000-0000-0000-000000000008', 'CSS'),
    ('00000003-0000-0000-0000-000000000008', 'HTML'),
    ('00000003-0000-0000-0000-000000000008', 'Node.js'),

    ('00000003-0000-0000-0000-000000000009', 'Go'),
    ('00000003-0000-0000-0000-000000000009', 'Kafka'),
    ('00000003-0000-0000-0000-000000000009', 'Cassandra'),
    ('00000003-0000-0000-0000-000000000009', 'Microservices'),
    ('00000003-0000-0000-0000-000000000009', 'System Design'),
    ('00000003-0000-0000-0000-000000000009', 'Redis'),
    ('00000003-0000-0000-0000-000000000009', 'Docker'),

    ('00000003-0000-0000-0000-000000000010', 'Python'),
    ('00000003-0000-0000-0000-000000000010', 'Kubernetes'),
    ('00000003-0000-0000-0000-000000000010', 'Docker'),
    ('00000003-0000-0000-0000-000000000010', 'CI/CD'),
    ('00000003-0000-0000-0000-000000000010', 'Linux'),
    ('00000003-0000-0000-0000-000000000010', 'Terraform'),

    ('00000003-0000-0000-0000-000000000011', 'Java'),
    ('00000003-0000-0000-0000-000000000011', 'Python'),
    ('00000003-0000-0000-0000-000000000011', 'REST'),
    ('00000003-0000-0000-0000-000000000011', 'Kafka'),
    ('00000003-0000-0000-0000-000000000011', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000011', 'Docker'),

    ('00000003-0000-0000-0000-000000000012', 'Python'),
    ('00000003-0000-0000-0000-000000000012', 'PyTorch'),
    ('00000003-0000-0000-0000-000000000012', 'Machine Learning'),
    ('00000003-0000-0000-0000-000000000012', 'Deep Learning'),
    ('00000003-0000-0000-0000-000000000012', 'TensorFlow'),
    ('00000003-0000-0000-0000-000000000012', 'Docker'),

    ('00000003-0000-0000-0000-000000000013', 'Java'),
    ('00000003-0000-0000-0000-000000000013', 'Spring Boot'),
    ('00000003-0000-0000-0000-000000000013', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000013', 'Kafka'),
    ('00000003-0000-0000-0000-000000000013', 'REST'),
    ('00000003-0000-0000-0000-000000000013', 'Redis'),

    ('00000003-0000-0000-0000-000000000014', 'Java'),
    ('00000003-0000-0000-0000-000000000014', 'Spring Boot'),
    ('00000003-0000-0000-0000-000000000014', 'React'),
    ('00000003-0000-0000-0000-000000000014', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000014', 'Git'),

    ('00000003-0000-0000-0000-000000000015', 'Java'),
    ('00000003-0000-0000-0000-000000000015', 'Kafka'),
    ('00000003-0000-0000-0000-000000000015', 'Redis'),
    ('00000003-0000-0000-0000-000000000015', 'Microservices'),
    ('00000003-0000-0000-0000-000000000015', 'System Design'),
    ('00000003-0000-0000-0000-000000000015', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000015', 'Spring Boot'),

    ('00000003-0000-0000-0000-000000000016', 'Python'),
    ('00000003-0000-0000-0000-000000000016', 'Kafka'),
    ('00000003-0000-0000-0000-000000000016', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000016', 'Elasticsearch'),
    ('00000003-0000-0000-0000-000000000016', 'Docker'),

    ('00000003-0000-0000-0000-000000000017', 'Java'),
    ('00000003-0000-0000-0000-000000000017', 'Spring Boot'),
    ('00000003-0000-0000-0000-000000000017', 'Elasticsearch'),
    ('00000003-0000-0000-0000-000000000017', 'REST'),
    ('00000003-0000-0000-0000-000000000017', 'Algorithms'),
    ('00000003-0000-0000-0000-000000000017', 'Data Structures'),

    ('00000003-0000-0000-0000-000000000018', 'Kubernetes'),
    ('00000003-0000-0000-0000-000000000018', 'Terraform'),
    ('00000003-0000-0000-0000-000000000018', 'Docker'),
    ('00000003-0000-0000-0000-000000000018', 'CI/CD'),
    ('00000003-0000-0000-0000-000000000018', 'AWS'),
    ('00000003-0000-0000-0000-000000000018', 'Helm'),

    ('00000003-0000-0000-0000-000000000019', 'Java'),
    ('00000003-0000-0000-0000-000000000019', 'Microservices'),
    ('00000003-0000-0000-0000-000000000019', 'REST'),
    ('00000003-0000-0000-0000-000000000019', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000019', 'System Design'),
    ('00000003-0000-0000-0000-000000000019', 'AWS'),

    ('00000003-0000-0000-0000-000000000020', 'Node.js'),
    ('00000003-0000-0000-0000-000000000020', 'TypeScript'),
    ('00000003-0000-0000-0000-000000000020', 'React'),
    ('00000003-0000-0000-0000-000000000020', 'REST'),
    ('00000003-0000-0000-0000-000000000020', 'PostgreSQL'),
    ('00000003-0000-0000-0000-000000000020', 'Docker'),
    ('00000003-0000-0000-0000-000000000020', 'AWS')
) AS data(opp_id, skill_name)
JOIN opportunities opp ON opp.id = data.opp_id::uuid
JOIN skills s ON s.name = data.skill_name
ON CONFLICT ON CONSTRAINT uq_opportunity_skills_pair DO NOTHING;

INSERT INTO opportunity_target_roles (id, opportunity_id, target_role_id)
SELECT gen_random_uuid(), opp.id, tr.id
FROM (VALUES
    ('00000003-0000-0000-0000-000000000001', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000002', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000003', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000003', 'Site Reliability Engineer'),
    ('00000003-0000-0000-0000-000000000004', 'Full Stack Engineer'),
    ('00000003-0000-0000-0000-000000000004', 'Frontend Engineer'),
    ('00000003-0000-0000-0000-000000000005', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000006', 'DevOps Engineer'),
    ('00000003-0000-0000-0000-000000000006', 'Site Reliability Engineer'),
    ('00000003-0000-0000-0000-000000000007', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000008', 'Frontend Engineer'),
    ('00000003-0000-0000-0000-000000000009', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000010', 'Site Reliability Engineer'),
    ('00000003-0000-0000-0000-000000000010', 'DevOps Engineer'),
    ('00000003-0000-0000-0000-000000000011', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000012', 'Machine Learning Engineer'),
    ('00000003-0000-0000-0000-000000000013', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000014', 'Full Stack Engineer'),
    ('00000003-0000-0000-0000-000000000014', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000015', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000016', 'Data Engineer'),
    ('00000003-0000-0000-0000-000000000017', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000018', 'DevOps Engineer'),
    ('00000003-0000-0000-0000-000000000019', 'Backend Engineer'),
    ('00000003-0000-0000-0000-000000000020', 'Full Stack Engineer'),
    ('00000003-0000-0000-0000-000000000020', 'Frontend Engineer')
) AS data(opp_id, role_name)
JOIN opportunities opp ON opp.id = data.opp_id::uuid
JOIN target_roles tr ON tr.name = data.role_name
ON CONFLICT ON CONSTRAINT uq_opportunity_target_roles_pair DO NOTHING;
