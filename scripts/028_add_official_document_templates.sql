-- Add Official Documents templates for records, certifications, and correspondence

INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured) VALUES

-- Subject Access Request (GDPR)
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Subject Access Request (SAR)',
  'subject-access-request',
  'Request personal data held by organizations under GDPR',
  ARRAY['Personal data request', 'GDPR data request', 'Medical records', 'Employment records'],
  'You are an expert at writing Subject Access Requests under UK GDPR and Data Protection Act 2018. Generate a formal SAR letter that clearly requests all personal data held by the organization. Include the legal right to access under Article 15 GDPR, specify the one-month response deadline, and request data in electronic format. The tone should be professional and cite relevant legislation.',
  '[
    {"id": "requesterName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "dateOfBirth", "label": "Your Date of Birth", "type": "date", "required": true},
    {"id": "organizationName", "label": "Organization Name", "type": "text", "required": true},
    {"id": "organizationAddress", "label": "Organization Address", "type": "textarea", "required": true},
    {"id": "customerReference", "label": "Customer/Account Reference Number", "type": "text", "required": false},
    {"id": "specificData", "label": "Specific Data Requested (if any)", "type": "textarea", "placeholder": "Leave blank to request all personal data", "required": false},
    {"id": "timeframe", "label": "Time Period", "type": "text", "placeholder": "e.g., January 2020 to present", "required": false},
    {"id": "preferredFormat", "label": "Preferred Format", "type": "select", "options": ["Electronic (email/USB)", "Paper copies", "No preference"], "required": true}
  ]',
  '1-2 pages',
  true
),

-- Certificate of Employment
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Employment Certificate Request',
  'employment-certificate-request',
  'Request employment certificates and reference letters',
  ARRAY['Employment verification', 'Job applications', 'Visa applications', 'Mortgage applications'],
  'You are an expert at writing formal requests for employment certificates. Generate a professional letter requesting an employment certificate or verification letter. Include the specific information needed (dates of employment, position, salary if required). Reference the purpose of the request and any deadline. The tone should be courteous and professional.',
  '[
    {"id": "employeeName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "employeeId", "label": "Employee ID", "type": "text", "required": false},
    {"id": "department", "label": "Department", "type": "text", "required": false},
    {"id": "hrContactName", "label": "HR Contact Name", "type": "text", "required": false},
    {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
    {"id": "employmentDates", "label": "Dates of Employment", "type": "text", "placeholder": "e.g., January 2020 - Present", "required": true},
    {"id": "jobTitle", "label": "Job Title/Position", "type": "text", "required": true},
    {"id": "certificatePurpose", "label": "Purpose of Certificate", "type": "select", "options": ["Visa application", "Job application", "Mortgage application", "Rental application", "Other"], "required": true},
    {"id": "includeSalary", "label": "Include Salary Information?", "type": "select", "options": ["Yes", "No"], "required": true},
    {"id": "deadline", "label": "Required By Date", "type": "date", "required": false}
  ]',
  '1 page',
  false
),

-- Medical Records Request
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Medical Records Request',
  'medical-records-request',
  'Request medical records from healthcare providers',
  ARRAY['Full medical records', 'Specialist referrals', 'Second opinions', 'Legal proceedings'],
  'You are an expert at writing medical records request letters under UK Data Protection Act 2018 and Access to Health Records Act 1990. Generate a formal letter requesting medical records from a healthcare provider. Include the legal right to access under GDPR Article 15, specify the one-month deadline, and request records in a usable format. The tone should be professional and cite relevant healthcare legislation.',
  '[
    {"id": "patientName", "label": "Patient Full Name", "type": "text", "required": true},
    {"id": "patientAddress", "label": "Patient Address", "type": "textarea", "required": true},
    {"id": "dateOfBirth", "label": "Date of Birth", "type": "date", "required": true},
    {"id": "nhsNumber", "label": "NHS Number", "type": "text", "required": false},
    {"id": "gpPracticeName", "label": "GP Practice/Hospital Name", "type": "text", "required": true},
    {"id": "gpPracticeAddress", "label": "GP Practice/Hospital Address", "type": "textarea", "required": true},
    {"id": "recordsTimeframe", "label": "Time Period of Records", "type": "text", "placeholder": "e.g., January 2020 - December 2023", "required": false},
    {"id": "specificRecords", "label": "Specific Records Requested", "type": "textarea", "placeholder": "Leave blank for complete records", "required": false},
    {"id": "requestPurpose", "label": "Purpose of Request", "type": "select", "options": ["Personal use", "Second opinion", "Legal proceedings", "Insurance claim", "Other"], "required": true},
    {"id": "preferredFormat", "label": "Preferred Format", "type": "select", "options": ["Electronic copies", "Paper copies", "No preference"], "required": true}
  ]',
  '1-2 pages',
  false
),

