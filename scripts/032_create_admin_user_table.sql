-- Admin users table for administrator authentication and role-based access management
CREATE TABLE IF NOT EXISTS admin_user (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_user_role_check CHECK (role IN ('admin', 'super_admin', 'manager'))
);

CREATE INDEX IF NOT EXISTS idx_admin_user_email ON admin_user(email);
CREATE INDEX IF NOT EXISTS idx_admin_user_role ON admin_user(role);
CREATE INDEX IF NOT EXISTS idx_admin_user_is_active ON admin_user(is_active);

-- Seed the first default administrator account (password: Admin123456)
INSERT INTO admin_user (first_name, last_name, email, password_hash, role, is_active)
VALUES (
  'System',
  'Administrator',
  'admin@mozero.co.uk',
  '$2b$10$XKnRJd2yCS7H0SMsrqBZUua9pnoiGmdWgOY7veMALRd7VxgwlS9KC',
  'super_admin',
  TRUE
)
ON CONFLICT (email) DO NOTHING;