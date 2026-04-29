-- Seed only: first default administrator account (password: Admin123456)
INSERT INTO admin_user (first_name, last_name, email, password_hash, role, is_active)
VALUES (
  'System',
  'Administrator',
  'admin@letterise.co.uk',
  '$2b$10$XKnRJd2yCS7H0SMsrqBZUua9pnoiGmdWgOY7veMALRd7VxgwlS9KC',
  'super_admin',
  TRUE
)
ON CONFLICT (email) DO UPDATE
SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;