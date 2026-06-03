import type { AuthUser } from '~/stores/auth'

let sessionPromise: Promise<void> | null = null

async function requestAuthMe(): Promise<{ user: AuthUser | null }> {
  if (import.meta.server) {
    const event = useRequestEvent()
    if (!event) return { user: null }
    const { getSessionUser } = await import('../../server/utils/auth')
    return { user: getSessionUser(event) }
  }
  return apiFetch<{ user: AuthUser | null }>('/api/auth/me')
}

/** Load the current user from the session cookie (SSR-safe, deduped). */
export async function fetchAuthSession(): Promise<void> {
  const auth = useAuthStore()
  if (auth.sessionLoaded) return

  if (!sessionPromise) {
    sessionPromise = (async () => {
      try {
        const res = await requestAuthMe()
        auth.setUser(res.user)
      } catch {
        auth.setUser(null)
      } finally {
        auth.sessionLoaded = true
      }
    })()
  }

  await sessionPromise
}

export function resetAuthSessionCache() {
  sessionPromise = null
}
