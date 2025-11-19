-- Add Appeal Letter Templates for denied claims, decisions, and administrative actions

INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length) VALUES

-- Insurance Claim Appeal
(
  (SELECT id FROM categories WHERE slug = 'appeals'),
  'Insurance Claim Denial Appeal',
  'insurance-claim-denial-appeal',
  'Appeal denied insurance claims across various policy types',
  ARRAY['Denied auto claims', 'Denied home insurance', 'Policy exclusion disputes', 'Claim undervaluation'],
  'You are an expert at writing insurance claim appeal letters. Generate a compelling appeal that challenges the denial decision with clear reasoning and evidence. Reference specific policy terms, UK insurance regulations (FCA guidelines, Financial Ombudsman Service), and present factual arguments why the claim should be approved. Include documentation references and request detailed review. Maintain professional yet firm tone asserting the policyholder''s rights.',
  '[
    {"id": "policyholderName", "label": "Policyholder Name", "type": "text", "required": true},
    {"id": "policyNumber", "label": "Policy Number", "type": "text", "required": true},
    {"id": "claimNumber", "label": "Claim Reference Number", "type": "text", "required": true},
    {"id": "insuranceCompany", "label": "Insurance Company Name", "type": "text", "required": true},
    {"id": "claimType", "label": "Type of Claim", "type": "select", "options": ["Auto/Motor", "Home/Property", "Travel", "Life", "Critical Illness", "Other"], "required": true},
    {"id": "denialDate", "label": "Date of Denial", "type": "date", "required": true},
    {"id": "denialReason", "label": "Reason Given for Denial", "type": "textarea", "required": true},
    {"id": "claimAmount", "label": "Claim Amount", "type": "text", "required": true},
    {"id": "incidentDate", "label": "Date of Incident", "type": "date", "required": true},
    {"id": "incidentDescription", "label": "Description of Incident", "type": "textarea", "required": true},
    {"id": "whyWrongDenial", "label": "Why the Denial is Wrong", "type": "textarea", "placeholder": "Explain why the denial does not align with your policy terms", "required": true},
    {"id": "policyTerms", "label": "Relevant Policy Terms/Coverage", "type": "textarea", "placeholder": "Quote specific policy sections that support your claim", "required": true},
    {"id": "supportingEvidence", "label": "Supporting Evidence", "type": "textarea", "placeholder": "List documents, photos, reports, witness statements, etc.", "required": true}
  ]',
  '2-3 pages'
),

-- Administrative Decision Appeal
(
  (SELECT id FROM categories WHERE slug = 'appeals'),
  'Administrative Decision Appeal',
  'administrative-decision-appeal',
  'Appeal government or administrative body decisions',
  ARRAY['Benefits decisions', 'Licensing decisions', 'Regulatory decisions', 'Planning decisions'],
  'You are an expert at writing administrative appeal letters for UK government and public body decisions. Generate a formal appeal that challenges the administrative decision with clear legal grounds. Reference relevant legislation, procedural requirements, and administrative law principles. Present factual arguments, cite precedents where applicable, and request reconsideration or tribunal review. The tone should be formal, respectful, and legally grounded, asserting rights under UK administrative law and natural justice principles.',
  '[
    {"id": "appellantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "appellantAddress", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "authorityName", "label": "Authority/Body Name", "type": "text", "placeholder": "e.g., DWP, Local Council, DVLA, etc.", "required": true},
    {"id": "decisionType", "label": "Type of Decision", "type": "select", "options": ["Benefits claim", "Licensing", "Planning permission", "Regulatory action", "Penalty/Fine", "Service denial", "Other"], "required": true},
    {"id": "referenceNumber", "label": "Reference/Case Number", "type": "text", "required": false},
    {"id": "decisionDate", "label": "Date of Decision", "type": "date", "required": true},
    {"id": "decisionSummary", "label": "Summary of Decision", "type": "textarea", "required": true},
    {"id": "appealGrounds", "label": "Grounds for Appeal", "type": "select", "options": ["Decision was wrong in law", "Procedural unfairness", "Insufficient evidence considered", "New evidence available", "Breach of natural justice", "Disproportionate decision", "Other"], "required": true},
    {"id": "detailedReasons", "label": "Detailed Reasons for Appeal", "type": "textarea", "placeholder": "Explain why the decision should be overturned", "required": true},
    {"id": "relevantLaw", "label": "Relevant Legislation/Regulations", "type": "textarea", "placeholder": "Cite specific laws or regulations supporting your appeal", "required": false},
    {"id": "newEvidence", "label": "New Evidence (if applicable)", "type": "textarea", "required": false},
    {"id": "desiredOutcome", "label": "Desired Outcome", "type": "textarea", "placeholder": "What you want the authority to do", "required": true}
  ]',
  '2-3 pages'
),

-- Benefit Denial Appeal
(
  (SELECT id FROM categories WHERE slug = 'appeals'),
  'Benefits Decision Appeal',
  'benefits-decision-appeal',
  'Appeal denied or reduced benefit claims',
  ARRAY['Universal Credit appeals', 'PIP appeals', 'ESA appeals', 'Housing benefit appeals', 'Council tax reduction appeals'],
  'You are an expert at writing UK benefits appeal letters (Universal Credit, PIP, ESA, etc.). Generate a mandatory reconsideration request or tribunal appeal letter that clearly challenges the decision with supporting evidence. Reference DWP guidance, assessment criteria, medical evidence, and relevant case law. Explain how the decision-maker failed to properly apply the law or consider evidence. Request review of specific points of law and fact. Maintain a clear, factual tone while asserting entitlement under social security regulations.',
  '[
    {"id": "claimantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "niNumber", "label": "National Insurance Number", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "benefitType", "label": "Benefit Type", "type": "select", "options": ["Universal Credit", "Personal Independence Payment (PIP)", "Employment and Support Allowance (ESA)", "Housing Benefit", "Council Tax Reduction", "Child Benefit", "Attendance Allowance", "Other"], "required": true},
    {"id": "decisionDate", "label": "Date of Decision Letter", "type": "date", "required": true},
    {"id": "currentAward", "label": "Current Award/Decision", "type": "textarea", "placeholder": "e.g., Denied, reduced points, wrong rate", "required": true},
    {"id": "appealType", "label": "Appeal Type", "type": "select", "options": ["Mandatory Reconsideration", "Tribunal Appeal", "Other"], "required": true},
    {"id": "disagreementPoints", "label": "Points of Disagreement", "type": "textarea", "placeholder": "Specific decisions or assessments you disagree with", "required": true},
    {"id": "whyWrong", "label": "Why the Decision is Wrong", "type": "textarea", "placeholder": "Explain errors in assessment, law, or evidence consideration", "required": true},
    {"id": "medicalEvidence", "label": "Medical Evidence", "type": "textarea", "placeholder": "List medical reports, GP letters, consultant letters", "required": false},
    {"id": "dailyImpact", "label": "Impact on Daily Living", "type": "textarea", "placeholder": "Describe how your condition affects you", "required": false},
    {"id": "supportingEvidence", "label": "Other Supporting Evidence", "type": "textarea", "required": false}
  ]',
  '2-4 pages'
)

ON CONFLICT (slug) DO NOTHING;
