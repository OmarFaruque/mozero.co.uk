import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL
const sql = neon(DATABASE_URL)

// Realistic data generators
const generators = {
  orderNumber: () => `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
  orderDate: () => {
    const days = Math.floor(Math.random() * 180) + 30
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  },
  itemDescription: () => {
    const items = [
      'Electronic Laptop Computer',
      'Wireless Bluetooth Headphones',
      'USB-C Fast Charging Cable',
      'Mobile Phone Case Cover',
      'Smart Watch Device',
      'Portable Power Bank',
      'Mechanical Gaming Keyboard',
      '4K Webcam with Microphone',
      'Desk Lamp LED Light',
      'Phone Screen Protector',
      'Wireless Mouse Device',
      'USB Hub Adapter',
      'Camera Tripod Stand',
      'Phone Car Mount Holder',
      'Laptop Cooling Pad'
    ]
    return items[Math.floor(Math.random() * items.length)]
  },
  productName: () => generators.itemDescription(),
  amount: () => `£${(Math.floor(Math.random() * 90) + 10) * 10}`,
  trackingNumber: () => {
    const carriers = ['TRK', 'PKG', 'SHP', 'DLV']
    const carrier = carriers[Math.floor(Math.random() * carriers.length)]
    return `${carrier}${Math.floor(Math.random() * 9000000) + 1000000}`
  },
  expectedDelivery: () => {
    const days = Math.floor(Math.random() * 14) + 1
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  },
  discoveryDate: () => {
    const days = Math.floor(Math.random() * 90) + 1
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  },
  contactAttempts: () => {
    const attempts = [
      'Called customer service on 15/03/2026 at 10:30 AM, waited 45 minutes but was disconnected. No callback provided.',
      'Sent email to support@company.com on 14/03/2026. No response received after 7 days.',
      'Attempted to contact via live chat on 13/03/2026. Chat support was unavailable.',
      'Called again on 16/03/2026 and was told the item is out of stock and replacement cannot be arranged.',
      'Multiple attempts to reach support have been unsuccessful. Last contact was on 18/03/2026.'
    ]
    return attempts[Math.floor(Math.random() * attempts.length)]
  },
  faultDescription: () => {
    const faults = [
      'The device stopped working after 2 weeks. Screen is completely black and does not respond to any button presses.',
      'Severe damage to the outer casing with visible cracks. The device still powers on but is unusable due to structural damage.',
      'Battery drains completely within 30 minutes despite being fully charged. No improvement after factory reset.',
      'The product arrived with visible water damage and does not turn on at all.',
      'All buttons are stuck and non-functional. The device appears to have manufacturing defect.'
    ]
    return faults[Math.floor(Math.random() * faults.length)]
  },
  photos: () => Math.random() > 0.3 ? 'Yes' : 'No',
  remedy: () => {
    const remedies = ['Full Refund', 'Replacement', 'Partial Refund']
    return remedies[Math.floor(Math.random() * remedies.length)]
  },
  compensationAmount: () => `£${Math.floor(Math.random() * 50) + 10}`,
  businessName: () => {
    const names = [
      'Tech Solutions Ltd',
      'Digital Services Inc',
      'E-Commerce Retail',
      'Online Trading Co',
      'Digital Market Ltd'
    ]
    return names[Math.floor(Math.random() * names.length)]
  },
  accountNumber: () => {
    return Math.floor(Math.random() * 90000000) + 10000000
  },
  employeeId: () => `EMP${Math.floor(Math.random() * 99999) + 10000}`,
  claimReason: () => {
    const reasons = [
      'Product quality was significantly below the advertised standard',
      'Service not delivered as promised in the contract',
      'Multiple failed delivery attempts with no resolution',
      'Overcharge for services rendered'
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }
}

async function populateUserInputs() {
  try {
    console.log('Fetching all documents with templates...')
    const documents = await sql`
      SELECT d.id, d.template_id, t.questions
      FROM documents d
      JOIN templates t ON d.template_id = t.id
      ORDER BY d.id
    `

    console.log(`Populating user_inputs for ${documents.length} documents...\n`)

    let updated = 0
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      const questions = doc.questions || []

      // Generate answers for each question
      const userInputs = {}
      questions.forEach(question => {
        let value = 'N/A'
        
        // Try to find a matching generator
        const gen = generators[question.id]
        if (gen) {
          value = gen()
        } else if (generators[question.label?.toLowerCase()?.replace(/\s+/g, '_')]) {
          value = generators[question.label?.toLowerCase()?.replace(/\s+/g, '_')]()
        } else if (question.type === 'date') {
          // For date fields, generate a random date
          const days = Math.floor(Math.random() * 365)
          const date = new Date()
          date.setDate(date.getDate() - days)
          value = date.toISOString().split('T')[0]
        } else if (question.type === 'select' && question.options && question.options.length > 0) {
          // Pick random option
          value = question.options[Math.floor(Math.random() * question.options.length)]
        } else if (question.type === 'textarea') {
          // Generate realistic text response
          const responses = [
            'Multiple attempts made to resolve this matter. All efforts have been unsuccessful.',
            'Extensive documentation available to support this claim. Full evidence provided.',
            'Previous contact attempts have been unsuccessful. Current action is required.',
            'Detailed records maintained throughout this process. All supporting documents included.',
            'Initial attempts to resolve made without success. Further action necessary.'
          ]
          value = responses[Math.floor(Math.random() * responses.length)]
        } else if (question.type === 'text') {
          // Generate a generic but realistic value based on label
          if (question.label?.includes('Amount') || question.label?.includes('Price')) {
            value = `£${(Math.floor(Math.random() * 90) + 10) * 10}`
          } else if (question.label?.includes('Email')) {
            value = `customer.${Math.floor(Math.random() * 10000)}@email.com`
          } else if (question.label?.includes('Phone')) {
            value = `${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900000) + 100000}`
          } else if (question.label?.includes('Name')) {
            const names = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'David Lee']
            value = names[Math.floor(Math.random() * names.length)]
          } else if (question.label?.includes('Number')) {
            value = String(Math.floor(Math.random() * 9000000) + 1000000)
          } else {
            value = `Sample entry for ${question.label}`
          }
        }
        
        userInputs[question.id] = value
      })

      // Update document with user inputs
      await sql`
        UPDATE documents 
        SET user_inputs = ${JSON.stringify(userInputs)}
        WHERE id = ${doc.id}
      `

      updated++
      if (updated % 500 === 0) {
        console.log(`   Updated ${updated}/${documents.length}...`)
      }
    }

    console.log(`\n✅ Successfully populated user_inputs for ${updated} documents!`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

populateUserInputs()
