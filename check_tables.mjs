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

async function checkTables() {
  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;
    
    console.log('📊 Tables in your database:\n');
    result.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\n✅ Total tables: ${result.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();
