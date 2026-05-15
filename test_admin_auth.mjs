import { validateAdminCredentials } from './lib/admin-auth.js'

async function test() {
  try {
    const result = await validateAdminCredentials('test@example.com', 'password')
    console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

test()
