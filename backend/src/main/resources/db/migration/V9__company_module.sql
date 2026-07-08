ALTER TABLE companies
    DROP COLUMN estimated_ctc,
    DROP COLUMN estimated_stipend,
    DROP COLUMN ppo_available,
    DROP COLUMN ppo_ctc,
    ADD COLUMN logo_url TEXT,
    ADD COLUMN headquarters VARCHAR(255),
    ADD COLUMN founded_year INTEGER,
    ADD COLUMN description TEXT;

UPDATE companies SET logo_url = 'https://logo.clearbit.com/google.com', headquarters = 'Mountain View, CA', founded_year = 1998, description = 'Google LLC is an American multinational technology company.' WHERE id = '00000002-0000-0000-0000-000000000001';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/microsoft.com', headquarters = 'Redmond, WA', founded_year = 1975, description = 'Microsoft Corporation is an American multinational technology corporation.' WHERE id = '00000002-0000-0000-0000-000000000002';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/amazon.com', headquarters = 'Seattle, WA', founded_year = 1994, description = 'Amazon is an American multinational technology company.' WHERE id = '00000002-0000-0000-0000-000000000003';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/atlassian.com', headquarters = 'Sydney, Australia', founded_year = 2002, description = 'Atlassian is an Australian software company that develops products for software developers, project managers, and content management.' WHERE id = '00000002-0000-0000-0000-000000000004';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/uber.com', headquarters = 'San Francisco, CA', founded_year = 2009, description = 'Uber Technologies, Inc. is an American mobility as a service provider.' WHERE id = '00000002-0000-0000-0000-000000000005';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/adobe.com', headquarters = 'San Jose, CA', founded_year = 1982, description = 'Adobe Inc. is an American multinational computer software company.' WHERE id = '00000002-0000-0000-0000-000000000006';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/razorpay.com', headquarters = 'Bengaluru, India', founded_year = 2014, description = 'Razorpay is an Indian payment solution provider that allows businesses to accept, process and disburse payments.' WHERE id = '00000002-0000-0000-0000-000000000007';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/phonepe.com', headquarters = 'Bengaluru, India', founded_year = 2015, description = 'PhonePe is an Indian digital payments and financial services company.' WHERE id = '00000002-0000-0000-0000-000000000008';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/flipkart.com', headquarters = 'Bengaluru, India', founded_year = 2007, description = 'Flipkart Private Limited is an Indian e-commerce company.' WHERE id = '00000002-0000-0000-0000-000000000009';
UPDATE companies SET logo_url = 'https://logo.clearbit.com/salesforce.com', headquarters = 'San Francisco, CA', founded_year = 1999, description = 'Salesforce is an American cloud-based software company.' WHERE id = '00000002-0000-0000-0000-000000000010';
