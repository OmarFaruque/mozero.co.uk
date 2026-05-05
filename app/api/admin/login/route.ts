import { NextResponse } from 'next/server'
import { createAdminSession, validateAdminCredentials } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json()

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
