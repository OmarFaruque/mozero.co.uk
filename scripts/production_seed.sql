-- Quick production seed script for Letterise
-- Run this in your Neon SQL Editor to populate the database

-- Insert categories
INSERT INTO categories (slug, name, description, icon, is_active) VALUES
('disputes', 'Dispute Letters', 'Challenge incorrect charges, billing errors, and service disputes', 'AlertCircle', true),
('insurance', 'Insurance', 'File claims for health, auto, property, and more', 'Shield', true),
('complaint', 'Complaint Letters', 'Formal complaints about products, services, and businesses', 'FileText', true),
('appeal', 'Appeals', 'Appeal denied claims, decisions, and administrative actions', 'Scale', true),
('official', 'Official Documents', 'Request records, certifications, and official correspondence', 'FileCheck', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert dispute templates
INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular) 
SELECT id, 'credit-card-dispute', 'Credit Card Dispute Letter', 'Dispute unauthorized or incorrect credit card charges', 
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"address","label":"Your Address","type":"textarea","required":true},{"id":"card_number","label":"Card Number (last 4 digits)","type":"text","required":true},{"id":"merchant","label":"Merchant Name","type":"text","required":true},{"id":"amount","label":"Disputed Amount","type":"text","required":true},{"id":"date","label":"Transaction Date","type":"date","required":true},{"id":"reason","label":"Reason for Dispute","type":"textarea","required":true}]',
'Generate a formal credit card dispute letter. Include card details, transaction information, and clear explanation of the dispute under the Consumer Credit Act 1974.',
true
FROM categories WHERE slug = 'disputes';

INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular)
SELECT id, 'debt-validation', 'Debt Validation Letter', 'Request validation of debt from collection agencies',
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"address","label":"Your Address","type":"textarea","required":true},{"id":"agency","label":"Collection Agency Name","type":"text","required":true},{"id":"reference","label":"Account/Reference Number","type":"text","required":true},{"id":"amount","label":"Claimed Debt Amount","type":"text","required":true}]',
'Generate a debt validation letter requesting proof of debt. Reference the Consumer Credit Act 1974 and request all supporting documentation.',
false
FROM categories WHERE slug = 'disputes';

-- Add a few more essential templates
INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular)
SELECT id, 'health-insurance-claim', 'Health Insurance Claim', 'Submit claims for medical treatments and procedures',
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"policy","label":"Policy Number","type":"text","required":true},{"id":"provider","label":"Healthcare Provider","type":"text","required":true},{"id":"treatment","label":"Treatment Description","type":"textarea","required":true},{"id":"cost","label":"Treatment Cost","type":"text","required":true},{"id":"date","label":"Treatment Date","type":"date","required":true}]',
'Generate a health insurance claim letter with treatment details, costs, and policy information.',
true
FROM categories WHERE slug = 'insurance';

INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular)
SELECT id, 'product-complaint', 'Product Complaint Letter', 'Formal complaints about defective or faulty products',
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"company","label":"Company Name","type":"text","required":true},{"id":"product","label":"Product Name","type":"text","required":true},{"id":"purchase_date","label":"Purchase Date","type":"date","required":true},{"id":"issue","label":"Description of Issue","type":"textarea","required":true},{"id":"resolution","label":"Desired Resolution","type":"textarea","required":true}]',
'Generate a formal product complaint letter citing the Consumer Rights Act 2015 and requesting appropriate remedy.',
true
FROM categories WHERE slug = 'complaint';

INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular)
SELECT id, 'insurance-claim-appeal', 'Insurance Claim Denial Appeal', 'Challenge denied insurance claims across all policy types',
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"policy","label":"Policy Number","type":"text","required":true},{"id":"claim_number","label":"Claim Number","type":"text","required":true},{"id":"denial_reason","label":"Reason for Denial","type":"textarea","required":true},{"id":"evidence","label":"Supporting Evidence","type":"textarea","required":true}]',
'Generate an insurance claim denial appeal letter with supporting evidence and policy references.',
true
FROM categories WHERE slug = 'appeal';

INSERT INTO templates (category_id, slug, title, description, question_form, ai_prompt, is_popular)
SELECT id, 'subject-access-request', 'Subject Access Request (GDPR)', 'Request your personal data from organizations under GDPR',
'[{"id":"name","label":"Your Full Name","type":"text","required":true},{"id":"organization","label":"Organization Name","type":"text","required":true},{"id":"relationship","label":"Your Relationship (e.g., customer, employee)","type":"text","required":true},{"id":"data_types","label":"Types of Data Requested","type":"textarea","required":true}]',
'Generate a GDPR Subject Access Request letter citing Article 15 rights and requesting complete personal data disclosure.',
true
FROM categories WHERE slug = 'official';
