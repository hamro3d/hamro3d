import { getSessionUser } from '../../server/utils/auth'

export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  if (!event) return

  const sessionUser = getSessionUser(event)
  const auth = useAuthStore()
  auth.setUser(sessionUser ? { ...sessionUser } : null)
  auth.sessionLoaded = true
})
