import 'server-only'

import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'admin_session'
const DEFAULT_SESSION_SECONDS = 60 * 60 * 8
const REMEMBER_SESSION_SECONDS = 60 * 60 * 24 * 14

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    process.env.JWT_SECRET ||
    'change-this-admin-secret-in-production',
)

export type AdminSession = {
  email: string
  role: 'admin'
}

type AdminValidationResult =
  | { success: true; user: AdminSession }
  | { success: false; error: string }

export async function validateAdminCredentials(
  email: string,
  password: string,
): Promise<AdminValidationResult> {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const configuredPassword = process.env.ADMIN_PASSWORD
  const configuredPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!configuredEmail || (!configuredPassword && !configuredPasswordHash)) {
    return {
      success: false,
      error: 'Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD or ADMIN_PASSWORD_HASH.',
    }
  }

  if (email.trim().toLowerCase() !== configuredEmail) {
    return { success: false, error: 'Invalid email or password' }
  }

  const passwordMatches = configuredPasswordHash
    ? await bcrypt.compare(password, configuredPasswordHash)
    : password === configuredPassword

  if (!passwordMatches) {
    return { success: false, error: 'Invalid email or password' }
  }

  return {
    success: true,
    user: {
      email: configuredEmail,
      role: 'admin',
    },
  }
}

export async function createAdminSession(admin: AdminSession, rememberMe = false) {
  const maxAge = rememberMe ? REMEMBER_SESSION_SECONDS : DEFAULT_SESSION_SECONDS

  const token = await new SignJWT(admin)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(SECRET_KEY)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)

    if (payload.role !== 'admin' || typeof payload.email !== 'string') {
      return null
    }

    return {
      email: payload.email,
      role: 'admin',
    }
  } catch {
    return null
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
