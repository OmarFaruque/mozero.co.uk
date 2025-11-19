-- Insert document categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Dispute Letters', 'disputes', 'Challenge incorrect charges, billing errors, and service disputes', 'file-warning', 1),
  -- Changed slug from 'claims' to 'insurance' to avoid duplicate category names
  ('Insurance', 'insurance', 'File insurance claims and dispute insurance issues', 'shield-check', 2),
  ('Complaint Letters', 'complaints', 'Formal complaints about products, services, and businesses', 'message-square-warning', 3),
  ('Appeals', 'appeals', 'Appeal denied claims, decisions, and administrative actions', 'repeat', 4),
  ('Official Documents', 'official', 'Request records, certifications, and official correspondence', 'file-text', 5)
ON CONFLICT (slug) DO NOTHING;
