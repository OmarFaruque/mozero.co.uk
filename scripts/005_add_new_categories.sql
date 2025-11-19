-- Add new categories (without duplicating Insurance Claims which already exists with slug 'claims')
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Refund Claims', 'refund-claims', 'Request refunds for products, services, and subscriptions', 'receipt', 6),
  ('Chargeback & Payment Disputes', 'chargeback-disputes', 'Bank disputes, chargebacks, and payment protection claims', 'credit-card', 7),
  ('Car Dealer Disputes', 'car-dealer', 'Reject faulty cars, request repairs, and dispute dealers', 'car', 8),
  ('Landlord & Tenant', 'landlord-tenant', 'Deposits, repairs, harassment, and tenancy issues', 'home', 9),
  ('Workplace & HR', 'workplace', 'Grievances, appeals, and workplace complaints', 'briefcase', 10),
  ('Traffic & Speeding', 'traffic', 'Appeal fines, tickets, and traffic violations', 'alert-circle', 11),
  ('Travel & Airline', 'travel', 'Flight compensation, refunds, and travel complaints', 'plane', 12),
  ('DVLA', 'dvla', 'Vehicle registration and DVLA disputes', 'file-check', 13),
  ('General Complaints', 'general-complaints', 'Company complaints and service issues', 'message-square', 14)
ON CONFLICT (slug) DO NOTHING;
