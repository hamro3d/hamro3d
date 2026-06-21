import { createHmac, timingSafeEqual } from 'node:crypto'
import {
  createError,
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
} from 'h3'
import bcrypt from 'bcryptjs'

export const SESSION_COOKIE = 'h3d_session'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
}

interface SessionPayload extends SessionUser {
  exp: number
}

function sessionSecret(): string {
  const config = useRuntimeConfig()
  const secret = config.sessionSecret as string
  if (!secret || secret.length < 16) {
    throw createError({
      statusCode: 500,
      message: 'Session secret is not configured (set NUXT_SESSION_SECRET)',
    })
  }
  return secret
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    return bcrypt.compare(plain, stored)
  }
  return plain === stored
}

function signToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', sessionSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

function parseToken(token: string): SessionPayload | null {
  const dot = token.indexOf('.')
  if (dot === -1) return null

  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac('sha256', sessionSecret()).update(body).digest('base64url')

  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    if (!payload.id || !payload.email || !payload.role) return null
    return payload
  } catch {
    return null
  }
}

export function setSessionCookie(event: H3Event, user: SessionUser) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const token = signToken({ ...user, exp })
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function getSessionUser(event: H3Event): SessionUser | null {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  const payload = parseToken(token)
  if (!payload) return null
  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  }
}

export async function requireAdmin(event: H3Event): Promise<SessionUser> {
  const user = getSessionUser(event)
  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}

export function toPublicUser(row: {
  id: number
  name: string
  email: string
  role: string
}): SessionUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  }
}
