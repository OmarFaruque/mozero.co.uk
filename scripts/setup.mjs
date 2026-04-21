import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env file manually
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

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('✅ Database URL loaded');

const sql = neon(DATABASE_URL);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Get all SQL files from scripts directory
    const scriptsDir = __dirname;
    const sqlFiles = fs.readdirSync(scriptsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.log('ℹ️  No SQL files found to migrate');
      return;
    }

    console.log(`Found ${sqlFiles.length} migration files\n`);

    for (const file of sqlFiles) {
      const filePath = path.join(scriptsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      console.log(`⏳ Running ${file}...`);

      try {
        // Split by semicolon to handle multiple statements
        const statements = fileContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
          await sql.query(statement);
        }

        console.log(`✅ ${file} completed\n`);
      } catch (error) {
        console.error(`❌ Error in ${file}:`);
        console.error(error.message);
        console.error('');
        // Continue with next file instead of stopping
      }
    }

    console.log('🎉 Database migrations completed!');
  } catch (error) {
    console.error('❌ Fatal error during migrations:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
