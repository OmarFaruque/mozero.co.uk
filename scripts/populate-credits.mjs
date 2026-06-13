import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function populateUserCredits() {
  try {
    console.log('📊 Populating user_credits table with realistic data...\n')

    // Get all users
    const users = await sql`SELECT id, created_at FROM users ORDER BY created_at`
    console.log(`Found ${users.length} users`)

    // Clear existing credits
    await sql`DELETE FROM user_credits`
    console.log('Cleared existing user_credits\n')

    // Populate credits in batches
    const batchSize = 100
    let processedCount = 0

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const promises = []

      for (const user of batch) {
        // Realistic credit distribution
        const creditsAvailable = Math.floor(Math.random() * 500) + 50 // 50-550 credits
        const creditsUsed = Math.floor(creditsAvailable * Math.random() * 0.7) // 0-70% used
        const updatedAt = new Date(user.created_at)

        promises.push(
          sql`
            INSERT INTO user_credits (user_id, credits_available, credits_used, updated_at)
            VALUES (${user.id}, ${creditsAvailable}, ${creditsUsed}, ${updatedAt})
          `
        )
      }

      await Promise.all(promises)
      processedCount += batch.length
      console.log(`✓ Processed ${processedCount}/${users.length} users`)
    }

    // Verify results
    const stats = await sql`
      SELECT 
        COUNT(*) as total_records,
        AVG(credits_available) as avg_available,
        AVG(credits_used) as avg_used,
        SUM(credits_available) as total_available,
        SUM(credits_used) as total_used
      FROM user_credits
    `

    console.log('\n✅ User Credits Population Complete!')
    console.log('\n📈 Statistics:')
    console.log(`   Total Records: ${stats[0].total_records}`)
    console.log(`   Avg Credits Available: ${parseFloat(stats[0].avg_available).toFixed(2)}`)
    console.log(`   Avg Credits Used: ${parseFloat(stats[0].avg_used).toFixed(2)}`)
    console.log(`   Total Credits Available: ${stats[0].total_available}`)
    console.log(`   Total Credits Used: ${stats[0].total_used}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

populateUserCredits()
