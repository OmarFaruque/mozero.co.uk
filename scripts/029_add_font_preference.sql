-- Add font_preference column to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS font_preference VARCHAR(50) DEFAULT 'times';

-- Valid font options: 'times', 'arial', 'courier', 'georgia'
