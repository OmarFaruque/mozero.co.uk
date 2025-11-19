-- Templates for Traffic & Speeding category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'traffic'),
  'Speeding Ticket Appeal',
  'speeding-ticket-appeal',
  'Appeal unfair speeding penalty or camera error',
  '[
    {"id": "driverName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "driverAddress", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "driverLicense", "label": "Driver License Number", "type": "text", "required": true},
    {"id": "noticeNumber", "label": "Notice/Ticket Number", "type": "text", "required": true},
    {"id": "offenceDate", "label": "Date of Alleged Offence", "type": "date", "required": true},
    {"id": "location", "label": "Location", "type": "text", "required": true},
    {"id": "allegedSpeed", "label": "Alleged Speed", "type": "text", "required": true},
    {"id": "speedLimit", "label": "Speed Limit", "type": "text", "required": true},
    {"id": "appealReason", "label": "Reason for Appeal", "type": "select", "options": ["Camera calibration error", "Unclear signage", "Emergency circumstances", "Not the driver", "Speed reading error", "Road conditions", "Other"], "required": true},
    {"id": "appealDetails", "label": "Detailed Explanation", "type": "textarea", "required": true},
    {"id": "evidence", "label": "Supporting Evidence", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing traffic penalty appeals. Generate a formal appeal letter challenging a speeding ticket. Present factual arguments about camera accuracy, signage visibility, or mitigating circumstances. Reference traffic enforcement guidelines and request review or cancellation of the penalty.',
  88
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'speeding-ticket-appeal');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'traffic'),
  'Parking Ticket Appeal',
  'parking-ticket-appeal',
  'Challenge unfair parking fines and penalties',
  '[
    {"id": "driverName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "vehicleReg", "label": "Vehicle Registration", "type": "text", "required": true},
    {"id": "ticketNumber", "label": "Ticket/PCN Number", "type": "text", "required": true},
    {"id": "issueDate", "label": "Date Ticket Issued", "type": "date", "required": true},
    {"id": "location", "label": "Location", "type": "text", "required": true},
    {"id": "ticketAmount", "label": "Fine Amount", "type": "text", "required": true},
    {"id": "appealReason", "label": "Reason for Appeal", "type": "select", "options": ["No signage visible", "Unclear markings", "Loading/unloading", "Medical emergency", "Meter malfunction", "Blue badge displayed", "Ticket error", "Other"], "required": true},
    {"id": "circumstances", "label": "Detailed Circumstances", "type": "textarea", "required": true},
    {"id": "photos", "label": "Do You Have Photos/Evidence?", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing parking ticket appeals. Generate a persuasive appeal letter challenging the parking penalty. Reference parking regulations, signage requirements, and any procedural errors. Present clear reasons why the ticket should be canceled, supported by evidence where available.',
  85
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'parking-ticket-appeal');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'traffic'),
  'Driving Ban Appeal',
  'driving-ban-appeal',
  'Appeal driving disqualification or totting up',
  '[
    {"id": "driverName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "licenseNumber", "label": "License Number", "type": "text", "required": true},
    {"id": "banType", "label": "Type of Ban", "type": "select", "options": ["Totting up (12 points)", "Single serious offence", "Drink/drug driving", "Dangerous driving", "Other"], "required": true},
    {"id": "banDate", "label": "Date of Ban/Court Hearing", "type": "date", "required": true},
    {"id": "banLength", "label": "Length of Ban", "type": "text", "required": true},
    {"id": "exceptionalHardship", "label": "Exceptional Hardship Circumstances", "type": "textarea", "placeholder": "Explain how a ban would cause exceptional hardship", "required": true},
    {"id": "employment", "label": "Employment Impact", "type": "textarea", "required": true},
    {"id": "dependents", "label": "Impact on Dependents", "type": "textarea", "required": false},
    {"id": "alternatives", "label": "Alternative Transport Options", "type": "textarea", "required": true},
    {"id": "supportingDocs", "label": "Supporting Documentation", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing driving disqualification appeals based on exceptional hardship. Generate a compelling appeal letter that demonstrates how a driving ban would cause exceptional hardship beyond normal inconvenience. Present factual evidence of the impact on employment, family responsibilities, and health needs. Reference relevant case law if applicable.',
  75
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'driving-ban-appeal');
