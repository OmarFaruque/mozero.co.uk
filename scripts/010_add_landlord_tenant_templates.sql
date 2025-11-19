-- Templates for Landlord & Tenant category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'landlord-tenant'),
  'Deposit Return Request',
  'deposit-return-request',
  'Request return of security deposit from landlord',
  '[
    {"id": "tenantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "tenantAddress", "label": "Your Current Address", "type": "textarea", "required": true},
    {"id": "landlordName", "label": "Landlord/Agency Name", "type": "text", "required": true},
    {"id": "propertyAddress", "label": "Rental Property Address", "type": "textarea", "required": true},
    {"id": "tenancyStartDate", "label": "Tenancy Start Date", "type": "date", "required": true},
    {"id": "tenancyEndDate", "label": "Tenancy End Date", "type": "date", "required": true},
    {"id": "depositAmount", "label": "Deposit Amount", "type": "text", "required": true},
    {"id": "depositScheme", "label": "Deposit Protection Scheme", "type": "text", "required": false},
    {"id": "deductionsClaimed", "label": "Deductions Claimed by Landlord", "type": "textarea", "required": false},
    {"id": "disputeReason", "label": "Reason for Disputing Deductions", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing tenancy deposit dispute letters. Generate a firm but professional letter requesting the return of a security deposit. Reference tenancy deposit protection regulations, document the condition of the property, and challenge any unfair deductions. Include legal obligations and consequences of non-compliance.',
  90
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'deposit-return-request');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'landlord-tenant'),
  'Repair Request Letter',
  'repair-request-letter',
  'Formally request essential repairs from landlord',
  '[
    {"id": "tenantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "propertyAddress", "label": "Rental Property Address", "type": "textarea", "required": true},
    {"id": "landlordName", "label": "Landlord Name", "type": "text", "required": true},
    {"id": "repairIssue", "label": "Repair Issue", "type": "select", "options": ["Heating/boiler", "Plumbing/water", "Electrical", "Structural damage", "Damp/mold", "Windows/doors", "Roof leak", "Other"], "required": true},
    {"id": "issueDescription", "label": "Detailed Description of Issue", "type": "textarea", "required": true},
    {"id": "firstReported", "label": "When Was This First Reported", "type": "date", "required": true},
    {"id": "previousRequests", "label": "Previous Repair Requests", "type": "textarea", "required": false},
    {"id": "healthSafety", "label": "Does This Affect Health or Safety?", "type": "select", "options": ["Yes", "No"], "required": true},
    {"id": "urgency", "label": "Urgency Level", "type": "select", "options": ["Emergency - immediate danger", "Urgent - major inconvenience", "Normal - needs addressing", "Minor"], "required": true}
  ]',
  'You are an expert at writing repair request letters to landlords. Generate a formal letter requesting essential repairs, citing the landlord obligation to maintain the property in a habitable condition. Reference relevant housing laws and tenancy agreements. Set a reasonable deadline for repairs and mention potential next steps if not addressed.',
  88
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'repair-request-letter');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'landlord-tenant'),
  'Harassment Complaint',
  'landlord-harassment-complaint',
  'Complain about landlord harassment or illegal eviction',
  '[
    {"id": "tenantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "propertyAddress", "label": "Property Address", "type": "textarea", "required": true},
    {"id": "landlordName", "label": "Landlord Name", "type": "text", "required": true},
    {"id": "harassmentType", "label": "Type of Harassment", "type": "select", "options": ["Illegal eviction attempt", "Excessive property visits", "Threats or intimidation", "Utility interference", "Privacy violations", "Other"], "required": true},
    {"id": "incidentDetails", "label": "Detailed Description of Incidents", "type": "textarea", "required": true},
    {"id": "incidentDates", "label": "Dates of Incidents", "type": "textarea", "required": true},
    {"id": "witnesses", "label": "Witnesses (if any)", "type": "textarea", "required": false},
    {"id": "evidence", "label": "Evidence Available", "type": "textarea", "placeholder": "Photos, messages, recordings, etc.", "required": false},
    {"id": "previousComplaints", "label": "Have You Complained Before?", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing tenant rights protection letters. Generate a serious formal complaint about landlord harassment, citing tenant protection laws and the right to quiet enjoyment. Document incidents clearly, reference illegal eviction protections, and warn of legal consequences. The tone should be firm and legally informed while maintaining professionalism.',
  82
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'landlord-harassment-complaint');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'landlord-tenant'),
  'Notice to Quit',
  'tenant-notice-to-quit',
  'Provide formal notice to end tenancy agreement',
  '[
    {"id": "tenantName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "propertyAddress", "label": "Property Address", "type": "textarea", "required": true},
    {"id": "landlordName", "label": "Landlord Name", "type": "text", "required": true},
    {"id": "landlordAddress", "label": "Landlord Address", "type": "textarea", "required": true},
    {"id": "tenancyType", "label": "Tenancy Type", "type": "select", "options": ["Assured shorthold tenancy", "Periodic tenancy", "Fixed-term tenancy", "Other"], "required": true},
    {"id": "noticeDate", "label": "Date of This Notice", "type": "date", "required": true},
    {"id": "vacateDate", "label": "Intended Vacate Date", "type": "date", "required": true},
    {"id": "noticePeriod", "label": "Required Notice Period", "type": "text", "placeholder": "e.g., 1 month, 2 months", "required": true},
    {"id": "forwardingAddress", "label": "Forwarding Address", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing formal tenancy termination notices. Generate a clear notice to quit letter that complies with the required notice period under the tenancy agreement. Include all necessary details, request return of deposit and final utilities readings, and provide forwarding address for correspondence.',
  75
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'tenant-notice-to-quit');
