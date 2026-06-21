export default defineNuxtRouteMiddleware(async (to) => {
  await fetchAuthSession()
  const auth = useAuthStore()

  if (!auth.isLoggedIn || !auth.isAdmin) {
    const redirect = encodeURIComponent(to.fullPath)
    return navigateTo(`/auth?redirect=${redirect}`)
  }
})
