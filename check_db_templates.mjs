import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
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

const DATABASE_URL = process.env.DATABASE_URL;
const sql = neon(DATABASE_URL);

async function checkTemplates() {
  try {
    const templates = await sql`SELECT id, name, slug, is_active FROM templates WHERE slug LIKE '%insurance%' LIMIT 10;`;
    
    console.log('Templates in database:');
    templates.forEach((t) => {
      con      con      con      con      con      con   ${t.slug}, Active: ${t      con      con   ;
    
    console.log('\nLooking for auto-insurance-claim specifically:');
    const specific = await sql`SELECT id, name, slug, is_active, questions, system_prompt FROM templates WHERE slug = 'auto-insurance-claim';`;
    if (specific.length > 0) {
      console.log('Found:', specific[0]);
    } else {
      console.log('NOT FOUND in database');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTemplates();
