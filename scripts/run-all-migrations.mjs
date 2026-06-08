#!/usr/bin/env node

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
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log('✅ Database URL loaded from .env');

const sql = neon(DATABASE_URL);

// Get all SQL files from scripts directory, sorted numerically
function getSqlFiles() {
  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.sql'))
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[0]) || 0;
      const numB = parseInt(b.split('_')[0]) || 0;
      if (numA === numB) {
        return a.localeCompare(b);
      }
      return numA - numB;
    });
  
  return files;
}

// Main execution
async function runMigrations() {
  try {
    const sqlFiles = getSqlFiles();
    
    if (sqlFiles.length === 0) {
      console.log('⚠️  No SQL files found in scripts directory');
      process.exit(0);
    }
    
    console.log(`\n📦 Found ${sqlFiles.length} SQL files to execute:\n`);
    sqlFiles.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
    
    console.log('\n🚀 Starting migration process...\n');
    
    let completed = 0;
    let skipped = 0;
    
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        console.log(`⏳ [${completed + skipped + 1}/${sqlFiles.length}] Executing: ${file}`);
        
        // Split by semicolon to handle multiple statements
        const statements = fileContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        for (const statement of statements) {
          await sql.query(statement);
        }
        
        console.log(`✅ ${file} completed\n`);
        completed++;
      } catch (error) {
        console.error(`⚠️  Error in ${file}:`);
        console.error(`   ${error.message}\n`);
        skipped++;
        // Continue with next file instead of stopping
      }
    }
    
    console.log(`\n✨ Migration completed!`);
    console.log(`   ✅ Successful: ${completed}/${sqlFiles.length}`);
    if (skipped > 0) {
      console.log(`   ⚠️  Skipped (with errors): ${skipped}/${sqlFiles.length}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error during migrations');
    console.error(error.message);
    process.exit(1);
  }
}

runMigrations();
