-- ============================================
-- LETTERISE COMPLETE DATABASE SETUP
-- Run this script once to set up your database
-- ============================================

-- ============================================
-- PART 1: CREATE TABLES
-- ============================================

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  credits_per_month INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User credits
CREATE TABLE IF NOT EXISTS user_credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  credits_available INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Document templates
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  use_cases TEXT[],
  system_prompt TEXT NOT NULL,
  questions JSONB NOT NULL,
  estimated_length VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_inputs JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  credits_used INTEGER DEFAULT 1,
  font_family VARCHAR(100),
  font_size VARCHAR(20),
  text_color VARCHAR(20),
  is_bold BOOLEAN DEFAULT FALSE,
  is_italic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR(255),
  amount_cents INTEGER NOT NULL,
  credits_purchased INTEGER,
  transaction_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_category_id ON templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ============================================
-- PART 2: INSERT CATEGORIES
-- ============================================

INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Dispute Letters', 'disputes', 'Challenge incorrect charges, billing errors, and service disputes', 'file-warning', 1),
  ('Insurance', 'insurance', 'File insurance claims and dispute insurance issues', 'shield-check', 2),
  ('Complaint Letters', 'complaints', 'Formal complaints about products, services, and businesses', 'message-square-warning', 3),
  ('Appeals', 'appeals', 'Appeal denied claims, decisions, and administrative actions', 'repeat', 4),
  ('Official Documents', 'official', 'Request records, certifications, and official correspondence', 'file-text', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PART 3: INSERT ALL TEMPLATES
-- ============================================

-- Dispute Letters Templates
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Credit Card Dispute', 'credit-card-dispute', 'Dispute unauthorized or incorrect credit card charges',
'[{"id":"recipientName","label":"Credit Card Company Name","type":"text","required":true},{"id":"cardNumber","label":"Last 4 Digits of Card","type":"text","required":true},{"id":"disputedAmount","label":"Disputed Amount","type":"text","required":true},{"id":"transactionDate","label":"Transaction Date","type":"date","required":true},{"id":"merchantName","label":"Merchant Name","type":"text","required":true},{"id":"disputeReason","label":"Reason for Dispute","type":"textarea","required":true}]',
'You are a professional letter writer. Create a formal credit card dispute letter following UK consumer protection guidelines. Include all transaction details, clearly state the dispute reason, reference the Consumer Credit Act 1974 Section 75, and request immediate investigation and temporary credit.'
FROM categories WHERE slug = 'disputes';

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Debt Validation', 'debt-validation', 'Request validation and proof of alleged debt',
'[{"id":"recipientName","label":"Collection Agency Name","type":"text","required":true},{"id":"debtAmount","label":"Alleged Debt Amount","type":"text","required":true},{"id":"referenceNumber","label":"Reference Number","type":"text","required":true},{"id":"originalCreditor","label":"Original Creditor Name","type":"text","required":true},{"id":"disputeReason","label":"Why You Dispute This Debt","type":"textarea","required":true}]',
'You are a professional letter writer. Create a debt validation letter citing UK consumer credit legislation. Request complete documentation proving the debt is valid, enforceable, and belongs to the recipient. Demand they cease collection activity until validation is provided. Reference the Consumer Credit Act and Financial Conduct Authority guidelines.'
FROM categories WHERE slug = 'disputes';

-- Insurance Templates (from your comprehensive list)
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Insurance Claim Letter', 'insurance-claim', 'File a comprehensive insurance claim',
'[{"id":"insuranceCompany","label":"Insurance Company Name","type":"text","required":true},{"id":"policyNumber","label":"Policy Number","type":"text","required":true},{"id":"dateOfIncident","label":"Date of Incident","type":"date","required":true},{"id":"claimType","label":"Type of Claim","type":"select","options":["Property Damage","Personal Injury","Auto Accident","Health","Other"],"required":true},{"id":"incidentDescription","label":"Incident Description","type":"textarea","required":true},{"id":"estimatedLoss","label":"Estimated Loss/Damages","type":"text","required":true},{"id":"supportingDocs","label":"Supporting Documents Available","type":"textarea","required":false}]',
'You are a professional insurance claim letter writer. Create a detailed, formal insurance claim letter including policy details, incident description, estimated damages, and request for prompt processing. Reference relevant policy terms and UK insurance regulations.'
FROM categories WHERE slug = 'insurance';

-- Complaint Letters Templates  
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Consumer Complaint Letter', 'consumer-complaint', 'General consumer complaint about products or services',
'[{"id":"companyName","label":"Company Name","type":"text","required":true},{"id":"productService","label":"Product/Service Name","type":"text","required":true},{"id":"purchaseDate","label":"Purchase Date","type":"date","required":true},{"id":"issueDescription","label":"Issue Description","type":"textarea","required":true},{"id":"desiredResolution","label":"Desired Resolution","type":"textarea","required":true}]',
'You are a professional complaint letter writer. Create a firm but professional consumer complaint letter citing the Consumer Rights Act 2015. Clearly describe the issue, reference relevant consumer rights, and request specific resolution with a reasonable deadline.'
FROM categories WHERE slug = 'complaints';

-- Appeals Templates
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Health Insurance Appeal', 'health-insurance-appeal', 'Appeal a denied health insurance claim',
'[{"id":"insuranceCompany","label":"Insurance Company","type":"text","required":true},{"id":"policyNumber","label":"Policy Number","type":"text","required":true},{"id":"claimNumber","label":"Claim Number","type":"text","required":true},{"id":"denialDate","label":"Denial Date","type":"date","required":true},{"id":"treatmentService","label":"Treatment/Service Denied","type":"text","required":true},{"id":"denialReason","label":"Reason Given for Denial","type":"textarea","required":true},{"id":"whyNecessary","label":"Why Treatment is Medically Necessary","type":"textarea","required":true}]',
'You are a professional appeal letter writer. Create a compelling health insurance appeal letter citing medical necessity, policy coverage terms, and relevant healthcare regulations. Include specific medical justification and request immediate reconsideration.'
FROM categories WHERE slug = 'appeals';

INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'Academic Appeal Letter', 'academic-appeal', 'Appeal an academic decision',
'[{"id":"recipientName","label":"Dean/Committee Name","type":"text","required":true},{"id":"studentId","label":"Student ID","type":"text","required":true},{"id":"appealType","label":"Type of Appeal","type":"select","options":["Grade","Dismissal","Suspension","Other"],"required":true},{"id":"decisionDate","label":"Decision Date","type":"date","required":true},{"id":"appealReason","label":"Grounds for Appeal","type":"textarea","required":true},{"id":"supportingEvidence","label":"Supporting Evidence","type":"textarea","required":true}]',
'You are a professional academic appeal writer. Create a respectful yet persuasive academic appeal letter presenting clear grounds for reconsideration, supporting evidence, and demonstrating commitment to academic success. Follow university appeals procedures and maintain professional tone.'
FROM categories WHERE slug = 'appeals';

-- Official Documents Templates
INSERT INTO templates (category_id, name, slug, description, questions, system_prompt)
SELECT id, 'FOIA Request Letter', 'foia-request', 'Request information under Freedom of Information Act',
'[{"id":"publicBody","label":"Public Body Name","type":"text","required":true},{"id":"informationRequested","label":"Information Requested","type":"textarea","required":true},{"id":"purposeOfRequest","label":"Purpose of Request","type":"textarea","required":false},{"id":"preferredFormat","label":"Preferred Format","type":"select","options":["Email","Post","Electronic Copy"],"required":true}]',
'You are a professional FOIA request writer. Create a clear, specific Freedom of Information Act request citing the Freedom of Information Act 2000. Clearly describe the information sought, reference the legal right to information, and request response within the 20-working-day statutory timeframe.'
FROM categories WHERE slug = 'official';
