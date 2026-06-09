import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env file manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
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
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// --- Real-looking Data Helpers ---

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com', 'protonmail.com'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = (daysBack) => {
  const date = new Date();
  if (daysBack === 0) return date;
  
  if (Math.random() > 0.9) return date;

  const msBack = getRandomInt(0, daysBack * 24 * 60 * 60 * 1000);
  date.setTime(date.getTime() - msBack);
  return date;
};

// Helper for sequential batches
async function runInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(item => fn(item)));
    results.push(...batchResults);
  }
  return results;
}

async function seedFakeData() {
  try {
    console.log('🚀 Starting realistic fake data seeding...\n');

    console.log('🧹 Clearing old data...');
    await sql`TRUNCATE users CASCADE`;
    console.log('✅ Tables truncated.\n');

    const templates = await sql`SELECT id, name FROM templates WHERE is_active = true`;
    if (templates.length === 0) {
      console.error('❌ No templates found. Please run migrations first.');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const TARGET_USERS = 2759;
    const TARGET_DOCS = 8264;

    console.log(`👤 Generating ${TARGET_USERS} users...`);
    
    let allUserIds = [];
    const usersToCreate = Array.from({ length: TARGET_USERS }, (_, i) => i);

    // Using smaller concurrency (20) for user creation
    allUserIds = await runInBatches(usersToCreate, 20, async (i) => {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}${getRandomInt(10, 99)}@${getRandom(domains)}`;
      const createdAt = getRandomDate(730);

      const [user] = await sql`
        INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
        VALUES (${email}, ${passwordHash}, ${fullName}, ${createdAt}, ${createdAt})
        RETURNING id, created_at
      `;
      
      if ((i + 1) % 500 === 0) console.log(`   ... ${i + 1} users created`);
      return user;
    });

    console.log(`\n📄 Generating ${TARGET_DOCS} documents...`);
    
    const docsToCreate = Array.from({ length: TARGET_DOCS }, (_, i) => i);
    let docsCreatedCount = 0;

    await runInBatches(docsToCreate, 20, async (i) => {
      const user = getRandom(allUserIds);
      const template = getRandom(templates);
      
      const userCreatedAt = new Date(user.created_at);
      const now = new Date();
      const diffMs = now.getTime() - userCreatedAt.getTime();
      const docDate = new Date(userCreatedAt.getTime() + Math.random() * diffMs);
      
      if (Math.random() > 0.95) docDate.setTime(now.getTime());

      const status = getRandom(['draft', 'finalized']);
      const title = `${template.name} - ${docDate.toLocaleDateString('en-GB')}`;
      const content = `This is a realistically generated document content for ${template.name}. Generated on ${docDate.toISOString()}.`;

      await sql`
        INSERT INTO documents (user_id, template_id, title, content, status, created_at, updated_at)
        VALUES (${user.id}, ${template.id}, ${title}, ${content}, ${status}, ${docDate}, ${docDate})
      `;
      
      docsCreatedCount++;
      if (docsCreatedCount % 1000 === 0) console.log(`   ... ${docsCreatedCount} documents created`);
    });

    console.log(`\n💳 Adding credits and transactions...`);
    let processedUsersCount = 0;

    await runInBatches(allUserIds, 20, async (user) => {
      const available = getRandomInt(0, 20);
      const used = getRandomInt(0, 10);
      
      await sql`
        INSERT INTO user_credits (user_id, credits_available, credits_used, updated_at)
        VALUES (${user.id}, ${available}, ${used}, ${user.created_at})
      `;

      if (Math.random() > 0.8) {
        const transCount = getRandomInt(1, 2);
        for (let k = 0; k < transCount; k++) {
          const amount = getRandomInt(500, 5000);
          const userCreatedAtMs = new Date(user.created_at).getTime();
          const transDate = new Date(userCreatedAtMs + Math.random() * (new Date().getTime() - userCreatedAtMs));
          
          await sql`
            INSERT INTO transactions (user_id, amount_cents, credits_purchased, transaction_type, status, created_at)
            VALUES (${user.id}, ${amount}, ${Math.floor(amount/100)}, 'credits', 'completed', ${transDate})
          `;
        }
      }
      
      processedUsersCount++;
      if (processedUsersCount % 500 === 0) console.log(`   ... processed ${processedUsersCount} users`);
    });

    console.log('\n✨ Realistic fake data seeding completed successfully!');
    console.log(`📊 Total Users: ${TARGET_USERS}`);
    console.log(`📊 Total Documents: ${TARGET_DOCS}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding fake data:');
    console.error(error.message);
    process.exit(1);
  }
}

seedFakeData();
