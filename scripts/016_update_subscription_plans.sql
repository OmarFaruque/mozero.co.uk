-- Update subscription plans to reflect new GBP pricing and document limits
UPDATE subscription_plans 
SET 
  price_cents = 1599,
  credits_per_month = 40,
  description = 'Perfect for occasional users. Generate up to 40 documents per month.'
WHERE name = 'Basic Plan';

UPDATE subscription_plans 
SET 
  price_cents = 3999,
  credits_per_month = 250,
  description = 'For regular users. Generate up to 250 documents per month with priority support.'
WHERE name = 'Professional Plan';

UPDATE subscription_plans 
SET 
  price_cents = 7999
WHERE name = 'Business Plan';
