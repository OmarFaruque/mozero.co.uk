import { neon } from '@neondatabase/serverless';

async function verify() {
  const DATABASE_URL = 'postgresql://neondb_owner:npg_bKvW4ilex6Mz@ep-damp-morning-anbdgjyc-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  const sql = neon(DATABASE_URL);
  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables found:', result.map(r => r.table_name));
    
    if (result.length > 0) {
        const userCount = await sql`SELECT COUNT(*) FROM users`.catch(() => [{count: 'error'}]);
        console.log('User count:', userCount[0].count);
    }
  } catch (e) {
    console.error('Verification failed:', e.message);
  }
}
verify();
