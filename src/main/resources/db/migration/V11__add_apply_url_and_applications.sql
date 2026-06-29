ALTER TABLE opportunities RENAME COLUMN application_url TO apply_url;

UPDATE opportunities SET apply_url = 'https://careers.google.com/jobs/results/' WHERE title ILIKE '%Google%';
UPDATE opportunities SET apply_url = 'https://jobs.careers.microsoft.com/global/en/search' WHERE title ILIKE '%Microsoft%';
UPDATE opportunities SET apply_url = 'https://www.amazon.jobs/en/search' WHERE title ILIKE '%Amazon%';
UPDATE opportunities SET apply_url = 'https://careers.atlassian.com/search-results/' WHERE title ILIKE '%Atlassian%';
UPDATE opportunities SET apply_url = 'https://careers.adobe.com/us/en/search-results' WHERE title ILIKE '%Adobe%';
UPDATE opportunities SET apply_url = 'https://www.uber.com/global/en/careers/list/' WHERE title ILIKE '%Uber%';
UPDATE opportunities SET apply_url = 'https://phonepe.com/careers/' WHERE title ILIKE '%PhonePe%';
UPDATE opportunities SET apply_url = 'https://www.flipkartcareers.com/' WHERE title ILIKE '%Flipkart%';
UPDATE opportunities SET apply_url = 'https://careers.salesforce.com/en/jobs/' WHERE title ILIKE '%Salesforce%';
UPDATE opportunities SET apply_url = 'https://www.linkedin.com/jobs/' WHERE apply_url IS NULL;


UPDATE applications SET status = 'APPLIED' WHERE status = 'SAVED';
UPDATE applications SET status = 'ONLINE_ASSESSMENT' WHERE status = 'OA';
