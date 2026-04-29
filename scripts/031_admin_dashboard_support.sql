-- Admin dashboard support indexes for the Letterise database.
-- Authentication uses ADMIN_EMAIL and ADMIN_PASSWORD or ADMIN_PASSWORD_HASH environment variables.

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
