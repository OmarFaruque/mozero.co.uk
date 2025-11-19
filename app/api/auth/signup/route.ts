import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    
    const result = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName || null})
      RETURNING id, email
    `

    const user = result[0]

    // Initialize user credits with 3 free credits
    await sql`
      INSERT INTO user_credits (user_id, credits_available, credits_used)
      VALUES (${user.id}, 3, 0)
    `

    // Create session
    await createSession(user.id, user.email)

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
