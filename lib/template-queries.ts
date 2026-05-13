import 'server-only'
import { sql } from '@/lib/db'

export async function getTemplateBySlug(slug: string) {
  try {
    const templates = await sql`
      SELECT 
        id, name, slug, description, category_id, system_prompt, questions, use_cases,
        COALESCE(estimated_length, '1-2 pages') as estimated_length
      FROM templates
      WHERE slug = ${slug} AND is_active = true
      LIMIT 1
    `
    
    if (templates.length === 0) {
      return null
    }
    
    const template = templates[0]
    
    // Get category info
    const categories = await sql`
      SELECT id, name, slug FROM categories WHERE id = ${template.category_id} LIMIT 1
    `
    
    const category = categories.length > 0 ? categories[0] : null
    
    return {
      ...template,
      category_name: category?.name,
      questions: template.questions ? (typeof template.questions === 'string' ? JSON.parse(template.questions) : template.questions) : [],
      system_prompt: template.system_prompt || 'Write a professional, formal letter based on the provided information.'
    }
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}
