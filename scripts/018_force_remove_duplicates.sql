-- Force remove any duplicate Insurance categories
-- This is a direct cleanup script to handle existing duplicates

-- Delete any category with slug 'claims' (old Insurance Claims)
DELETE FROM categories WHERE slug = 'claims';

-- If somehow there are multiple with slug 'insurance', keep only the first one
DELETE FROM categories 
WHERE slug = 'insurance' 
AND id NOT IN (
  SELECT MIN(id) FROM categories WHERE slug = 'insurance'
);

-- Make sure all insurance templates point to the correct category
UPDATE templates 
SET category_id = (SELECT id FROM categories WHERE slug = 'insurance' LIMIT 1)
WHERE category_id IS NULL 
OR category_id NOT IN (SELECT id FROM categories);
