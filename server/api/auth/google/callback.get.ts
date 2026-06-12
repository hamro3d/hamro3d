import { getRequestURL, sendRedirect, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const googleClientId = config.public.googleClientId as string
  const googleClientSecret = config.googleClientSecret as string

  if (!googleClientId || !googleClientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Google OAuth configuration is incomplete',
    })
  }

  const requestUrl = getRequestURL(event)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state') || '/profile'

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code is missing',
    })
  }

  const redirectUri = new URL('/api/auth/google/callback', requestUrl.origin).toString()

  try {
    // 1. Exchange auth code for tokens (Google requires form-urlencoded body)
    const tokenRes = await $fetch<{ access_token: string }>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })

    // 2. Fetch user details from Google userinfo API
    const googleUser = await $fetch<{ email: string; name: string }>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenRes.access_token}`,
      },
    })

    if (!googleUser.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to retrieve email from Google',
      })
    }

    const db = useDb()
    
    // 3. Find or create user
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1',
      [googleUser.email]
    ) as [any[], any]

    let user = rows[0]
      ? {
          id: Number(rows[0].id),
          name: String(rows[0].name),
          email: String(rows[0].email),
          role: String(rows[0].role),
        }
      : null
    if (!user) {
      // Create user automatically
      const mockPassword = Math.random().toString(36).slice(-16) + 'Aa1!'
      const hashedPassword = await hashPassword(mockPassword)
      
      const [insertResult] = await db.query(
        'INSERT INTO users (role, name, email, password, status) VALUES (?, ?, ?, ?, ?)',
        ['customer', googleUser.name || 'Google User', googleUser.email, hashedPassword, 'Active']
      ) as [any, any]

      user = {
        id: insertResult.insertId,
        name: googleUser.name || 'Google User',
        email: googleUser.email,
        role: 'customer',
      }
    }

    // 4. Set session cookie
    const sessionUser = toPublicUser(user)
    setSessionCookie(event, sessionUser)

    // 5. Redirect back to client app (only allow same-origin relative paths)
    const redirectTo =
      state.startsWith('/') && !state.startsWith('//') ? state : '/profile'
    return sendRedirect(event, redirectTo, 302)
  } catch (err: any) {
    console.error('Error during Google OAuth callback:', err)
    return sendRedirect(event, `/auth?error=${encodeURIComponent(err?.message || 'Google authentication failed')}`, 302)
  }
})
