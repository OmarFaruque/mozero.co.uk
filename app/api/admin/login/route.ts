import { NextResponse } from 'next/server'
import { createAdminSession, validateAdminCredentials } from '@/lib/admin-auth'

export async function GET() {
  return NextResponse.json({ message: 'Admin login API is working' })
}

export async function POST(request: Request) {
  try {
    console.log('Admin login attempt received')
    
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { success: false, error: 'Database configuration is missing' },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { email, password, rememberMe } = body
    console.log('Login request for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      )
    }

    const result = await validateAdminCredentials(email, password)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error.includes('not configured') ? 503 : 401 },
      )
    }

    await createAdminSession(result.user, Boolean(rememberMe))

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sign in' },
      { status: 500 },
    )
  }
}
