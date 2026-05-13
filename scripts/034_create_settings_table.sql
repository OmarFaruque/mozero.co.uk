-- Create settings table for storing configuration key-value pairs
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Insert default Stripe settings
INSERT INTO settings (key, value, description)
VALUES (
  'stripe',
  '{"publishable_key": "", "secret_key": "", "webhook_secret": ""}',
  'Stripe API credentials and webhook secret'
)
ON CONFLICT (key) DO NOTHING;
