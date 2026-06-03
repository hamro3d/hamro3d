import { getSessionUser } from '../../server/utils/auth'

export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  if (!event) return

  const auth = useAuthStore()
  auth.setUser(getSessionUser(event))
  auth.sessionLoaded = true
})
