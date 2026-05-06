-- Add support for credit packages + monthly subscriptions in a single plans table
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) NOT NULL DEFAULT 'subscription',
  ADD COLUMN IF NOT EXISTS package_price_cents INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_per_document_cents INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credit_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_document_limit INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'subscription_plans_plan_type_check'
  ) THEN
    ALTER TABLE subscription_plans
      ADD CONSTRAINT subscription_plans_plan_type_check
      CHECK (plan_type IN ('credits', 'subscription'));
  END IF;
END $$;

UPDATE subscription_plans
SET
  package_price_cents = COALESCE(NULLIF(package_price_cents, 0), price_cents),
  monthly_document_limit = COALESCE(NULLIF(monthly_document_limit, 0), credits_per_month),
  features = CASE WHEN cardinality(features) = 0 THEN ARRAY['Priority support', 'All document templates'] ELSE features END
WHERE TRUE;