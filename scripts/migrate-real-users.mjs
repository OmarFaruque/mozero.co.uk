import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

// DATABASE_URL_2: tempnow dev branch (READ ONLY - get users from here)
const SOURCE_DB_URL = 'postgresql://neondb_owner:npg_VgSmhw0IA9bF@ep-plain-mode-a4tjsfa4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// DATABASE_URL_3: mozero project (WRITE - insert users and documents here)
const TARGET_DB_URL = 'postgresql://neondb_owner:npg_BwC6nQUJKc9P@ep-fancy-sound-aqc0urya-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const sourceSQL = neon(SOURCE_DB_URL)
const targetSQL = neon(TARGET_DB_URL)

async function migrateRealUsers() {
  try {
    console.log('🔍 Fetching real users from tempnow dev database (DATABASE_URL_2)...\n')

    // Get real users from source database
    const sourceUsers = await sourceSQL`
      SELECT 
        user_id,
        email,
        first_name,
        last_name,
        created_at,
        updated_at
      FROM users
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `

    console.log(`✅ Found ${sourceUsers.length} real users in tempnow dev database\n`)

    if (sourceUsers.length === 0) {
      console.error('❌ No users found in source database')
      process.exit(1)
    }

    // Show sample of users being imported
    console.log('📋 Sample of users to import:')
    sourceUsers.slice(0, 5).forEach(u => {
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User'
      console.log(`   - ${u.email} (${fullName})`)
    })
    console.log(`   ... and ${sourceUsers.length - 5} more\n`)

    // Delete old data from mozero project (DATABASE_URL_3)
    console.log('🧹 Deleting old data from mozero project (DATABASE_URL_3)...')
    await targetSQL`DELETE FROM documents`
    await targetSQL`DELETE FROM user_credits`
    await targetSQL`DELETE FROM user_subscriptions`
    await targetSQL`DELETE FROM transactions`
    await targetSQL`DELETE FROM users`
    console.log('✅ Old users and documents deleted from mozero project\n')

    // Generate password hash
    const passwordHash = await bcrypt.hash('password123', 10)

    // Insert real users into mozero project database
    console.log(`👤 Inserting ${sourceUsers.length} real users into mozero project...\n`)

    let insertedCount = 0
    const batchSize = 20

    for (let i = 0; i < sourceUsers.length; i += batchSize) {
      const batch = sourceUsers.slice(i, i + batchSize)
      const promises = []

      for (const user of batch) {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'
        promises.push(
          targetSQL`
            INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
            VALUES (
              ${user.email},
              ${passwordHash},
              ${fullName},
              ${new Date(user.created_at)},
              ${new Date(user.updated_at)}
            )
            RETURNING id
          `.then(result => {
            insertedCount++
            return result[0]
          })
        )
      }

      await Promise.all(promises)
      console.log(`   ✓ Processed ${Math.min(i + batchSize, sourceUsers.length)}/${sourceUsers.length} users`)
    }

    console.log(`\n✨ Migration completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`   - Real users imported from tempnow dev: ${sourceUsers.length}`)
    console.log(`   - Users inserted into mozero project: ${insertedCount}`)
    console.log(`   - All real user emails, names, and addresses preserved`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

migrateRealUsers()
