-- Templates for Travel & Airline category

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'travel'),
  'Flight Delay Compensation',
  'flight-delay-compensation',
  'Claim compensation for delayed flights',
  '[
    {"id": "passengerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "bookingReference", "label": "Booking Reference", "type": "text", "required": true},
    {"id": "airline", "label": "Airline Name", "type": "text", "required": true},
    {"id": "flightNumber", "label": "Flight Number", "type": "text", "required": true},
    {"id": "scheduledDate", "label": "Scheduled Flight Date", "type": "date", "required": true},
    {"id": "route", "label": "Route (From - To)", "type": "text", "required": true},
    {"id": "delayLength", "label": "Length of Delay", "type": "text", "required": true},
    {"id": "actualArrival", "label": "Actual Arrival Time", "type": "text", "required": true},
    {"id": "reasonGiven", "label": "Reason Given by Airline", "type": "textarea", "required": false},
    {"id": "assistance", "label": "Assistance Provided", "type": "textarea", "placeholder": "Food, accommodation, etc.", "required": false},
    {"id": "expenses", "label": "Additional Expenses Incurred", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing flight delay compensation claims under EU Regulation 261/2004 or equivalent passenger rights laws. Generate a formal compensation claim citing the specific regulations and compensation amounts based on flight distance and delay length. Request the statutory compensation amount and reimbursement of reasonable expenses.',
  92
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'flight-delay-compensation');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'travel'),
  'Flight Cancellation Claim',
  'flight-cancellation-claim',
  'Claim for cancelled flight compensation',
  '[
    {"id": "passengerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "bookingReference", "label": "Booking Reference", "type": "text", "required": true},
    {"id": "airline", "label": "Airline Name", "type": "text", "required": true},
    {"id": "flightNumber", "label": "Flight Number", "type": "text", "required": true},
    {"id": "scheduledDate", "label": "Scheduled Date", "type": "date", "required": true},
    {"id": "route", "label": "Route", "type": "text", "required": true},
    {"id": "noticeGiven", "label": "When Were You Notified", "type": "text", "required": true},
    {"id": "alternativeFlight", "label": "Alternative Flight Offered?", "type": "textarea", "required": false},
    {"id": "reasonGiven", "label": "Reason Given", "type": "textarea", "required": false},
    {"id": "expenses", "label": "Additional Costs Incurred", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing flight cancellation compensation claims. Generate a formal claim under passenger rights regulations, requesting compensation based on the short notice of cancellation and lack of extraordinary circumstances. Include claims for reimbursement of additional expenses and request the full compensation amount.',
  90
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'flight-cancellation-claim');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'travel'),
  'Lost Luggage Claim',
  'lost-luggage-claim',
  'Claim compensation for lost or damaged baggage',
  '[
    {"id": "passengerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "bookingReference", "label": "Booking/Ticket Number", "type": "text", "required": true},
    {"id": "airline", "label": "Airline Name", "type": "text", "required": true},
    {"id": "flightNumber", "label": "Flight Number", "type": "text", "required": true},
    {"id": "flightDate", "label": "Flight Date", "type": "date", "required": true},
    {"id": "baggageTag", "label": "Baggage Tag Number(s)", "type": "text", "required": true},
    {"id": "reportReference", "label": "PIR/Report Reference", "type": "text", "required": false},
    {"id": "reportDate", "label": "Date Reported", "type": "date", "required": true},
    {"id": "baggageType", "label": "Type of Issue", "type": "select", "options": ["Lost/missing", "Damaged", "Delayed", "Contents missing"], "required": true},
    {"id": "baggageContents", "label": "Description of Baggage Contents", "type": "textarea", "required": true},
    {"id": "itemValues", "label": "Value of Items", "type": "textarea", "required": true},
    {"id": "expenses", "label": "Emergency Purchases Made", "type": "textarea", "required": false}
  ]',
  'You are an expert at writing baggage claim letters under Montreal Convention and airline liability rules. Generate a formal claim for lost, damaged, or delayed baggage. Itemize contents and values, reference airline liability limits, and request compensation for the baggage and any emergency purchases made.',
  82
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'lost-luggage-claim');

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  (SELECT id FROM categories WHERE slug = 'travel'),
  'Holiday Complaint',
  'holiday-complaint',
  'Complain about substandard holiday or accommodation',
  '[
    {"id": "customerName", "label": "Your Full Name", "type": "text", "required": true},
    {"id": "bookingReference", "label": "Booking Reference", "type": "text", "required": true},
    {"id": "travelCompany", "label": "Travel Company/Tour Operator", "type": "text", "required": true},
    {"id": "holidayDates", "label": "Holiday Dates", "type": "text", "required": true},
    {"id": "destination", "label": "Destination/Accommodation", "type": "text", "required": true},
    {"id": "totalCost", "label": "Total Holiday Cost", "type": "text", "required": true},
    {"id": "issues", "label": "Issues Experienced", "type": "textarea", "placeholder": "Describe all problems with the holiday", "required": true},
    {"id": "brochureDescription", "label": "How Did It Differ From Description?", "type": "textarea", "required": true},
    {"id": "reportedOnsite", "label": "Was This Reported During Holiday?", "type": "textarea", "required": true},
    {"id": "photosEvidence", "label": "Do You Have Photos/Evidence?", "type": "textarea", "required": false},
    {"id": "compensationSought", "label": "Compensation Sought", "type": "text", "required": true}
  ]',
  'You are an expert at writing holiday complaint letters under Package Travel Regulations. Generate a comprehensive complaint letter documenting all issues with the holiday, how it differed from what was promised, and the impact on the holiday experience. Request appropriate compensation and reference consumer protection laws.',
  78
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'holiday-complaint');
