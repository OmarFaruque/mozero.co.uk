import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = 'postgresql://neondb_owner:npg_VgSmhw0IA9bF@ep-still-dawn-a4xygmi7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const TEMPNOW_DB_URL = 'postgresql://neondb_owner:npg_VgSmhw0IA9bF@ep-still-dawn-a4xygmi7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);
const tempnowSql = neon(TEMPNOW_DB_URL);

async function runSetupAndSeed() {
  try {
    console.log('📊 Running database setup...\n');
    
    // Read setup SQL
    const setupSQL = fs.readFileSync(path.join(__dirname, 'scripts/000_complete_setup.sql'), 'utf-8');
    
    // Execute setup - treat the entire file as one query since it has comments
    try {
      await sql.query(setupSQL);
      console.log('✅ Database tables and seed data created!\n');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✅ Tables already exist\n');
      } else {
        throw err;
      }
    }

    // Now run the seed-fake-data script logic
    console.log('🚀 Starting data seeding with real tempnow emails...\n');

    console.log('🔗 Fetching emails from tempnow database...');
    let tempnowEmails = [];
    try {
      const result = await tempnowSql`
        SELECT DISTINCT email FROM users WHERE email IS NOT NULL LIMIT 2759
      `;
      tempnowEmails = result.map(row => row.email).filter(email => email && email.length > 0);
      console.log(`✅ Successfully fetched ${tempnowEmails.length} unique emails from tempnow\n`);
    } catch (err) {
      console.error('⚠️  Could not connect to tempnow database');
      tempnowEmails = [];
    }

    console.log('🧹 Clearing old user data...');
    await sql`TRUNCATE users CASCADE`;
    console.log('✅ Tables truncated.\n');

    const templates = await sql`SELECT id, name FROM templates WHERE is_active = true`;
    if (templates.length === 0) {
      console.error('❌ No templates found. Setup may have failed.');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash('password123', 10);
    const TARGET_USERS = tempnowEmails.length > 0 ? Math.min(tempnowEmails.length, 2759) : 2759;
    const TARGET_DOCS = 8264;

    console.log(`👤 Creating ${TARGET_USERS} users...`);
    
    let allUserIds = [];
    const batch20 = 20;

    // Create users
    for (let i = 0; i < TARGET_USERS; i += batch20) {
      const batchSize = Math.min(batch20, TARGET_USERS - i);
      const promises = [];

      for (let j = 0; j < batchSize; j++) {
        const index = i + j;
        const email = tempnowEmails[index] || `user.${index}@example.com`;
        const createdAt = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);
        const namePart = email.split('@')[0].split(/[._-]/).slice(0, 2).join(' ');
        const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        promises.push(
          sql`
            INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
            VALUES (${email}, ${passwordHash}, ${fullName}, ${createdAt}, ${createdAt})
            RETURNING id, created_at
          `.then(result => result[0])
        );
      }

      const batchResults = await Promise.all(promises);
      allUserIds.push(...batchResults);
      if ((i + batchSize) % 500 === 0) console.log(`   ... ${i + batchSize} users created`);
    }

    console.log(`\n📄 Generating ${TARGET_DOCS} documents...\n`);

    const documentTypes = [
      { name: 'Complaint Letter', description: 'Formal complaint letter' },
      { name: 'Appeal Form', description: 'Appeal documentation' },
      { name: 'Dispute Notice', description: 'Dispute notice letter' },
      { name: 'Bank Statement', description: 'Bank statement with dispute' },
      { name: 'Claim Form', description: 'Official claim form' },
    ];

    let docsCreatedCount = 0;
    let refCounter = 1;

    for (let i = 0; i < TARGET_DOCS; i += 30) {
      const batchSize = Math.min(30, TARGET_DOCS - i);
      const promises = [];

      for (let j = 0; j < batchSize; j++) {
        const user = allUserIds[Math.floor(Math.random() * allUserIds.length)];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        
        const userCreatedAt = new Date(user.created_at);
        const now = new Date();
        const diffMs = now.getTime() - userCreatedAt.getTime();
        const docDate = new Date(userCreatedAt.getTime() + Math.random() * diffMs);
        
        const status = Math.random() > 0.5 ? 'draft' : 'finalized';
        const refNumber = `DOC-${new Date().getFullYear()}-${String(refCounter++).padStart(6, '0')}`;
        const title = `${docType.name} - ${refNumber}`;
        const content = `Generated document for ${docType.name} dated ${docDate.toLocaleDateString('en-GB')}`;

        promises.push(
          sql`
            INSERT INTO documents (user_id, template_id, title, content, status, created_at, updated_at)
            VALUES (${user.id}, ${template.id}, ${title}, ${content}, ${status}, ${docDate}, ${docDate})
          `
        );
      }

      await Promise.all(promises);
      docsCreatedCount += batchSize;
      if (docsCreatedCount % 1000 === 0) console.log(`   ... ${docsCreatedCount} documents created`);
    }

    console.log('\n✨ Data seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Total Users: ${TARGET_USERS}`);
    console.log(`   - Total Documents: ${TARGET_DOCS}`);
    console.log(`   - Real Emails Used: ${tempnowEmails.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   - Avg Documents per User: ${(TARGET_DOCS / TARGET_USERS).toFixed(2)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runSetupAndSeed();
