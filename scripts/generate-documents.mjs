import { neon } from '@neondatabase/serverless'

// DATABASE_URL_3: mozero project
const TARGET_DB_URL = 'postgresql://neondb_owner:npg_BwC6nQUJKc9P@ep-fancy-sound-aqc0urya-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const targetSQL = neon(TARGET_DB_URL)

async function generateDocuments() {
  try {
    console.log('📊 Generating documents for real users in mozero project...\n')

    // Get all users
    const users = await targetSQL`SELECT id, email, created_at FROM users ORDER BY created_at DESC`
    console.log(`Found ${users.length} users\n`)

    // Get available templates
    const templates = await targetSQL`SELECT id, name FROM templates WHERE is_active = true`
    if (templates.length === 0) {
      console.error('❌ No templates found')
      process.exit(1)
    }
    console.log(`Found ${templates.length} active templates\n`)

    const TARGET_DOCS = 8264
    const docsPerUser = Math.ceil(TARGET_DOCS / users.length)

    console.log(`📄 Generating ~${docsPerUser} documents per user (total: ${TARGET_DOCS})...\n`)

    const statuses = ['draft', 'finalized', 'draft', 'finalized', 'finalized', 'finalized', 'finalized', 'finalized', 'draft', 'draft']
    let docCount = 0
    let refCounter = 1

    // Generate documents
    for (let i = 0; i < users.length && docCount < TARGET_DOCS; i += 20) {
      const batch = users.slice(i, i + 20)
      const promises = []

      for (const user of batch) {
        const docsToCreate = Math.min(docsPerUser, TARGET_DOCS - docCount)
        
        for (let d = 0; d < docsToCreate && docCount < TARGET_DOCS; d++) {
          const template = templates[Math.floor(Math.random() * templates.length)]
          const userCreatedAt = new Date(user.created_at)
          const now = new Date()
          const diffMs = now.getTime() - userCreatedAt.getTime()
          const docDate = new Date(userCreatedAt.getTime() + Math.random() * diffMs)
          
          const status = statuses[Math.floor(Math.random() * statuses.length)]
          const refNumber = `DOC-${new Date().getFullYear()}-${String(refCounter++).padStart(6, '0')}`
          const title = `Document ${refNumber} - ${template.name}`
          const content = `Generated ${template.name} document for ${user.email} dated ${docDate.toLocaleDateString('en-GB')}`

          promises.push(
            targetSQL`
              INSERT INTO documents (user_id, template_id, title, content, status, created_at, updated_at)
              VALUES (${user.id}, ${template.id}, ${title}, ${content}, ${status}, ${docDate}, ${docDate})
            `
          )
          
          docCount++
        }
      }

      if (promises.length > 0) {
        await Promise.all(promises)
      }
      
      if (docCount % 1000 === 0) {
        console.log(`   ✓ Created ${docCount} documents`)
      }
    }

    console.log(`\n✨ Document generation completed!`)
    console.log(`📊 Final Summary:`)
    console.log(`   - Real users: ${users.length}`)
    console.log(`   - Documents created: ${docCount}`)
    console.log(`   - Avg docs per user: ${(docCount / users.length).toFixed(2)}`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Document generation failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

generateDocuments()
