-- Templates for Workplace & HR category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'workplace'),
  'Grievance Letter',
  'workplace-grievance',
  'File formal workplace grievance with employer',
  '[
    {"id": "employeeName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "employeeId", "label": "Employee ID", "type": "text", "required": false},
    {"id": "department", "label": "Department/Position", "type": "text", "required": true},
    {"id": "grievanceType", "label": "Type of Grievance", "type": "select", "options": ["Discrimination", "Harassment", "Bullying", "Unfair treatment", "Working conditions", "Wage/hours dispute", "Contract violation", "Other"], "required": true},
    {"id": "grievanceDetails", "label": "Detailed Description of Grievance", "type": "textarea", "required": true},
    {"id": "incidentDates", "label": "Date(s) of Incident(s)", "type": "textarea", "required": true},
    {"id": "peopleInvolved", "label": "People Involved", "type": "textarea", "required": true},
    {"id": "witnesses", "label": "Witnesses", "type": "textarea", "required": false},
    {"id": "previousActions", "label": "Previous Actions Taken", "type": "textarea", "required": false},
    {"id": "desiredResolution", "label": "Desired Resolution", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing formal workplace grievance letters. Generate a professional grievance letter following employment law guidelines. Present facts objectively, reference company policies and employment rights, and clearly state the desired resolution. Maintain a professional tone while being clear about the seriousness of the matter.',
  85
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'workplace-grievance');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'workplace'),
  'Disciplinary Appeal',
  'disciplinary-appeal',
  'Appeal unfair disciplinary action or dismissal',
  '[
    {"id": "employeeName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "employeeId", "label": "Employee ID", "type": "text", "required": false},
    {"id": "actionType", "label": "Type of Disciplinary Action", "type": "select", "options": ["Written warning", "Final written warning", "Suspension", "Dismissal", "Demotion", "Other"], "required": true},
    {"id": "actionDate", "label": "Date of Disciplinary Action", "type": "date", "required": true},
    {"id": "allegation", "label": "Allegation Against You", "type": "textarea", "required": true},
    {"id": "appealGrounds", "label": "Grounds for Appeal", "type": "select", "options": ["Unfair process", "Insufficient evidence", "Disproportionate penalty", "New evidence available", "Procedural errors", "Discrimination", "Other"], "required": true},
    {"id": "appealReason", "label": "Detailed Reason for Appeal", "type": "textarea", "required": true},
    {"id": "supportingEvidence", "label": "Supporting Evidence", "type": "textarea", "required": false},
    {"id": "desiredOutcome", "label": "Desired Outcome", "type": "textarea", "required": true}
  ]',
  'You are an expert at writing disciplinary appeal letters. Generate a compelling appeal that challenges the disciplinary action based on procedural fairness, evidence, or proportionality. Reference employment contract terms, company disciplinary procedures, and employment law. Present a clear argument while maintaining professionalism.',
  80
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'disciplinary-appeal');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'workplace'),
  'Constructive Dismissal Claim',
  'constructive-dismissal',
  'Claim constructive dismissal due to employer breach',
  '[
    {"id": "employeeName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "position", "label": "Job Title", "type": "text", "required": true},
    {"id": "employmentStartDate", "label": "Employment Start Date", "type": "date", "required": true},
    {"id": "resignationDate", "label": "Resignation Date", "type": "date", "required": true},
    {"id": "breachDescription", "label": "Description of Employer Breach", "type": "textarea", "placeholder": "Describe how the employer fundamentally breached your employment contract", "required": true},
    {"id": "timeline", "label": "Timeline of Events", "type": "textarea", "required": true},
    {"id": "attemptedResolution", "label": "Attempts to Resolve", "type": "textarea", "required": true},
    {"id": "impact", "label": "Impact on You", "type": "textarea", "required": true},
    {"id": "evidence", "label": "Evidence Available", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing constructive dismissal claim letters. Generate a formal letter asserting that the employer fundamental breach of contract forced resignation. Clearly establish that the breach was serious enough to justify resignation and that efforts were made to resolve the issues. Reference employment law and seek compensation.',
  70
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'constructive-dismissal');
