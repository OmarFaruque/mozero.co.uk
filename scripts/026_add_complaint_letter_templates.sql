-- Additional templates for Complaint Letters category

INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured)
VALUES
-- Product Complaint Letter
(
  (SELECT id FROM categories WHERE slug = 'complaints'),
  'Product Complaint Letter',
  'product-complaint',
  'Formal complaint about defective or faulty products',
  ARRAY['Defective products', 'Faulty goods', 'Product safety issues', 'Manufacturing defects'],
  'You are an expert at writing product complaint letters under UK Consumer Rights Act 2015. Generate a professional letter detailing product defects or faults, referencing consumer rights to refund, repair, or replacement. Include purchase details, proof of purchase reference, clear description of the fault, and requested remedy with reasonable deadline (typically 14-30 days). Reference relevant sections of Consumer Rights Act and threaten escalation to Trading Standards or small claims court if necessary.',
  '[
    {"id": "recipientName", "label": "Recipient Name/Department", "type": "text", "required": true},
    {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
    {"id": "companyAddress", "label": "Company Address", "type": "textarea", "required": false},
    {"id": "productName", "label": "Product Name/Description", "type": "text", "required": true},
    {"id": "purchaseDate", "label": "Purchase Date", "type": "date", "required": true},
    {"id": "purchasePrice", "label": "Purchase Price (£)", "type": "text", "required": true},
    {"id": "orderNumber", "label": "Order/Receipt Number", "type": "text", "required": false},
    {"id": "faultDescription", "label": "Detailed Description of Fault/Defect", "type": "textarea", "required": true},
    {"id": "whenDiscovered", "label": "When Was the Fault Discovered?", "type": "date", "required": true},
    {"id": "attemptedResolution", "label": "Have You Already Contacted Them?", "type": "textarea", "required": false},
    {"id": "desiredOutcome", "label": "Desired Resolution", "type": "select", "options": ["Full refund", "Replacement product", "Repair", "Partial refund", "Other"], "required": true},
    {"id": "additionalInfo", "label": "Additional Information", "type": "textarea", "required": false}
  ]',
  '1-2 pages',
  true
),

-- Service Complaint Letter
(
  (SELECT id FROM categories WHERE slug = 'complaints'),
  'Service Complaint Letter',
  'service-complaint',
  'Formal complaint about poor or inadequate services',
  ARRAY['Poor customer service', 'Incomplete service', 'Unprofessional conduct', 'Service failure'],
  'You are an expert at writing service complaint letters. Generate a firm but professional letter describing the service failure or poor service received. Reference the Consumer Rights Act 2015 requirement for services to be provided with reasonable care and skill. Detail what service was promised, what was actually delivered, the impact on the customer, and the desired remedy. Set a reasonable deadline (14-30 days) and mention escalation to ombudsman, Trading Standards, or online reviews if not resolved.',
  '[
    {"id": "recipientName", "label": "Recipient Name/Department", "type": "text", "required": true},
    {"id": "companyName", "label": "Company/Business Name", "type": "text", "required": true},
    {"id": "companyAddress", "label": "Company Address", "type": "textarea", "required": false},
    {"id": "serviceType", "label": "Type of Service", "type": "text", "required": true},
    {"id": "serviceDate", "label": "Date Service Was Provided", "type": "date", "required": true},
    {"id": "agreementDate", "label": "Date Service Was Agreed/Booked", "type": "date", "required": false},
    {"id": "amountPaid", "label": "Amount Paid (£)", "type": "text", "required": true},
    {"id": "referenceNumber", "label": "Invoice/Reference Number", "type": "text", "required": false},
    {"id": "serviceIssue", "label": "Detailed Description of Service Failure", "type": "textarea", "required": true},
    {"id": "expectedService", "label": "What Service Was Promised/Expected?", "type": "textarea", "required": true},
    {"id": "actualService", "label": "What Service Was Actually Provided?", "type": "textarea", "required": true},
    {"id": "impactOnYou", "label": "Impact/Consequences on You", "type": "textarea", "required": false},
    {"id": "previousContact", "label": "Previous Complaints/Contact", "type": "textarea", "required": false},
    {"id": "desiredResolution", "label": "Desired Resolution", "type": "select", "options": ["Full refund", "Partial refund", "Service completed properly", "Re-do the work", "Compensation", "Other"], "required": true},
    {"id": "additionalDetails", "label": "Additional Information", "type": "textarea", "required": false}
  ]',
  '1-2 pages',
  true
),

-- Business Complaint Letter
(
  (SELECT id FROM categories WHERE slug = 'complaints'),
  'Business Complaint Letter',
  'business-complaint',
  'General formal complaint about business conduct or practices',
  ARRAY['Misleading advertising', 'Breach of contract', 'Unprofessional behavior', 'Business malpractice'],
  'You are an expert at writing formal business complaint letters. Generate a professional and assertive letter addressing poor business conduct, unfair practices, or contract breaches. Reference relevant consumer protection legislation (Consumer Rights Act 2015, Consumer Protection from Unfair Trading Regulations 2008, etc.). Clearly state the facts, explain the impact, cite the business obligations that were not met, request specific action with deadline, and warn of escalation to relevant authorities (Trading Standards, Ombudsman, Advertising Standards Authority, etc.) if not resolved.',
  '[
    {"id": "recipientName", "label": "Recipient Name/Department", "type": "text", "required": true},
    {"id": "businessName", "label": "Business Name", "type": "text", "required": true},
    {"id": "businessAddress", "label": "Business Address", "type": "textarea", "required": false},
    {"id": "accountNumber", "label": "Account/Customer Number", "type": "text", "required": false},
    {"id": "complaintType", "label": "Type of Complaint", "type": "select", "options": ["Misleading advertising", "Breach of contract", "Unfair terms", "Poor business practices", "Data protection breach", "Discrimination", "Other"], "required": true},
    {"id": "incidentDate", "label": "Date of Incident/Issue", "type": "date", "required": true},
    {"id": "detailedComplaint", "label": "Detailed Description of the Issue", "type": "textarea", "required": true},
    {"id": "businessObligation", "label": "What Should the Business Have Done?", "type": "textarea", "required": true},
    {"id": "impactConsequences", "label": "Impact/Consequences on You", "type": "textarea", "required": true},
    {"id": "evidenceAvailable", "label": "Evidence You Have", "type": "textarea", "placeholder": "e.g., emails, contracts, receipts, photos", "required": false},
    {"id": "previousAttempts", "label": "Previous Resolution Attempts", "type": "textarea", "required": false},
    {"id": "desiredOutcome", "label": "Desired Outcome", "type": "textarea", "required": true},
    {"id": "relevantAuthority", "label": "Relevant Authority for Escalation", "type": "select", "options": ["Trading Standards", "Financial Ombudsman", "Property Ombudsman", "Advertising Standards Authority", "Information Commissioner (ICO)", "Citizens Advice", "Other"], "required": false}
  ]',
  '2 pages',
  true
)
ON CONFLICT (slug) DO NOTHING;
