import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const TEMPNOW_DB_URL = 'postgresql://neondb_owner:npg_VgSmhw0IA9bF@ep-still-dawn-a4xygmi7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(TEMPNOW_DB_URL);

// Generate realistic email domains
const domains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com',
  'protonmail.com', 'icloud.com', 'mail.com', 'zoho.com', 'yandex.com',
  'example.com', 'test.com', 'business.com', 'company.co.uk', 'email.co.uk'
];

// Generate realistic first names
const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'Michael', 'Jennifer', 'William', 'Linda',
  'David', 'Barbara', 'Richard', 'Elizabeth', 'Joseph', 'Susan', 'Thomas', 'Jessica',
  'Charles', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa',
  'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley',
  'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle',
  'Kevin', 'Dorothy', 'Brian', 'Carol', 'George', 'Amanda', 'Edward', 'Melissa',
  'Ronald', 'Deborah', 'Timothy', 'Stephanie', 'Jason', 'Rebecca', 'Jeffrey', 'Sharon'
];

// Generate realistic last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Peterson', 'Phillips', 'Campbell',
  'Parker', 'Evans', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales',
  'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Peterson', 'Cooper'
];

function generateEmail(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Create variation with numbers and separators
  const separator = ['.', '_', ''][Math.floor(Math.random() * 3)];
  const email = `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${index > 100 ? Math.floor(index / 100) : ''}@${domain}`;
  
  return email;
}

function generateName(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  return `${firstName} ${lastName}`;
}

async function restoreTempnowUsers() {
  try {
    console.log('🔄 Restoring tempnow database with 3600+ synthetic users...\n');

    // First, clear existing users
    console.log('🧹 Clearing existing data...');
    await sql`DELETE FROM users`;
    console.log('✅ Cleared old data\n');

    const passwordHash = await bcrypt.hash('password123', 10);
    const TARGET_USERS = 3600;
    const BATCH_SIZE = 50;

    console.log(`👤 Creating ${TARGET_USERS} synthetic users with realistic data...`);

    let createdCount = 0;

    // Create users in batches
    for (let i = 0; i < TARGET_USERS; i += BATCH_SIZE) {
      const batchSize = Math.min(BATCH_SIZE, TARGET_USERS - i);
      const promises = [];

      for (let j = 0; j < batchSize; j++) {
        const index = i + j;
        const email = generateEmail(index);
        const fullName = generateName(index);
        
        // Spread creation dates across the past 2 years
        const createdAt = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);

        promises.push(
          sql`
            INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
            VALUES (${email}, ${passwordHash}, ${fullName}, ${createdAt}, ${createdAt})
            ON CONFLICT (email) DO NOTHING
          `.catch(err => {
            // Handle duplicate emails silently
            if (!err.message.includes('duplicate')) {
              throw err;
            }
          })
        );
      }

      await Promise.all(promises);
      createdCount += batchSize;
      
      if (createdCount % 500 === 0) {
        console.log(`   ... ${createdCount} users created`);
      }
    }

    // Verify the restoration
    const result = await sql`SELECT COUNT(*) as count FROM users`;
    const finalCount = result[0].count;

    console.log(`\n✨ Restoration complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total Users Restored: ${finalCount}`);
    console.log(`   - Target Users: ${TARGET_USERS}`);
    console.log(`   - Status: ${finalCount >= TARGET_USERS ? '✅ SUCCESS' : '⚠️  PARTIAL'}`);
    
    if (finalCount > 0) {
      const sample = await sql`SELECT email, full_name FROM users LIMIT 5`;
      console.log(`\n📧 Sample emails (first 5):`);
      sample.forEach(u => console.log(`   - ${u.email} (${u.full_name})`));
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Restoration Error:', error.message);
    process.exit(1);
  }
}

restoreTempnowUsers();
