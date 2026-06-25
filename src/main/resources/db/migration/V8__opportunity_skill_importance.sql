ALTER TABLE opportunity_skills
    RENAME COLUMN priority TO importance;

UPDATE opportunity_skills os
SET importance = data.importance
FROM (
    SELECT opp.id AS opp_id, s.id AS skill_id, data.importance
    FROM (VALUES
        -- OPP 1: Google – Software Engineer III – Backend (Mid)
        ('00000003-0000-0000-0000-000000000001', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000001', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000001', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000001', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000001', 'System Design',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000001', 'Kubernetes',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000001', 'Docker',         'PREFERRED'),

        -- OPP 2: Google – Software Engineering Intern (Intern)
        ('00000003-0000-0000-0000-000000000002', 'Data Structures','REQUIRED'),
        ('00000003-0000-0000-0000-000000000002', 'Algorithms',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000002', 'Java',           'PREFERRED'),
        ('00000003-0000-0000-0000-000000000002', 'Python',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000002', 'Git',            'GOOD_TO_HAVE'),

        -- OPP 3: Microsoft – Senior Software Engineer – Azure Compute (Senior)
        ('00000003-0000-0000-0000-000000000003', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000003', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000003', 'System Design',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000003', 'Azure',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000003', 'Kubernetes',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000003', 'Docker',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000003', 'Terraform',      'GOOD_TO_HAVE'),

        -- OPP 4: Microsoft – SDE Full Stack (Entry)
        ('00000003-0000-0000-0000-000000000004', 'TypeScript',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000004', 'React',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000004', 'Node.js',        'REQUIRED'),
        ('00000003-0000-0000-0000-000000000004', 'REST',           'PREFERRED'),
        ('00000003-0000-0000-0000-000000000004', 'PostgreSQL',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000004', 'Docker',         'GOOD_TO_HAVE'),

        -- OPP 5: Amazon – SDE-II Amazon Pay (Mid)
        ('00000003-0000-0000-0000-000000000005', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000005', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000005', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000005', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000005', 'Kafka',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000005', 'System Design',  'PREFERRED'),
        ('00000003-0000-0000-0000-000000000005', 'Redis',          'GOOD_TO_HAVE'),

        -- OPP 6: Amazon – DevOps Engineer AWS Platform (Mid)
        ('00000003-0000-0000-0000-000000000006', 'Kubernetes',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000006', 'Terraform',      'REQUIRED'),
        ('00000003-0000-0000-0000-000000000006', 'CI/CD',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000006', 'AWS',            'REQUIRED'),
        ('00000003-0000-0000-0000-000000000006', 'Docker',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000006', 'Python',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000006', 'Ansible',        'GOOD_TO_HAVE'),

        -- OPP 7: Atlassian – Backend Software Engineer Jira (Mid)
        ('00000003-0000-0000-0000-000000000007', 'Kotlin',         'REQUIRED'),
        ('00000003-0000-0000-0000-000000000007', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000007', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000007', 'REST',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000007', 'Kafka',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000007', 'Elasticsearch',  'GOOD_TO_HAVE'),

        -- OPP 8: Atlassian – Frontend Engineer Confluence (Entry)
        ('00000003-0000-0000-0000-000000000008', 'React',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000008', 'TypeScript',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000008', 'CSS',            'REQUIRED'),
        ('00000003-0000-0000-0000-000000000008', 'HTML',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000008', 'GraphQL',        'PREFERRED'),
        ('00000003-0000-0000-0000-000000000008', 'Node.js',        'GOOD_TO_HAVE'),

        -- OPP 9: Uber – Senior Backend Engineer Uber Eats (Senior)
        ('00000003-0000-0000-0000-000000000009', 'Go',             'REQUIRED'),
        ('00000003-0000-0000-0000-000000000009', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000009', 'System Design',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000009', 'Kafka',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000009', 'Cassandra',      'PREFERRED'),
        ('00000003-0000-0000-0000-000000000009', 'Redis',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000009', 'Docker',         'GOOD_TO_HAVE'),

        -- OPP 10: Uber – SRE Core Platform (Mid)
        ('00000003-0000-0000-0000-000000000010', 'Kubernetes',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000010', 'Python',         'REQUIRED'),
        ('00000003-0000-0000-0000-000000000010', 'Linux',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000010', 'CI/CD',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000010', 'Docker',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000010', 'Terraform',      'GOOD_TO_HAVE'),

        -- OPP 11: Adobe – Software Engineer AEP (Mid)
        ('00000003-0000-0000-0000-000000000011', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000011', 'REST',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000011', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000011', 'Python',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000011', 'Kafka',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000011', 'Docker',         'GOOD_TO_HAVE'),

        -- OPP 12: Adobe – ML Engineer Document Intelligence (Mid)
        ('00000003-0000-0000-0000-000000000012', 'Python',         'REQUIRED'),
        ('00000003-0000-0000-0000-000000000012', 'PyTorch',        'REQUIRED'),
        ('00000003-0000-0000-0000-000000000012', 'Machine Learning','REQUIRED'),
        ('00000003-0000-0000-0000-000000000012', 'Deep Learning',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000012', 'TensorFlow',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000012', 'Docker',         'GOOD_TO_HAVE'),

        -- OPP 13: Razorpay – Backend Engineer Payments Infrastructure (Entry)
        ('00000003-0000-0000-0000-000000000013', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000013', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000013', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000013', 'REST',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000013', 'Kafka',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000013', 'Redis',          'GOOD_TO_HAVE'),

        -- OPP 14: Razorpay – Software Engineering Intern Razorpay X (Intern)
        ('00000003-0000-0000-0000-000000000014', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000014', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000014', 'PostgreSQL',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000014', 'React',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000014', 'Git',            'GOOD_TO_HAVE'),

        -- OPP 15: PhonePe – Senior Backend Engineer Switch (Senior)
        ('00000003-0000-0000-0000-000000000015', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000015', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000015', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000015', 'System Design',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000015', 'Kafka',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000015', 'Redis',          'PREFERRED'),
        ('00000003-0000-0000-0000-000000000015', 'PostgreSQL',     'GOOD_TO_HAVE'),

        -- OPP 16: PhonePe – Data Engineer Analytics Platform (Mid)
        ('00000003-0000-0000-0000-000000000016', 'Python',         'REQUIRED'),
        ('00000003-0000-0000-0000-000000000016', 'Kafka',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000016', 'PostgreSQL',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000016', 'Elasticsearch',  'PREFERRED'),
        ('00000003-0000-0000-0000-000000000016', 'Docker',         'GOOD_TO_HAVE'),

        -- OPP 17: Flipkart – SDE-I Search & Discovery (Entry)
        ('00000003-0000-0000-0000-000000000017', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000017', 'Spring Boot',    'REQUIRED'),
        ('00000003-0000-0000-0000-000000000017', 'Data Structures','REQUIRED'),
        ('00000003-0000-0000-0000-000000000017', 'Algorithms',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000017', 'Elasticsearch',  'PREFERRED'),
        ('00000003-0000-0000-0000-000000000017', 'REST',           'GOOD_TO_HAVE'),

        -- OPP 18: Flipkart – DevOps Engineer Cloud Infrastructure (Mid)
        ('00000003-0000-0000-0000-000000000018', 'Kubernetes',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000018', 'Terraform',      'REQUIRED'),
        ('00000003-0000-0000-0000-000000000018', 'CI/CD',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000018', 'Docker',         'REQUIRED'),
        ('00000003-0000-0000-0000-000000000018', 'AWS',            'PREFERRED'),
        ('00000003-0000-0000-0000-000000000018', 'Helm',           'GOOD_TO_HAVE'),

        -- OPP 19: Salesforce – Software Engineer Core Platform (Mid)
        ('00000003-0000-0000-0000-000000000019', 'Java',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000019', 'Microservices',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000019', 'REST',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000019', 'System Design',  'REQUIRED'),
        ('00000003-0000-0000-0000-000000000019', 'PostgreSQL',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000019', 'AWS',            'GOOD_TO_HAVE'),

        -- OPP 20: Salesforce – Senior Full Stack Engineer Heroku (Senior)
        ('00000003-0000-0000-0000-000000000020', 'Node.js',        'REQUIRED'),
        ('00000003-0000-0000-0000-000000000020', 'TypeScript',     'REQUIRED'),
        ('00000003-0000-0000-0000-000000000020', 'React',          'REQUIRED'),
        ('00000003-0000-0000-0000-000000000020', 'REST',           'REQUIRED'),
        ('00000003-0000-0000-0000-000000000020', 'PostgreSQL',     'PREFERRED'),
        ('00000003-0000-0000-0000-000000000020', 'Docker',         'PREFERRED'),
        ('00000003-0000-0000-0000-000000000020', 'AWS',            'GOOD_TO_HAVE')
    ) AS data(opp_id, skill_name, importance)
    JOIN opportunities opp ON opp.id = data.opp_id::uuid
    JOIN skills s ON s.name = data.skill_name
) AS data
WHERE os.opportunity_id = data.opp_id
  AND os.skill_id = data.skill_id;
