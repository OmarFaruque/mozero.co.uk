-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price_cents, credits_per_month) VALUES
  ('Pay Per Use', 'Purchase credits as needed. No monthly commitment.', 0, 0),
  ('Basic Plan', 'Perfect for occasional users. Generate up to 10 documents per month.', 1999, 10),
  ('Professional Plan', 'For regular users. Generate up to 30 documents per month with priority support.', 4999, 30),
  ('Business Plan', 'Unlimited document generation with advanced features and dedicated support.', 9999, 999)
ON CONFLICT DO NOTHING;
