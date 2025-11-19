import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const users = await sql`
      SELECT id, email, password_hash FROM users
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    await createSession(user.id, user.email, rememberMe)

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    )
  }
}
