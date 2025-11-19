-- Chargeback & Payment Disputes Templates
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Credit Card Chargeback Request',
  'credit-card-chargeback',
  'Request a chargeback for unauthorized or fraudulent charges',
  '[
    {"id":"bank_name","label":"Bank/Card Issuer Name","type":"text","required":true},
    {"id":"card_last_four","label":"Last 4 Digits of Card","type":"text","required":true},
    {"id":"transaction_date","label":"Transaction Date","type":"date","required":true},
    {"id":"merchant_name","label":"Merchant Name","type":"text","required":true},
    {"id":"amount","label":"Transaction Amount","type":"text","required":true},
    {"id":"reason","label":"Reason for Chargeback","type":"select","options":["Fraudulent Transaction","Service Not Received","Product Not as Described","Duplicate Charge","Cancelled Recurring Payment"],"required":true},
    {"id":"details","label":"Additional Details","type":"textarea","required":true}
  ]'::jsonb,
  'You are an expert at writing chargeback request letters. Generate a formal letter to the bank requesting a chargeback, citing the specific reason code, providing evidence, and explaining why the charge is disputed under card network rules.',
  94
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'PayPal Dispute Letter',
  'paypal-dispute',
  'Open a dispute for a PayPal transaction',
  '[
    {"id":"transaction_id","label":"PayPal Transaction ID","type":"text","required":true},
    {"id":"seller_email","label":"Seller Email/Username","type":"text","required":true},
    {"id":"transaction_date","label":"Transaction Date","type":"date","required":true},
    {"id":"amount","label":"Amount Paid","type":"text","required":true},
    {"id":"issue","label":"Describe the Issue","type":"textarea","required":true},
    {"id":"resolution","label":"Desired Resolution","type":"select","options":["Full Refund","Partial Refund","Item Return"],"required":true}
  ]'::jsonb,
  'You are an expert at writing PayPal dispute letters. Generate a detailed dispute letter that explains the issue clearly, provides transaction evidence, and references PayPal''s Buyer Protection policy.',
  89
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Unauthorized Bank Transaction Dispute',
  'unauthorized-bank-transaction',
  'Dispute an unauthorized transaction from your bank account',
  '[
    {"id":"bank_name","label":"Bank Name","type":"text","required":true},
    {"id":"account_number","label":"Account Number (last 4 digits)","type":"text","required":true},
    {"id":"transaction_date","label":"Transaction Date","type":"date","required":true},
    {"id":"amount","label":"Amount","type":"text","required":true},
    {"id":"merchant_name","label":"Merchant/Payee Name","type":"text","required":true},
    {"id":"details","label":"Why is this transaction unauthorized?","type":"textarea","required":true}
  ]'::jsonb,
  'You are an expert at writing unauthorized transaction dispute letters. Generate a formal letter that clearly states the transaction was not authorized, requests immediate reversal, and references banking regulations protecting consumers.',
  91
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Billing Error Dispute',
  'billing-error-dispute',
  'Dispute an incorrect charge or billing error',
  '[
    {"id":"company_name","label":"Company Name","type":"text","required":true},
    {"id":"account_number","label":"Account Number","type":"text","required":true},
    {"id":"statement_date","label":"Statement Date","type":"date","required":true},
    {"id":"incorrect_amount","label":"Incorrect Amount Charged","type":"text","required":true},
    {"id":"correct_amount","label":"Correct Amount","type":"text","required":true},
    {"id":"error_description","label":"Describe the Billing Error","type":"textarea","required":true}
  ]'::jsonb,
  'You are an expert at writing billing error dispute letters. Generate a letter that identifies the specific error, provides correct information, and requests correction and refund within regulatory timeframes.',
  87
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Direct Debit Cancellation & Refund',
  'direct-debit-cancel',
  'Cancel a direct debit and request refund for unauthorized payments',
  '[
    {"id":"bank_name","label":"Your Bank Name","type":"text","required":true},
    {"id":"company_name","label":"Company Taking Payment","type":"text","required":true},
    {"id":"direct_debit_date","label":"Date of Last Payment","type":"date","required":true},
    {"id":"amount","label":"Amount","type":"text","required":true},
    {"id":"reason","label":"Reason for Cancellation","type":"textarea","required":true}
  ]'::jsonb,
  'You are an expert at writing direct debit cancellation letters. Generate a letter that requests immediate cancellation of the direct debit mandate and refund of any unauthorized payments under the Direct Debit Guarantee.',
  86
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt, popularity_score)
SELECT 
  c.id,
  'Section 75 Credit Card Claim',
  'section-75-claim',
  'Make a Section 75 claim for purchases made on credit card (UK)',
  '[
    {"id":"card_issuer","label":"Credit Card Issuer","type":"text","required":true},
    {"id":"merchant_name","label":"Retailer/Merchant Name","type":"text","required":true},
    {"id":"purchase_date","label":"Purchase Date","type":"date","required":true},
    {"id":"amount","label":"Purchase Amount (£100-£30,000)","type":"text","required":true},
    {"id":"issue","label":"What went wrong?","type":"textarea","required":true},
    {"id":"attempts","label":"What attempts have you made to resolve this?","type":"textarea","required":true}
  ]'::jsonb,
  'You are an expert at writing Section 75 Consumer Credit Act claims. Generate a formal letter that invokes Section 75 joint liability, explains the breach of contract or misrepresentation, and requests full reimbursement from the card issuer.',
  93
FROM categories c WHERE c.slug = 'chargeback-disputes'
ON CONFLICT (slug) DO NOTHING;
