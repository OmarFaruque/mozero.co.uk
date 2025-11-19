-- Additional Dispute Letters Templates

-- Incorrect Charges Dispute
INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'disputes'),
  'Incorrect Charges Dispute',
  'incorrect-charges-dispute',
  'Challenge incorrect or unauthorized charges on your account',
  ARRAY['Overcharges', 'Wrong pricing applied', 'Duplicate charges', 'Unauthorized fees'],
  'You are a professional letter writer helping a customer dispute incorrect charges. Write a formal letter clearly identifying each incorrect charge with dates and amounts, explaining what the correct charge should be, referencing any agreements or advertised prices, and requesting immediate correction and refund. Reference Consumer Rights Act 2015 and request written confirmation of corrections.',
  '[
    {"id": "yourName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "accountNumber", "label": "Account/Customer Number", "type": "text", "required": true},
    {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
    {"id": "companyAddress", "label": "Company Address", "type": "textarea", "required": true},
    {"id": "incorrectCharges", "label": "Incorrect Charges Details", "type": "textarea", "placeholder": "List each incorrect charge with date, amount charged, and correct amount", "required": true},
    {"id": "totalOvercharged", "label": "Total Amount Overcharged", "type": "text", "required": true},
    {"id": "evidenceOfCorrectPrice", "label": "Evidence of Correct Price", "type": "textarea", "placeholder": "e.g., Contract terms, advertised price, previous statements", "required": true},
    {"id": "contactAttempts", "label": "Previous Contact Attempts", "type": "textarea", "required": false},
    {"id": "desiredResolution", "label": "Desired Resolution", "type": "select", "options": ["Full refund", "Credit to account", "Corrected billing going forward", "All of the above"], "required": true}
  ]',
  '1-2 pages',
  false
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'incorrect-charges-dispute');

-- Billing Errors Dispute  
INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured)
SELECT
  (SELECT id FROM categories WHERE slug = 'disputes'),
  'Billing Errors Dispute',
  'billing-errors-dispute',
  'Dispute billing mistakes and accounting errors',
  ARRAY['Payment not credited', 'Late fees incorrectly applied', 'Service period errors', 'Calculation mistakes'],
  'You are a professional letter writer helping a customer dispute billing errors. Write a formal letter identifying the specific billing error, providing correct calculations or payment evidence, referencing billing statements with dates, and requesting correction of records and refund if applicable. Cite Fair Trading regulations and request written confirmation with corrected statement.',
  '[
    {"id": "yourName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "accountNumber", "label": "Account Number", "type": "text", "required": true},
    {"id": "serviceProvider", "label": "Service Provider Name", "type": "text", "required": true},
    {"id": "providerAddress", "label": "Provider Address", "type": "textarea", "required": true},
    {"id": "errorType", "label": "Type of Billing Error", "type": "select", "options": ["Payment not credited", "Duplicate billing", "Wrong billing period", "Incorrect calculation", "Unauthorized late fee", "Wrong rate applied", "Service not used", "Other"], "required": true},
    {"id": "errorDescription", "label": "Detailed Description of Error", "type": "textarea", "required": true},
    {"id": "statementDate", "label": "Date of Incorrect Statement", "type": "date", "required": true},
    {"id": "correctAmount", "label": "What the Correct Amount Should Be", "type": "text", "required": true},
    {"id": "paymentProof", "label": "Payment Proof (if applicable)", "type": "textarea", "placeholder": "e.g., Bank statement, receipt, confirmation number", "required": false},
    {"id": "impactDescription", "label": "Impact of the Error", "type": "textarea", "placeholder": "e.g., Affected credit score, caused overdraft fees", "required": false}
  ]',
  '1-2 pages',
  false
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'billing-errors-dispute');

-- Service Disputes
INSERT INTO templates (category_id, name, slug, description, use_cases, system_prompt, questions, estimated_length, is_featured)
SELECT
  (SELECT id FROM categories WHERE slug = 'disputes'),
  'Service Disputes',
  'service-disputes',
  'Dispute poor service, undelivered services, or contract breaches',
  ARRAY['Service not provided', 'Poor quality service', 'Incomplete work', 'Breach of contract', 'Service delays'],
  'You are a professional letter writer helping a customer dispute service issues. Write a formal letter outlining what service was contracted, what was actually delivered (or not delivered), how this breaches the agreement, and what resolution is sought. Reference the contract terms, Consumer Rights Act 2015 (services must be performed with reasonable care and skill), document all service failures with dates, and request appropriate remedy (completion, refund, compensation). Maintain a firm but professional tone.',
  '[
    {"id": "yourName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "yourAddress", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "serviceProvider", "label": "Service Provider Name", "type": "text", "required": true},
    {"id": "providerAddress", "label": "Provider Address", "type": "textarea", "required": true},
    {"id": "contractDate", "label": "Contract/Agreement Date", "type": "date", "required": true},
    {"id": "serviceDescription", "label": "Service Contracted", "type": "textarea", "required": true},
    {"id": "amountPaid", "label": "Amount Paid", "type": "text", "required": true},
    {"id": "issueType", "label": "Type of Service Issue", "type": "select", "options": ["Service not provided", "Service incomplete", "Poor quality work", "Delays beyond agreed timeframe", "Does not meet specifications", "Breach of contract terms", "Other"], "required": true},
    {"id": "issueDetails", "label": "Detailed Description of Service Issues", "type": "textarea", "required": true},
    {"id": "expectedService", "label": "What Was Promised/Expected", "type": "textarea", "required": true},
    {"id": "communicationHistory", "label": "Previous Communication with Provider", "type": "textarea", "placeholder": "Dates and details of attempts to resolve", "required": false},
    {"id": "desiredResolution", "label": "Desired Resolution", "type": "select", "options": ["Complete the service properly", "Full refund", "Partial refund", "Redo the work", "Compensation for damages", "Other"], "required": true},
    {"id": "deadline", "label": "Reasonable Deadline for Response", "type": "text", "placeholder": "e.g., 14 days", "required": true}
  ]',
  '2 pages',
  false
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'service-disputes');
