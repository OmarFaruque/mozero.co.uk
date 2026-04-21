const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Parse the database URL
const url = new URL(DATABASE_URL);
const host = url.hostname;
const port = url.port || 5432;
const database = url.pathname.slice(1);
const user = url.username;
const password = url.password;

// PostgreSQL connection string for curl
async function runSQLViaHTTP(sql) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      query: sql,
      db: database
    });

    const options = {
      hostname: host,
      port: 443,
      path: '/sql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(params.toString());
    req.end();
  });
}

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

    // Instead, read one SQL file and show instructions
    if (sqlFiles.length > 0) {
      console.log('📋 To run migrations, please use the Neon Dashboard:\n');
      console.log('1. Visit: https://console.neon.tech');
      console.log('2. Open the SQL Editor for your database');
      console.log('3. Run the following SQL files in order:\n');
      
      sqlFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });

      console.log('\n4. OR run this command in your terminal with pnpm or yarn:\n');
      console.log('   pnpm install  # Install dependencies first');
      console.log('   node scripts/setup.mjs\n');
      console.log('⚠️  Note: Node.js 18+ required for the automated migration script\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runMigrations();
