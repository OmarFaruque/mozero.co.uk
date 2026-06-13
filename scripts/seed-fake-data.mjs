import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env file
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
      if (key) process.env[key.trim()] = value;
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Realistic name parts for generating diverse emails
const firstNames = ['Emma', 'James', 'Olivia', 'Benjamin', 'Sophia', 'Lucas', 'Ava', 'Henry', 'Isabella', 'Alexander', 'Mia', 'Michael', 'Charlotte', 'David', 'Amelia', 'Joseph', 'Harper', 'Charles', 'Evelyn', 'Thomas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com', 'protonmail.com', 'live.com', 'aol.com'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateDocRef = (index) => `DOC-${new Date().getFullYear()}-${String(index).padStart(6, '0')}`;

const generateDocumentContent = (docType, refNumber) => {
  const templates = {
    'Complaint Letter': `FORMAL COMPLAINT LETTER\n\nReference: ${refNumber}\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nDear Sir/Madam,\n\nI am writing to formally lodge a complaint regarding my account and the services provided.\n\nPlease review this matter urgently and provide a comprehensive response within 14 days.\n\nYours faithfully`,
    'Appeal Form': `FORMAL APPEAL SUBMISSION\n\nReference: ${refNumber}\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nI am submitting this formal appeal in response to the previous decision.\n\nI request a full review of this case.`,
    'Dispute Notice': `NOTICE OF DISPUTE\n\nReference: ${refNumber}\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nThis notice is to formally dispute this matter. Immediate action is required.`,
    'Bank Statement': `BANK STATEMENT - DISPUTE RECORD\n\nReference: ${refNumber}\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nThis statement confirms the dispute has been filed and is under investigation.`,
    'Claim Form': `OFFICIAL CLAIM FORM\n\nClaim Reference: ${refNumber}\nDate Filed: ${new Date().toLocaleDateString('en-GB')}\n\nThe information provided in this form is complete and accurate.`,
  };
  return templates[docType] || templates['Complaint Letter'];
};

async function seed() {
  try {
    console.log('🚀 Starting data seeding with 2,759 realistic users...\n');

    // Fetch templates
    console.log('📋 Checking for active templates...');
    const templates = await sql`SELECT id, name FROM templates WHERE is_active = true`;
    if (templates.length === 0) {
      console.error('❌ No active templates found. Database may need initialization.');
      process.exit(1);
    }
    console.log(`✅ Found ${templates.length} templates\n`);

    // Clear existing data
    console.log('🧹 Clearing existing user and document data...');
    try {
      await sql`DELETE FROM documents`;
      await sql`DELETE FROM user_credits`;
      await sql`DELETE FROM user_subscriptions`;
      await sql`DELETE FROM transactions`;
      await sql`DELETE FROM users`;
      console.log('✅ Old data cleared\n');
    } catch (err) {
      if (!err.message.includes('does not exist')) throw err;
      console.log('✅ Tables ready\n');
    }

    // Generate users
    const passwordHash = await bcrypt.hash('password123', 10);
    const TARGET_USERS = 2759;
    console.log(`👤 Creating ${TARGET_USERS} realistic users...`);

    let userIds = [];
    const batchSize = 100;

    for (let i = 0; i < TARGET_USERS; i += batchSize) {
      const batch = Math.min(batchSize, TARGET_USERS - i);
      const promises = [];

      for (let j = 0; j < batch; j++) {
        const index = i + j;
        const firstName = getRandom(firstNames);
        const lastName = getRandom(lastNames);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${getRandom(domains)}`;
        const fullName = `${firstName} ${lastName}`;
        const createdAt = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);

        promises.push(
          sql`
            INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
            VALUES (${email}, ${passwordHash}, ${fullName}, ${createdAt}, ${createdAt})
            RETURNING id, created_at
          `.then(r => r[0])
        );
      }

      const batchResults = await Promise.all(promises);
      userIds.push(...batchResults);

      if ((i + batch) % 500 === 0 || (i + batch) === TARGET_USERS) {
        console.log(`   ... ${i + batch} users created`);
      }
    }

    // Generate documents
    const docTypes = [
      'Complaint Letter',
      'Appeal Form',
      'Dispute Notice',
      'Bank Statement',
      'Claim Form',
    ];

    console.log(`\n📄 Generating 8,264 documents (~3 per user)...\n`);

    let docsCreated = 0;
    let refCounter = 1;
    const TARGET_DOCS = 8264;

    for (let i = 0; i < TARGET_DOCS; i += 100) {
      const batch = Math.min(100, TARGET_DOCS - i);
      const promises = [];

      for (let j = 0; j < batch; j++) {
        const user = userIds[Math.floor(Math.random() * userIds.length)];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const docType = getRandom(docTypes);

        const userDate = new Date(user.created_at);
        const now = new Date();
        const docDate = new Date(userDate.getTime() + Math.random() * (now.getTime() - userDate.getTime()));

        const refNumber = generateDocRef(refCounter++);
        const title = `${docType} - ${refNumber}`;
        const content = generateDocumentContent(docType, refNumber);
        const status = Math.random() > 0.7 ? 'finalized' : 'draft';

        promises.push(
          sql`
            INSERT INTO documents (user_id, template_id, title, content, status, created_at, updated_at)
            VALUES (${user.id}, ${template.id}, ${title}, ${content}, ${status}, ${docDate}, ${docDate})
          `
        );
      }

      await Promise.all(promises);
      docsCreated += batch;

      if (docsCreated % 1000 === 0 || docsCreated === TARGET_DOCS) {
        console.log(`   ... ${docsCreated} documents created`);
      }
    }

    // Add user credits
    console.log(`\n💳 Setting up user credits...\n`);
    let creditsProcessed = 0;

    for (let i = 0; i < userIds.length; i += 200) {
      const batch = userIds.slice(i, Math.min(i + 200, userIds.length));
      const promises = batch.map(user =>
        sql`
          INSERT INTO user_credits (user_id, credits_available, credits_used, updated_at)
          VALUES (${user.id}, ${getRandomInt(0, 20)}, 0, ${user.created_at})
        `
      );

      await Promise.all(promises);
      creditsProcessed += batch.length;

      if (creditsProcessed % 1000 === 0 || creditsProcessed === userIds.length) {
        console.log(`   ... ${creditsProcessed} users processed`);
      }
    }

    console.log('\n✨ Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Total Users: ${TARGET_USERS}`);
    console.log(`   - Total Documents: ${TARGET_DOCS}`);
    console.log(`   - Avg Documents per User: ${(TARGET_DOCS / TARGET_USERS).toFixed(2)}`);
    console.log(`   - Real-looking data: Yes`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
