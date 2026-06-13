import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL_3
const sql = neon(DATABASE_URL)

async function populateUserCredits() {
  try {
    console.log('📊 Populating user_credits table...\n')

    // Get all users
    const users = await sql`
      SELECT id FROM users ORDER BY id
    `

    console.log(`Found ${users.length} users. Generating credit data...`)

    // Delete existing credits
    await sql`DELETE FROM user_credits`
    console.log('✅ Cleared existing credits\n')

    let insertedCount = 0
    const batchSize = 50

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const promises = []

      for (const user of batch) {
        // Generate realistic credit distribution
        const creditsAvailable = Math.floor(Math.random() * 100) + 10 // 10-110 credits
        const creditsUsed = Math.floor(Math.random() * creditsAvailable * 0.7) // 0-70% of available used
        const now = new Date()

        promises.push(
          sql`
            INSERT INTO user_credits (user_id, credits_available, credits_used, updated_at)
            VALUES (${user.id}, ${creditsAvailable}, ${creditsUsed}, ${now})
          `
        )
      }

      await Promise.all(promises)
      insertedCount += batch.length

      if (insertedCount % 500 === 0) {
        console.log(`   ... ${insertedCount} users credited`)
      }
    }

    // Verify
    const result = await sql`
      SELECT 
        COUNT(*) as total_records,
        AVG(credits_available) as avg_credits,
        AVG(credits_used) as avg_used,
        MAX(credits_available) as max_credits
      FROM user_credits
    `

    console.log('\n✅ User Credits Populated Successfully!')
    console.log(`   Total Records: ${result[0].total_records}`)
    console.log(`   Avg Credits Available: ${parseFloat(result[0].avg_credits).toFixed(2)}`)
    console.log(`   Avg Credits Used: ${parseFloat(result[0].avg_used).toFixed(2)}`)
    console.log(`   Max Credits: ${result[0].max_credits}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

populateUserCredits()
