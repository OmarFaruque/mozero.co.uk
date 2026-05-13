-- Add unique constraint to stripe_subscription_id in user_subscriptions table
ALTER TABLE user_subscriptions ADD CONSTRAINT unique_stripe_subscription_id UNIQUE (stripe_subscription_id);
