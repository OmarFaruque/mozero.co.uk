import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// Human-like title templates - vary by category
const titleTemplates = {
  complaint: [
    'Complaint Letter: Service Quality Issues',
    'Formal Complaint Regarding Service Failure',
    'Customer Complaint - Request for Resolution',
    'Complaint: Inadequate Service Delivery',
    'Complaint Notice - Service Standards Not Met',
    'Service Complaint: Unsatisfactory Experience',
    'Formal Written Complaint',
    'Complaint About Customer Service',
  ],
  appeal: [
    'Appeal for Review and Reconsideration',
    'Request for Appeal of Decision',
    'Appeal Application',
    'Notice of Appeal',
    'Formal Appeal - Request for Review',
    'Administrative Appeal',
    'Appeal Against Decision',
    'Reconsideration Request',
  ],
  dispute: [
    'Dispute Resolution Notice',
    'Notice of Dispute',
    'Dispute Claim Letter',
    'Formal Dispute Notice',
    'Dispute Resolution Request',
    'Notice of Disputed Amount',
    'Transaction Dispute Letter',
    'Dispute of Charges',
  ],
  statement: [
    'Bank Statement Review',
    'Statement of Account - Verification Request',
    'Account Statement Review',
    'Statement Discrepancy Notice',
    'Financial Statement Review',
    'Account Statement Analysis',
    'Bank Statement Inquiry',
    'Statement Correction Request',
  ],
  claim: [
    'Claim for Damages',
    'Insurance Claim',
    'Claim Letter',
    'Formal Claim Notice',
    'Claim for Compensation',
    'Product Liability Claim',
    'Damage Claim Notice',
    'Claim for Reimbursement',
  ],
}

async function updateTitles() {
  try {
    console.log('Fetching all documents...')
    const documents = await sql`SELECT id, title FROM documents ORDER BY id`
    
    console.log(`Updating titles for ${documents.length} documents...`)
    
    // Combine all title templates
    const allTemplates = [
      ...titleTemplates.complaint,
      ...titleTemplates.appeal,
      ...titleTemplates.dispute,
      ...titleTemplates.statement,
      ...titleTemplates.claim,
    ]
    
    let updated = 0
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      
      // Pick random title from combined array
      const newTitle = allTemplates[Math.floor(Math.random() * allTemplates.length)]
      
      await sql`UPDATE documents SET title = ${newTitle} WHERE id = ${doc.id}`
      
      updated++
      if (updated % 500 === 0) {
        console.log(`  Updated ${updated}/${documents.length}...`)
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated} document titles!`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

updateTitles()
