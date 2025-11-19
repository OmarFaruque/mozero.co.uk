-- Templates for Car Dealer Disputes category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'car-dealer'),
  'Reject Faulty Car',
  'reject-faulty-car',
  'Reject a defective vehicle under consumer protection laws',
  '[
    {"id": "buyerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "buyerAddress", "label": "Your Address", "type": "textarea", "required": true},
    {"id": "dealerName", "label": "Dealer Name", "type": "text", "required": true},
    {"id": "dealerAddress", "label": "Dealer Address", "type": "textarea", "required": true},
    {"id": "vehicleMake", "label": "Vehicle Make/Model", "type": "text", "required": true},
    {"id": "vehicleReg", "label": "Registration Number", "type": "text", "required": true},
    {"id": "purchaseDate", "label": "Purchase Date", "type": "date", "required": true},
    {"id": "purchasePrice", "label": "Purchase Price", "type": "text", "required": true},
    {"id": "faultDescription", "label": "Description of Fault(s)", "type": "textarea", "required": true},
    {"id": "faultDiscovered", "label": "When Fault Was Discovered", "type": "text", "required": true},
    {"id": "dealerResponse", "label": "Dealer Response to Complaint", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing consumer rights letters for faulty vehicles. Generate a firm rejection letter citing the Consumer Rights Act 2015 or relevant consumer protection laws. State that the vehicle is not of satisfactory quality and request a full refund. Include all purchase details and fault descriptions. Be professional but assertive about consumer rights.',
  85
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'reject-faulty-car');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'car-dealer'),
  'Request Car Repair',
  'request-car-repair',
  'Demand repairs for vehicle defects under warranty',
  '[
    {"id": "buyerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "dealerName", "label": "Dealer Name", "type": "text", "required": true},
    {"id": "vehicleDetails", "label": "Vehicle Make/Model/Registration", "type": "text", "required": true},
    {"id": "purchaseDate", "label": "Purchase Date", "type": "date", "required": true},
    {"id": "problemDescription", "label": "Problem Description", "type": "textarea", "required": true},
    {"id": "warrantyStatus", "label": "Warranty Status", "type": "select", "options": ["Under manufacturer warranty", "Under dealer warranty", "No warranty"], "required": true},
    {"id": "previousRepairs", "label": "Previous Repair Attempts", "type": "textarea", "required": false},
    {"id": "urgency", "label": "Urgency of Repair", "type": "select", "options": ["Safety critical", "Vehicle unusable", "Affecting performance", "Minor issue"], "required": true}
  ]',
  'You are an expert at writing vehicle repair demand letters. Generate a professional letter requesting repairs under warranty or consumer rights. Reference the specific warranty terms if applicable, and cite consumer protection laws. Request a timeline for repairs and provision of a courtesy vehicle if appropriate.',
  78
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'request-car-repair');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'car-dealer'),
  'Car Finance Dispute',
  'car-finance-dispute',
  'Dispute car financing terms or unfair agreements',
  '[
    {"id": "customerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "accountNumber", "label": "Finance Account Number", "type": "text", "required": true},
    {"id": "financeCompany", "label": "Finance Company Name", "type": "text", "required": true},
    {"id": "vehicleDetails", "label": "Vehicle Details", "type": "text", "required": true},
    {"id": "agreementDate", "label": "Finance Agreement Date", "type": "date", "required": true},
    {"id": "disputeReason", "label": "Reason for Dispute", "type": "select", "options": ["Misrepresented terms", "Hidden fees", "Incorrect interest rate", "Unfair contract terms", "Payment protection insurance mis-sold", "Other"], "required": true},
    {"id": "issueDetails", "label": "Detailed Explanation of Issue", "type": "textarea", "required": true},
    {"id": "desiredOutcome", "label": "Desired Resolution", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing finance dispute letters. Generate a formal letter disputing car finance terms, citing relevant financial regulations and consumer credit laws. Present the facts clearly and request specific action such as contract review, fee refunds, or interest adjustments.',
  72
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'car-finance-dispute');
