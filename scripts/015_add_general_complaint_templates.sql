-- Templates for General Complaints category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'general-complaints'),
  'Service Complaint Letter',
  'service-complaint',
  'General complaint about poor service from any business',
  '[
    {"id": "customerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "contactDetails", "label": "Your Contact Details", "type": "textarea", "required": true},
    {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
    {"id": "serviceType", "label": "Type of Service", "type": "text", "required": true},
    {"id": "complaintDate", "label": "Date of Service/Incident", "type": "date", "required": true},
    {"id": "accountNumber", "label": "Account/Reference Number", "type": "text", "required": false},
    {"id": "complaintDetails", "label": "Detailed Description of Issue", "type": "textarea", "required": true},
    {"id": "previousContact", "label": "Previous Complaints/Contact", "type": "textarea", "required": false},
    {"id": "desiredResolution", "label": "What Resolution Do You Want?", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing service complaint letters. Generate a professional complaint letter that clearly explains the service failure, the impact it had, and requests specific remedial action. Reference consumer rights and any relevant regulations. Maintain a firm but respectful tone.',
  88
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'service-complaint');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'general-complaints'),
  'Utility Complaint',
  'utility-complaint',
  'Complain about utility providers (gas, electric, water)',
  '[
    {"id": "customerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "accountNumber", "label": "Account Number", "type": "text", "required": true},
    {"id": "address", "label": "Supply Address", "type": "textarea", "required": true},
    {"id": "utilityType", "label": "Utility Type", "type": "select", "options": ["Electricity", "Gas", "Water", "Broadband/Phone", "Multiple"], "required": true},
    {"id": "provider", "label": "Provider Name", "type": "text", "required": true},
    {"id": "issueType", "label": "Issue Type", "type": "select", "options": ["Billing error", "Supply interruption", "Meter reading issue", "Poor service", "Installation problem", "Contract dispute", "Other"], "required": true},
    {"id": "issueDetails", "label": "Detailed Description", "type": "textarea", "required": true},
    {"id": "dateStarted", "label": "When Did Issue Start", "type": "date", "required": true},
    {"id": "financialImpact", "label": "Financial Impact", "type": "textarea", "required": false},
    {"id": "resolution", "label": "Resolution Sought", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing utility complaint letters. Generate a formal complaint letter addressing utility service issues, citing consumer rights and regulatory standards. Reference Ofgem, Ofwat, or Ofcom standards as applicable. Request specific remedial action and compensation where appropriate.',
  82
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'utility-complaint');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'general-complaints'),
  'Poor Workmanship Complaint',
  'poor-workmanship',
  'Complain about substandard work by tradespeople or contractors',
  '[
    {"id": "customerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Property Address", "type": "textarea", "required": true},
    {"id": "contractorName", "label": "Contractor/Company Name", "type": "text", "required": true},
    {"id": "workType", "label": "Type of Work", "type": "text", "required": true},
    {"id": "workDate", "label": "Date Work Completed", "type": "date", "required": true},
    {"id": "agreedCost", "label": "Agreed Cost", "type": "text", "required": true},
    {"id": "amountPaid", "label": "Amount Paid", "type": "text", "required": true},
    {"id": "defects", "label": "Description of Defects/Issues", "type": "textarea", "required": true},
    {"id": "previousContact", "label": "Previous Contact About Issues", "type": "textarea", "required": false},
    {"id": "expertOpinion", "label": "Have You Obtained Expert Opinion?", "type": "textarea", "required": false},
    {"id": "resolution", "label": "Resolution Sought", "type": "select", "options": ["Redo work", "Partial refund", "Full refund", "Pay for remedial work", "Other"], "required": true}
  ]',
  'You are an expert at writing poor workmanship complaint letters. Generate a firm letter detailing the substandard work, referencing consumer rights and reasonable skill and care standards. Request specific remedial action or compensation, and mention consequences if not resolved (e.g., small claims court).',
  80
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'poor-workmanship');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'general-complaints'),
  'Data Protection Request',
  'data-protection-request',
  'Request personal data access under GDPR/Data Protection Act',
  '[
    {"id": "requesterName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "email", "label": "Email Address", "type": "text", "required": false},
    {"id": "organization", "label": "Organization Name", "type": "text", "required": true},
    {"id": "requestType", "label": "Type of Request", "type": "select", "options": ["Subject access request (all data)", "Right to rectification", "Right to erasure", "Right to restrict processing", "Data portability", "Object to processing"], "required": true},
    {"id": "dataDescription", "label": "Specific Data Requested", "type": "textarea", "placeholder": "Describe what data you want or what you want changed/deleted", "required": true},
    {"id": "accountDetails", "label": "Account/Reference Details", "type": "textarea", "required": false},
    {"id": "idProof", "label": "ID Proof Being Provided", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing GDPR and Data Protection Act requests. Generate a formal letter citing the specific rights under GDPR (Article 15, 16, 17, etc. as applicable). Request compliance within the legal timeframe (usually 30 days) and include all necessary details for verification. Reference the right to complain to the ICO if not complied with.',
  77
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'data-protection-request');
