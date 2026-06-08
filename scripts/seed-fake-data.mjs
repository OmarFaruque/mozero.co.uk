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

const getRandomDate = (monthsBack) => {
  const date = new Date();
  date.setMonth(date.getMonth() - getRandomInt(0, monthsBack));
  date.setDate(getRandomInt(1, 28));
  date.setHours(getRandomInt(0, 23), getRandomInt(0, 59));
  return date;
};

async function seedFakeData() {
  try {
    console.log('🚀 Starting realistic fake data seeding...\n');

    // 1. Get existing plans and templates
    const plans = await sql`SELECT id, name, price_cents FROM subscription_plans WHERE is_active = true`;
    const templates = await sql`SELECT id, name FROM templates WHERE is_active = true`;

    if (plans.length === 0 || templates.length === 0) {
      console.error('❌ No plans or templates found. Please run migrations first.');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash('password123', 10);

    console.log(`Generating data for 15 users...`);

    for (let i = 0; i < 15; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(10, 99)}@${getRandom(domains)}`;
      const createdAt = getRandomDate(6); // Created up to 6 months ago

      // Insert User
      const [user] = await sql`
        INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
        VALUES (${email}, ${passwordHash}, ${fullName}, ${createdAt}, ${createdAt})
        RETURNING id
      `;

      console.log(`👤 Created user: ${email}`);

      // Initial Credits
      await sql`
        INSERT INTO user_credits (user_id, credits_available, credits_used, updated_at)
        VALUES (${user.id}, ${getRandomInt(0, 50)}, ${getRandomInt(0, 10)}, ${createdAt})
      `;

      // Decide if user has a subscription
      if (Math.random() > 0.3) {
        const plan = getRandom(plans);
        const subStatus = Math.random() > 0.1 ? 'active' : 'canceled';
        const subStart = new Date(createdAt);
        subStart.setHours(subStart.getHours() + 2);
        
        const subEnd = new Date(subStart);
        subEnd.setMonth(subEnd.getMonth() + 1);

        await sql`
          INSERT INTO user_subscriptions (user_id, plan_id, status, current_period_start, current_period_end, created_at, updated_at)
          VALUES (${user.id}, ${plan.id}, ${subStatus}, ${subStart}, ${subEnd}, ${subStart}, ${subStart})
        `;

        // Create transaction for subscription
        if (plan.price_cents > 0) {
          await sql`
            INSERT INTO transactions (user_id, amount_cents, transaction_type, status, created_at)
            VALUES (${user.id}, ${plan.price_cents}, 'subscription', 'completed', ${subStart})
          `;
        }
      }

      // Add 1-3 individual credit purchases (transactions)
      const transCount = getRandomInt(0, 3);
      for (let j = 0; j < transCount; j++) {
        const transDate = new Date(createdAt);
        transDate.setDate(transDate.getDate() + getRandomInt(1, 100));
        const amount = getRandomInt(500, 5000);
        
        await sql`
          INSERT INTO transactions (user_id, amount_cents, credits_purchased, transaction_type, status, created_at)
          VALUES (${user.id}, ${amount}, ${Math.floor(amount/100)}, 'credits', 'completed', ${transDate})
        `;
      }

      // Add 2-7 documents
      const docCount = getRandomInt(2, 7);
      for (let k = 0; k < docCount; k++) {
        const template = getRandom(templates);
        const docDate = new Date(createdAt);
        docDate.setDate(docDate.getDate() + getRandomInt(1, 150));
        const status = getRandom(['draft', 'finalized']);
        const title = `${template.name} for ${firstName}`;
        const content = `This is a realistically generated document content for ${template.name}`;

        await sql`
          INSERT INTO documents (user_id, template_id, title, content, status, created_at, updated_at)
          VALUES (${user.id}, ${template.id}, ${title}, ${content}, ${status}, ${docDate}, ${docDate})
        `;
      }
    }

    console.log('\n✨ Realistic fake data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding fake data:');
    console.error(error.message);
    process.exit(1);
  }
}

seedFakeData();
