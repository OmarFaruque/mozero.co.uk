-- Remove any duplicate Insurance/Insurance Claims categories
-- Keep only the one with slug 'insurance'

-- First, get the ID of the category we want to keep
DO $$
DECLARE
  insurance_category_id INT;
BEGIN
  -- Get the ID of the insurance category we want to keep
  SELECT id INTO insurance_category_id FROM categories WHERE slug = 'insurance' LIMIT 1;
  
  -- If there's a category with slug 'insurance', delete any other insurance-related duplicates
  IF insurance_category_id IS NOT NULL THEN
    -- Update any templates that might be pointing to duplicate categories
    UPDATE templates 
    SET category_id = insurance_category_id 
    WHERE category_id IN (
      SELECT id FROM categories 
      WHERE (name ILIKE '%insurance%' OR slug ILIKE '%insurance%' OR slug = 'claims') 
      AND id != insurance_category_id
    );
    
    -- Delete duplicate insurance categories
    DELETE FROM categories 
    WHERE (name ILIKE '%insurance%' OR slug = 'claims') 
    AND id != insurance_category_id;
  END IF;
END $$;
