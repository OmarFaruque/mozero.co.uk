-- Templates for DVLA category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'dvla'),
  'Vehicle Tax Refund',
  'vehicle-tax-refund',
  'Request refund of vehicle tax from DVLA',
  '[
    {"id": "ownerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "vehicleReg", "label": "Vehicle Registration", "type": "text", "required": true},
    {"id": "refundReason", "label": "Reason for Refund", "type": "select", "options": ["Vehicle sold", "Vehicle scrapped", "Vehicle exported", "Vehicle stolen", "Off-road (SORN)", "Duplicate payment", "Other"], "required": true},
    {"id": "taxEndDate", "label": "When Tax Should End", "type": "date", "required": true},
    {"id": "fullMonthsRemaining", "label": "Full Months Remaining", "type": "text", "required": true},
    {"id": "additionalInfo", "label": "Additional Information", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing DVLA refund request letters. Generate a formal request for vehicle tax refund citing the appropriate circumstances. Reference DVLA refund policies and include all necessary vehicle details. Request prompt processing of the refund.',
  75
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'vehicle-tax-refund');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'dvla'),
  'V5C Logbook Dispute',
  'v5c-logbook-dispute',
  'Dispute vehicle registration or ownership issues',
  '[
    {"id": "ownerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "vehicleReg", "label": "Vehicle Registration", "type": "text", "required": true},
    {"id": "disputeType", "label": "Type of Dispute", "type": "select", "options": ["Incorrect keeper details", "Vehicle details wrong", "Lost V5C", "Duplicate registration", "Previous owner issue", "Other"], "required": true},
    {"id": "issueDescription", "label": "Description of Issue", "type": "textarea", "required": true},
    {"id": "purchaseDate", "label": "When Did You Acquire Vehicle", "type": "date", "required": false},
    {"id": "supportingDocs", "label": "Supporting Documents Available", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing DVLA dispute letters regarding vehicle registration. Generate a formal letter explaining the registration issue and requesting correction. Include all relevant vehicle and ownership details, reference DVLA procedures, and request prompt resolution.',
  70
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'v5c-logbook-dispute');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'dvla'),
  'Medical Driving Licence Appeal',
  'medical-licence-appeal',
  'Appeal DVLA medical driving licence decision',
  '[
    {"id": "driverName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "address", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "licenseNumber", "label": "Driving Licence Number", "type": "text", "required": true},
    {"id": "decisionType", "label": "DVLA Decision", "type": "select", "options": ["Licence revoked", "Licence refused", "Restricted licence", "Medical review decision"], "required": true},
    {"id": "medicalCondition", "label": "Medical Condition", "type": "text", "required": true},
    {"id": "decisionDate", "label": "Date of Decision", "type": "date", "required": true},
    {"id": "appealGrounds", "label": "Grounds for Appeal", "type": "textarea", "placeholder": "Why the decision should be reconsidered", "required": true},
    {"id": "medicalEvidence", "label": "Updated Medical Evidence", "type": "textarea", "required": true},
    {"id": "specialistSupport", "label": "Specialist/GP Support", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing DVLA medical licence appeals. Generate a persuasive appeal letter challenging a medical driving decision. Present updated medical evidence, specialist opinions, and demonstrate fitness to drive. Reference the specific medical standards and request reconsideration based on current health status.',
  72
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'medical-licence-appeal');
