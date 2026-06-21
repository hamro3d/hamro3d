export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  return { user }
})
