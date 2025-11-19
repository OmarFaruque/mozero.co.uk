-- Insurance Templates for the Insurance category (slug: 'insurance')
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Claim Payout Dispute',
  'claim-payout-dispute',
  'Challenge an unfair or undervalued insurance claim payout',
  '[
    {"id":"insurer_name","label":"Insurance Company Name","type":"text","required":true},
    {"id":"policy_number","label":"Policy Number","type":"text","required":true},
    {"id":"claim_number","label":"Claim Number","type":"text","required":true},
    {"id":"claim_date","label":"Date Claim Was Filed","type":"date","required":true},
    {"id":"payout_offered","label":"Payout Amount Offered","type":"text","required":true},
    {"id":"amount_expected","label":"Amount You Expected","type":"text","required":true},
    {"id":"reason_dispute","label":"Why is the payout unfair?","type":"textarea","required":true},
    {"id":"evidence","label":"Supporting Evidence","type":"textarea","required":false}
  ]'::jsonb,
  'You are an expert at writing insurance claim payout dispute letters. Generate a professional letter that challenges the inadequate payout amount, references policy terms, provides supporting evidence for the higher valuation, and requests reconsideration or escalation to the Financial Ombudsman.',
  92
FROM categories c WHERE c.slug = 'insurance'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Rejecting an Unfair Rejection',
  'rejecting-unfair-rejection',
  'Challenge an unfair insurance claim rejection',
  '[
    {"id":"insurer_name","label":"Insurance Company Name","type":"text","required":true},
    {"id":"policy_number","label":"Policy Number","type":"text","required":true},
    {"id":"claim_number","label":"Claim Number","type":"text","required":true},
    {"id":"rejection_date","label":"Date of Rejection","type":"date","required":true},
    {"id":"rejection_reason","label":"Reason Given for Rejection","type":"textarea","required":true},
    {"id":"incident_date","label":"Date of Incident","type":"date","required":true},
    {"id":"incident_description","label":"Description of Incident","type":"textarea","required":true},
    {"id":"why_unfair","label":"Why is the rejection unfair?","type":"textarea","required":true},
    {"id":"policy_coverage","label":"Relevant Policy Coverage Section","type":"textarea","required":false}
  ]'::jsonb,
  'You are an expert at writing letters to challenge unfair insurance claim rejections. Generate a compelling letter that disputes the rejection, cites relevant policy clauses that support coverage, provides counter-arguments to the insurer''s reasoning, and demands reconsideration with a clear timeline.',
  90
FROM categories c WHERE c.slug = 'insurance'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Delayed Claim Complaint',
  'delayed-claim-complaint',
  'Complain about unreasonable delays in processing your claim',
  '[
    {"id":"insurer_name","label":"Insurance Company Name","type":"text","required":true},
    {"id":"policy_number","label":"Policy Number","type":"text","required":true},
    {"id":"claim_number","label":"Claim Number","type":"text","required":true},
    {"id":"claim_filed_date","label":"Date Claim Was Filed","type":"date","required":true},
    {"id":"days_waiting","label":"How many days have you been waiting?","type":"text","required":true},
    {"id":"contact_attempts","label":"Previous Contact Attempts","type":"textarea","required":true},
    {"id":"impact","label":"How is the delay affecting you?","type":"textarea","required":true},
    {"id":"deadline","label":"Your Deadline for Resolution","type":"date","required":false}
  ]'::jsonb,
  'You are an expert at writing complaint letters about delayed insurance claims. Generate a formal letter expressing serious dissatisfaction with processing delays, referencing regulatory timeframes and insurer obligations, documenting the impact on the claimant, and requesting immediate action with escalation warnings if necessary.',
  88
FROM categories c WHERE c.slug = 'insurance'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Providing Missing Documents',
  'providing-missing-documents',
  'Submit additional documentation requested by your insurer',
  '[
    {"id":"insurer_name","label":"Insurance Company Name","type":"text","required":true},
    {"id":"policy_number","label":"Policy Number","type":"text","required":true},
    {"id":"claim_number","label":"Claim Number","type":"text","required":true},
    {"id":"request_date","label":"Date Documents Were Requested","type":"date","required":true},
    {"id":"documents_requested","label":"Documents Requested","type":"textarea","required":true},
    {"id":"documents_provided","label":"Documents You Are Providing","type":"textarea","required":true},
    {"id":"explanation","label":"Explanation or Additional Context","type":"textarea","required":false}
  ]'::jsonb,
  'You are an expert at writing professional cover letters for insurance document submissions. Generate a clear, organized letter that lists the enclosed documents, references the claim number, confirms compliance with the insurer''s request, and requests prompt processing now that all materials are provided.',
  85
FROM categories c WHERE c.slug = 'insurance'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Incorrect Excess Charged',
  'incorrect-excess-charged',
  'Challenge an incorrect excess/deductible amount charged',
  '[
    {"id":"insurer_name","label":"Insurance Company Name","type":"text","required":true},
    {"id":"policy_number","label":"Policy Number","type":"text","required":true},
    {"id":"claim_number","label":"Claim Number","type":"text","required":true},
    {"id":"excess_charged","label":"Excess Amount Charged","type":"text","required":true},
    {"id":"correct_excess","label":"Correct Excess Amount","type":"text","required":true},
    {"id":"policy_reference","label":"Policy Section Reference","type":"text","required":false},
    {"id":"explanation","label":"Why is the excess incorrect?","type":"textarea","required":true},
    {"id":"refund_request","label":"Refund Amount Requested","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing letters to dispute incorrect insurance excess/deductible charges. Generate a professional letter that identifies the billing error, references the correct policy terms, provides calculation showing the discrepancy, and requests immediate correction and refund of overpaid amounts.',
  86
FROM categories c WHERE c.slug = 'insurance'
ON CONFLICT (slug) DO NOTHING;