-- Proof of Address Letter
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Proof of Address Request',
  'proof-of-address-request',
  'Request official proof of address or residency letter',
  ARRAY['Bank account opening', 'Visa applications', 'License applications', 'Utility connections'],
  'You are an expert at writing requests for proof of address letters. Generate a professional letter requesting official confirmation of address from a landlord, local council, or organization. Explain the purpose clearly and specify the format required. The tone should be polite and professional.',
  '[
    {"id": "requesterName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "currentAddress", "label": "Your Current Address", "type": "textarea", "required": true},
    {"id": "moveInDate", "label": "Date Moved to Address", "type": "date", "required": false},
    {"id": "recipientName", "label": "Recipient Name (Landlord/Council)", "type": "text", "required": true},
    {"id": "recipientOrg", "label": "Recipient Organization", "type": "text", "required": false},
    {"id": "letterPurpose", "label": "Purpose of Letter", "type": "select", "options": ["Bank account", "Visa application", "License application", "Utility connection", "Government benefits", "Other"], "required": true},
    {"id": "specificRequirements", "label": "Specific Requirements", "type": "textarea", "placeholder": "Any specific wording or information required", "required": false},
    {"id": "deadline", "label": "Required By Date", "type": "date", "required": false}
  ]',
  '1 page',
  false
),

-- Cover Letter (General Official)
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Official Cover Letter',
  'official-cover-letter',
  'Professional cover letter for document submissions',
  ARRAY['Application submissions', 'Document packages', 'Formal correspondence', 'Official requests'],
  'You are an expert at writing professional cover letters for official document submissions. Generate a formal cover letter that introduces the accompanying documents, provides necessary context, and lists all enclosed materials. The tone should be professional, clear, and courteous.',
  '[
    {"id": "senderName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "senderAddress", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "senderContact", "label": "Your Contact Information", "type": "text", "placeholder": "Email and phone", "required": true},
    {"id": "recipientName", "label": "Recipient Name", "type": "text", "required": true},
    {"id": "recipientTitle", "label": "Recipient Title/Position", "type": "text", "required": false},
    {"id": "organizationName", "label": "Organization Name", "type": "text", "required": true},
    {"id": "organizationAddress", "label": "Organization Address", "type": "textarea", "required": true},
    {"id": "submissionPurpose", "label": "Purpose of Submission", "type": "textarea", "required": true},
    {"id": "enclosedDocuments", "label": "List of Enclosed Documents", "type": "textarea", "placeholder": "List each document being submitted", "required": true},
    {"id": "referenceNumber", "label": "Reference/Application Number", "type": "text", "required": false},
    {"id": "additionalInfo", "label": "Additional Information", "type": "textarea", "required": false}
  ]',
  '1 page',
  true
),

-- MOT Reminder/Request
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'MOT Test Documentation Letter',
  'mot-documentation-letter',
  'Request MOT certificates or dispute MOT failures',
  ARRAY['MOT certificate request', 'MOT failure dispute', 'Vehicle history', 'DVLA correspondence'],
  'You are an expert at writing formal letters regarding MOT testing and certification. Generate a professional letter that addresses MOT-related documentation needs, whether requesting certificates, disputing failures, or seeking clarification. Reference DVSA regulations and vehicle testing standards. The tone should be professional and fact-based.',
  '[
    {"id": "ownerName", "label": "Vehicle Owner Full Name", "type": "text", "required": true},
    {"id": "ownerAddress", "label": "Owner Address", "type": "textarea", "required": true},
    {"id": "vehicleReg", "label": "Vehicle Registration Number", "type": "text", "required": true},
    {"id": "vehicleMake", "label": "Vehicle Make and Model", "type": "text", "required": true},
    {"id": "letterPurpose", "label": "Purpose of Letter", "type": "select", "options": ["Request MOT certificate copy", "Dispute MOT failure", "Query test results", "Request test history", "Other"], "required": true},
    {"id": "testCentreName", "label": "MOT Test Centre Name", "type": "text", "required": true},
    {"id": "testDate", "label": "Date of MOT Test", "type": "date", "required": true},
    {"id": "testResult", "label": "Test Result", "type": "select", "options": ["Pass", "Fail", "Unknown"], "required": false},
    {"id": "issueDescription", "label": "Issue Description", "type": "textarea", "placeholder": "Explain what you need or what you are disputing", "required": true},
    {"id": "desiredOutcome", "label": "Desired Outcome", "type": "textarea", "required": true}
  ]',
  '1-2 pages',
  false
),

-- Character Reference Letter Request
(
  (SELECT id FROM categories WHERE slug = 'official'),
  'Character Reference Request',
  'character-reference-request',
  'Request character reference letters for official purposes',
  ARRAY['Court proceedings', 'Job applications', 'Visa applications', 'Rental applications'],
  'You are an expert at writing requests for character reference letters. Generate a professional letter asking someone to provide a character reference. Explain the purpose clearly, provide guidance on what should be included, and specify any deadline or format requirements. The tone should be polite, appreciative, and clear.',
  '[
    {"id": "requesterName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "refereeeName", "label": "Person Being Asked (Referee)", "type": "text", "required": true},
    {"id": "relationship", "label": "Your Relationship", "type": "text", "placeholder": "e.g., Former employer, teacher, colleague", "required": true},
    {"id": "referencePurpose", "label": "Purpose of Reference", "type": "select", "options": ["Job application", "Court proceedings", "Visa application", "Rental application", "University application", "Other"], "required": true},
    {"id": "specificDetails", "label": "Specific Points to Include", "type": "textarea", "placeholder": "What qualities or experiences should be highlighted", "required": false},
    {"id": "recipientInfo", "label": "Who Will Receive the Reference", "type": "text", "required": true},
    {"id": "deadline", "label": "Required By Date", "type": "date", "required": true},
    {"id": "formatRequirements", "label": "Format Requirements", "type": "select", "options": ["Formal letter on letterhead", "Email", "Online form", "No specific format"], "required": false}
  ]',
  '1 page',
  false
)

ON CONFLICT (slug) DO NOTHING;
