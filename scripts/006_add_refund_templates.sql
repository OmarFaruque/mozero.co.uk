-- Refund Claims Templates (using existing 'refund-claims' category)
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Amazon Refund Request',
  'amazon-refund',
  'Request a refund for a defective or misrepresented Amazon purchase',
  '[
    {"id":"order_number","label":"Amazon Order Number","type":"text","required":true},
    {"id":"product_name","label":"Product Name","type":"text","required":true},
    {"id":"issue","label":"What''s wrong with the product?","type":"textarea","required":true},
    {"id":"resolution","label":"Desired Resolution","type":"select","options":["Full Refund","Replacement","Partial Refund"],"required":true}
  ]'::jsonb,
  'You are an expert at writing Amazon refund request letters. Generate a clear, professional refund request that explains the issue, references Amazon''s A-to-Z Guarantee, and requests a specific resolution. Be firm but polite.',
  95
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Airline Ticket Refund',
  'airline-ticket-refund',
  'Request a refund for a cancelled or delayed flight',
  '[
    {"id":"airline_name","label":"Airline Name","type":"text","required":true},
    {"id":"flight_number","label":"Flight Number","type":"text","required":true},
    {"id":"booking_reference","label":"Booking Reference","type":"text","required":true},
    {"id":"reason","label":"Reason for Refund","type":"select","options":["Flight Cancelled","Flight Delayed","Overbooked","Other"],"required":true},
    {"id":"amount","label":"Ticket Amount","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing airline refund request letters. Generate a letter that references EU261/2004 compensation rules (if applicable), airline policies, and passenger rights. Include all flight details and request specific compensation.',
  90
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Hotel Booking Refund',
  'hotel-refund',
  'Request a refund for a hotel booking that didn''t meet standards',
  '[
    {"id":"hotel_name","label":"Hotel Name","type":"text","required":true},
    {"id":"booking_number","label":"Booking/Confirmation Number","type":"text","required":true},
    {"id":"check_in_date","label":"Check-in Date","type":"date","required":true},
    {"id":"issue","label":"Reason for Refund Request","type":"textarea","required":true},
    {"id":"amount","label":"Booking Amount","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing hotel refund request letters. Generate a letter describing the issues experienced, referencing booking terms and consumer protection laws. Request a full or partial refund based on the circumstances.',
  85
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Gym Membership Cancellation Refund',
  'gym-refund',
  'Cancel gym membership and request refund for unused months',
  '[
    {"id":"gym_name","label":"Gym/Fitness Center Name","type":"text","required":true},
    {"id":"member_number","label":"Membership Number","type":"text","required":true},
    {"id":"cancellation_reason","label":"Reason for Cancellation","type":"textarea","required":true},
    {"id":"unused_months","label":"Number of Unused Months","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing gym membership cancellation and refund letters. Generate a letter that requests cancellation, references contract terms, and requests a pro-rata refund for unused membership period.',
  80
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Faulty Product Refund',
  'faulty-product-refund',
  'Request a refund for a faulty or defective product',
  '[
    {"id":"seller_name","label":"Seller/Store Name","type":"text","required":true},
    {"id":"product_name","label":"Product Name","type":"text","required":true},
    {"id":"purchase_date","label":"Date of Purchase","type":"date","required":true},
    {"id":"fault","label":"Describe the Fault/Defect","type":"textarea","required":true},
    {"id":"amount","label":"Purchase Amount","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing product refund letters. Generate a letter that explains the defect, references consumer protection laws and statutory rights, and requests a full refund or replacement.',
  92
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Subscription Service Refund',
  'subscription-refund',
  'Request a refund for an unwanted or misrepresented subscription',
  '[
    {"id":"service_name","label":"Service/Company Name","type":"text","required":true},
    {"id":"subscription_type","label":"Subscription Type","type":"text","required":true},
    {"id":"charge_date","label":"Date of Charge","type":"date","required":true},
    {"id":"reason","label":"Reason for Refund Request","type":"textarea","required":true},
    {"id":"amount","label":"Amount Charged","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing subscription refund request letters. Generate a letter that explains why the charge is disputed, references auto-renewal laws, and requests a full refund.',
  88
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Course/Training Refund',
  'course-refund',
  'Request a refund for an online course or training program',
  '[
    {"id":"provider_name","label":"Course Provider Name","type":"text","required":true},
    {"id":"course_name","label":"Course/Training Name","type":"text","required":true},
    {"id":"enrollment_date","label":"Enrollment Date","type":"date","required":true},
    {"id":"reason","label":"Reason for Refund","type":"textarea","required":true},
    {"id":"amount","label":"Course Fee Paid","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing course refund request letters. Generate a letter that explains dissatisfaction with the course quality, references the refund policy or cooling-off period, and requests a full refund.',
  75
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Event Ticket Refund',
  'event-ticket-refund',
  'Request a refund for cancelled or rescheduled event tickets',
  '[
    {"id":"event_name","label":"Event Name","type":"text","required":true},
    {"id":"event_date","label":"Original Event Date","type":"date","required":true},
    {"id":"ticket_provider","label":"Ticket Provider/Seller","type":"text","required":true},
    {"id":"order_number","label":"Order/Booking Number","type":"text","required":true},
    {"id":"reason","label":"Reason for Refund","type":"select","options":["Event Cancelled","Event Rescheduled","Unable to Attend","Event Changed Significantly"],"required":true},
    {"id":"amount","label":"Ticket Amount","type":"text","required":true}
  ]'::jsonb,
  'You are an expert at writing event ticket refund letters. Generate a letter that references consumer rights, the event change or cancellation, and requests a full refund including booking fees.',
  82
FROM categories c WHERE c.slug = 'refund-claims'
ON CONFLICT (slug) DO NOTHING;
