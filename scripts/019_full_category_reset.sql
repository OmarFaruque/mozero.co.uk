-- Full reset of categories and templates to eliminate duplicates
-- This will clean slate the categories and rebuild them correctly

-- First, delete all templates (due to foreign key constraints)
DELETE FROM templates;

-- Delete all categories
DELETE FROM categories;

-- Reset the sequence
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE templates_id_seq RESTART WITH 1;

-- Now recreate all categories cleanly
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Dispute Letters', 'disputes', 'Challenge incorrect charges, billing errors, and service disputes', 'file-warning', 1),
  ('Insurance', 'insurance', 'File insurance claims and dispute insurance issues', 'shield-check', 2),
  ('Complaint Letters', 'complaints', 'Formal complaints about products, services, and businesses', 'message-square-warning', 3),
  ('Appeals', 'appeals', 'Appeal denied claims, decisions, and administrative actions', 'repeat', 4),
  ('Official Documents', 'official', 'Request records, certifications, and official correspondence', 'file-text', 5),
  ('Refund Claims', 'refund-claims', 'Request refunds for products, services, and subscriptions', 'receipt', 6),
  ('Chargeback & Payment Disputes', 'chargeback-disputes', 'Bank disputes, chargebacks, and payment protection claims', 'credit-card', 7),
  ('Car Dealer Disputes', 'car-dealer', 'Reject faulty cars, request repairs, and dispute dealers', 'car', 8),
  ('Landlord & Tenant', 'landlord-tenant', 'Deposits, repairs, harassment, and tenancy issues', 'home', 9),
  ('Workplace & HR', 'workplace', 'Grievances, appeals, and workplace complaints', 'briefcase', 10),
  ('Traffic & Speeding', 'traffic', 'Appeal fines, tickets, and traffic violations', 'alert-circle', 11),
  ('Travel & Airline', 'travel', 'Flight compensation, refunds, and travel complaints', 'plane', 12),
  ('DVLA', 'dvla', 'Vehicle registration and DVLA disputes', 'file-check', 13),
  ('General Complaints', 'general-complaints', 'Company complaints and service issues', 'message-square', 14);
