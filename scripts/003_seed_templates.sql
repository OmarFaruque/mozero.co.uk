-- Insert sample templates for each category
INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured) VALUES
  -- Dispute Letters
  (
    (SELECT id FROM categories WHERE slug = 'disputes'),
    'Credit Card Dispute Letter',
    'credit-card-dispute',
    'Dispute unauthorized or incorrect credit card charges',
    ARRAY['Fraudulent charges', 'Billing errors', 'Service not received', 'Defective products'],
    'You are an expert at writing formal dispute letters. Generate a professional, legally sound credit card dispute letter based on the user''s information. Include all necessary details, maintain a firm but respectful tone, and cite relevant consumer protection laws when appropriate. The letter should request investigation and resolution.',
    '[
      {"id": "cardholderName", "label": "Your Full Name", "type": "text", "required": true},
      {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
      {"id": "accountNumber", "label": "Credit Card Last 4 Digits", "type": "text", "required": true},
      {"id": "disputeAmount", "label": "Disputed Amount", "type": "text", "required": true},
      {"id": "transactionDate", "label": "Transaction Date", "type": "date", "required": true},
      {"id": "merchantName", "label": "Merchant Name", "type": "text", "required": true},
      {"id": "disputeReason", "label": "Reason for Dispute", "type": "select", "options": ["Unauthorized charge", "Billing error", "Service not received", "Defective product", "Canceled subscription", "Other"], "required": true},
      {"id": "detailedExplanation", "label": "Detailed Explanation", "type": "textarea", "placeholder": "Explain what happened and why you are disputing this charge", "required": true},
      {"id": "supportingDocs", "label": "Supporting Documents", "type": "textarea", "placeholder": "List any documents you are attaching (receipts, emails, etc.)", "required": false}
    ]',
    '1-2 pages',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'disputes'),
    'Debt Validation Letter',
    'debt-validation',
    'Request validation of debt from collection agencies',
    ARRAY['Collection agency notices', 'Debt verification', 'Credit report disputes'],
    'You are an expert at writing debt validation letters under the Fair Debt Collection Practices Act (FDCPA). Generate a formal letter requesting debt validation. The letter should request proof of debt ownership, original creditor information, and all relevant documentation. Cite FDCPA rights and request cease of collection activities until validation is provided.',
    '[
      {"id": "yourName", "label": "Your Full Name", "type": "text", "required": true},
      {"id": "yourAddress", "label": "Your Address", "type": "textarea", "required": true},
      {"id": "collectorName", "label": "Collection Agency Name", "type": "text", "required": true},
      {"id": "collectorAddress", "label": "Collection Agency Address", "type": "textarea", "required": true},
      {"id": "accountReference", "label": "Account/Reference Number", "type": "text", "required": false},
      {"id": "noticeDate", "label": "Date of Collection Notice", "type": "date", "required": true},
      {"id": "claimedAmount", "label": "Amount Claimed", "type": "text", "required": true}
    ]',
    '1 page',
    true
  ),

  -- Insurance
  (
    (SELECT id FROM categories WHERE slug = 'insurance'),
    'Health Insurance Appeal Letter',
    'health-insurance-appeal',
    'Appeal denied health insurance claims',
    ARRAY['Denied medical procedures', 'Out-of-network denials', 'Pre-authorization denials'],
    'You are an expert at writing health insurance appeal letters. Generate a compelling appeal letter that clearly explains why the denial should be overturned. Include medical necessity justification, policy coverage references, and physician support. Maintain a professional tone while being assertive about the patient''s rights and needs.',
    '[
      {"id": "patientName", "label": "Patient Full Name", "type": "text", "required": true},
      {"id": "policyNumber", "label": "Insurance Policy Number", "type": "text", "required": true},
      {"id": "claimNumber", "label": "Claim Number", "type": "text", "required": true},
      {"id": "denialDate", "label": "Date of Denial", "type": "date", "required": true},
      {"id": "treatmentDescription", "label": "Treatment/Procedure Denied", "type": "textarea", "required": true},
      {"id": "denialReason", "label": "Reason Given for Denial", "type": "textarea", "required": true},
      {"id": "medicalNecessity", "label": "Why This Treatment is Medically Necessary", "type": "textarea", "required": true},
      {"id": "physicianName", "label": "Prescribing Physician Name", "type": "text", "required": true},
      {"id": "additionalInfo", "label": "Additional Supporting Information", "type": "textarea", "required": false}
    ]',
    '2-3 pages',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'insurance'),
    'Property Damage Claim Letter',
    'property-damage-claim',
    'File claims for property damage with insurance companies',
    ARRAY['Home damage', 'Rental property damage', 'Natural disaster claims', 'Water damage'],
    'You are an expert at writing property damage insurance claim letters. Generate a detailed claim letter that documents the damage, provides timeline of events, and clearly states the claim amount. Include inventory of damaged items if applicable and reference policy coverage. The tone should be factual and professional.',
    '[
      {"id": "policyholderName", "label": "Policyholder Name", "type": "text", "required": true},
      {"id": "policyNumber", "label": "Policy Number", "type": "text", "required": true},
      {"id": "propertyAddress", "label": "Property Address", "type": "textarea", "required": true},
      {"id": "incidentDate", "label": "Date of Incident", "type": "date", "required": true},
      {"id": "damageType", "label": "Type of Damage", "type": "select", "options": ["Fire", "Water", "Wind/Storm", "Theft", "Vandalism", "Other"], "required": true},
      {"id": "damageDescription", "label": "Detailed Description of Damage", "type": "textarea", "required": true},
      {"id": "estimatedValue", "label": "Estimated Damage Value", "type": "text", "required": true},
      {"id": "emergencyMeasures", "label": "Emergency Measures Taken", "type": "textarea", "required": false}
    ]',
    '2 pages',
    false
  ),

  -- Complaint Letters
  (
    (SELECT id FROM categories WHERE slug = 'complaints'),
    'Consumer Complaint Letter',
    'consumer-complaint',
    'Formal complaint about defective products or poor service',
    ARRAY['Defective products', 'Poor customer service', 'Warranty issues', 'Refund requests'],
    'You are an expert at writing effective consumer complaint letters. Generate a professional complaint letter that clearly states the problem, desired resolution, and relevant details. Reference purchase information, previous communication attempts, and consumer rights when applicable. The tone should be firm but professional, expressing dissatisfaction while requesting specific action.',
    '[
      {"id": "yourName", "label": "Your Full Name", "type": "text", "required": true},
      {"id": "contactInfo", "label": "Your Contact Information", "type": "textarea", "required": true},
      {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
      {"id": "productService", "label": "Product or Service", "type": "text", "required": true},
      {"id": "purchaseDate", "label": "Purchase Date", "type": "date", "required": true},
      {"id": "orderNumber", "label": "Order/Invoice Number", "type": "text", "required": false},
      {"id": "problemDescription", "label": "Description of Problem", "type": "textarea", "required": true},
      {"id": "previousContact", "label": "Previous Contact Attempts", "type": "textarea", "required": false},
      {"id": "desiredResolution", "label": "Desired Resolution", "type": "select", "options": ["Full refund", "Replacement", "Repair", "Partial refund", "Store credit", "Other"], "required": true},
      {"id": "additionalDetails", "label": "Additional Details", "type": "textarea", "required": false}
    ]',
    '1-2 pages',
    true
  ),

  -- Appeals
  (
    (SELECT id FROM categories WHERE slug = 'appeals'),
    'Academic Appeal Letter',
    'academic-appeal',
    'Appeal academic decisions, suspensions, or grade disputes',
    ARRAY['Grade appeals', 'Suspension appeals', 'Admission appeals', 'Financial aid appeals'],
    'You are an expert at writing academic appeal letters. Generate a respectful and persuasive appeal letter that presents the student''s case clearly. Include relevant circumstances, evidence, and a compelling argument for reconsideration. The tone should be respectful, mature, and focused on taking responsibility while explaining mitigating factors.',
    '[
      {"id": "studentName", "label": "Student Full Name", "type": "text", "required": true},
      {"id": "studentId", "label": "Student ID", "type": "text", "required": true},
      {"id": "institution", "label": "Institution Name", "type": "text", "required": true},
      {"id": "appealType", "label": "Type of Appeal", "type": "select", "options": ["Grade appeal", "Suspension/dismissal appeal", "Admission appeal", "Financial aid appeal", "Other"], "required": true},
      {"id": "decisionDate", "label": "Date of Decision", "type": "date", "required": true},
      {"id": "circumstances", "label": "Circumstances Leading to Decision", "type": "textarea", "required": true},
      {"id": "mitigatingFactors", "label": "Mitigating Factors/Extenuating Circumstances", "type": "textarea", "required": true},
      {"id": "correctionPlan", "label": "Plan for Improvement/Correction", "type": "textarea", "required": true},
      {"id": "supportingEvidence", "label": "Supporting Evidence Available", "type": "textarea", "required": false}
    ]',
    '2 pages',
    false
  ),

  -- Official Documents
  (
    (SELECT id FROM categories WHERE slug = 'official'),
    'FOIA Request Letter',
    'foia-request',
    'Request government records under Freedom of Information Act',
    ARRAY['Government records', 'Public documents', 'Agency correspondence', 'Investigation records'],
    'You are an expert at writing Freedom of Information Act (FOIA) request letters. Generate a formal FOIA request that clearly identifies the requested records, cites the FOIA statute, and includes all necessary legal language. The letter should be precise about what records are sought while being broad enough to capture relevant documents.',
    '[
      {"id": "requesterName", "label": "Your Full Name", "type": "text", "required": true},
      {"id": "requesterAddress", "label": "Your Address", "type": "textarea", "required": true},
      {"id": "agencyName", "label": "Government Agency Name", "type": "text", "required": true},
      {"id": "recordsDescription", "label": "Description of Records Requested", "type": "textarea", "placeholder": "Be as specific as possible about the records you seek", "required": true},
      {"id": "timeframe", "label": "Timeframe of Records", "type": "text", "placeholder": "e.g., January 2020 - December 2023", "required": false},
      {"id": "feeWaiver", "label": "Request Fee Waiver?", "type": "select", "options": ["Yes", "No"], "required": true},
      {"id": "feeWaiverReason", "label": "Fee Waiver Justification", "type": "textarea", "required": false},
      {"id": "expeditedProcessing", "label": "Request Expedited Processing?", "type": "select", "options": ["Yes", "No"], "required": true}
    ]',
    '1-2 pages',
    false
  )
ON CONFLICT (slug) DO NOTHING;
