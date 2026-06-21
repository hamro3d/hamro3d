import { getRequestURL, sendRedirect, createError } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const googleClientId = config.public.googleClientId as string

  if (!googleClientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Google Client ID is not configured',
    })
  }

  const requestUrl = getRequestURL(event)
  const redirectTarget = requestUrl.searchParams.get('redirect') || '/profile'
  const redirectUri = new URL('/api/auth/google/callback', requestUrl.origin).toString()

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', googleClientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', redirectTarget)
  googleAuthUrl.searchParams.set('prompt', 'select_account')

  return sendRedirect(event, googleAuthUrl.toString(), 302)
})
