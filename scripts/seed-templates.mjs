import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key.trim()] = value;
      }
    }
  }
}

loadEnv();

const sql = neon(process.env.DATABASE_URL);

// Import templates data
const templates = [
  // Dispute Letters
  {
    id: 1,
    category_id: 1,
    name: 'Credit Card Dispute Letter',
    slug: 'credit-card-dispute',
    description: 'Dispute unauthorized or incorrect credit card charges',
    use_cases: ['Fraudulent charges', 'Billing errors', 'Service not received'],
    estimated_length: '1-2 pages',
    is_featured: true,
    is_active: true,
    system_prompt: 'Create a formal credit card dispute letter citing the Fair Credit Billing Act.',
    questions: [
      { id: 'card_last_four', label: 'Card Last 4 Digits', type: 'text', required: true },
      { id: 'transaction_date', label: 'Transaction Date', type: 'date', required: true },
      { id: 'transaction_amount', label: 'Amount Disputed', type: 'text', required: true },
      { id: 'merchant_name', label: 'Merchant Name', type: 'text', required: true },
      { id: 'dispute_reason', label: 'Reason for Dispute', type: 'select', required: true, options: ['Unauthorized charge', 'Billing error', 'Service not received', 'Damaged goods'] },
      { id: 'explanation', label: 'Detailed Explanation', type: 'textarea', required: true }
    ]
  },
  // Insurance Claims
  {
    id: 7,
    category_id: 2,
    name: 'Auto Insurance Claim',
    slug: 'auto-insurance-claim',
    description: 'File claims for vehicle damage or accidents',
    use_cases: ['Collision damage', 'Theft', 'Vandalism'],
    estimated_length: '2-3 pages',
    is_featured: false,
    is_active: true,
    system_prompt: 'You are a professional insurance claim letter writer. Create a formal, factual auto insurance claim letter based on the provided information.',
    questions: [
      { id: 'policyholder_name', label: 'Your Full Name', type: 'text', required: true },
      { id: 'policy_number', label: 'Insurance Policy Number', type: 'text', required: true },
      { id: 'vehicle_info', label: 'Vehicle Information (Year, Make, Model)', type: 'text', required: true },
      { id: 'incident_date', label: 'Date of Incident', type: 'date', required: true },
      { id: 'incident_type', label: 'Type of Incident', type: 'select', required: true, options: ['Collision Damage', 'Theft', 'Vandalism', 'Weather Damage', 'Other'] },
      { id: 'incident_description', label: 'Description of Incident', type: 'textarea', required: true },
      { id: 'damage_description', label: 'Damage Details', type: 'textarea', required: true },
      { id: 'claim_amount', label: 'Estimated Repair Cost', type: 'text', required: false }
    ]
  },
  {
    id: 6,
    category_id: 2,
    name: 'Health Insurance Claim',
    slug: 'health-insurance-claim',
    description: 'File claims for medical expenses and treatments',
    use_cases: ['Medical bills', 'Hospital stays', 'Prescription costs'],
    estimated_length: '2-3 pages',
    is_featured: true,
    is_active: true,
    system_prompt: 'Create a formal health insurance claim letter with all necessary medical details.',
    questions: [
      { id: 'policyholder_name', label: 'Policyholder Name', type: 'text', required: true },
      { id: 'policy_number', label: 'Policy Number', type: 'text', required: true },
      { id: 'service_date', label: 'Date of Medical Service', type: 'date', required: true },
      { id: 'provider_name', label: 'Healthcare Provider Name', type: 'text', required: true },
      { id: 'service_description', label: 'Description of Services', type: 'textarea', required: true },
      { id: 'amount_claimed', label: 'Amount Claimed', type: 'text', required: true }
    ]
  }
];

async function seedTemplates() {
  try {
    console.log('🚀 Starting template seeding...\n');

    // First, clear existing templates
    await sql`DELETE FROM templates WHERE id IN (1, 6, 7)`;
    console.log('Cleared old templates\n');

    for (const template of templates) {
      console.log(`📝 Inserting: ${template.name}...`);
      
      try {
        const questionsJson = JSON.stringify(template.questions);
        
        // Use backtick template syntax with proper Neon syntax
        const result = await sql`
          INSERT INTO templates 
            (id, category_id, name, slug, description, use_cases, estimated_length, is_featured, is_active, system_prompt, questions)
          VALUES 
            (${template.id}, ${template.category_id}, ${template.name}, ${template.slug}, ${template.description}, ${template.use_cases}, ${template.estimated_length}, ${template.is_featured}, ${template.is_active}, ${template.system_prompt}, ${questionsJson})
        `;
        
        console.log(`✅ ${template.name} inserted`);
      } catch (error) {
        console.error(`❌ Error with ${template.name}:`, error.message);
      }
    }

    console.log('\n🎉 Template seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

seedTemplates();
