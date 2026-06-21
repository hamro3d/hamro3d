export default defineNuxtRouteMiddleware(async (to) => {
  await fetchAuthSession()
  const auth = useAuthStore()

  if (!auth.isLoggedIn) {
    const redirect = encodeURIComponent(to.fullPath)
    return navigateTo(`/auth?redirect=${redirect}`)
  }
})
