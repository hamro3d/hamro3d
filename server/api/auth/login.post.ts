export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password required' })
  }

  const db = useDb()
  const [rows] = await db.query(
    'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
    [email]
  ) as [any[], any]

  const user = rows[0]
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const ok = await verifyPassword(password, user.password)
  if (!ok) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const sessionUser = toPublicUser(user)
  setSessionCookie(event, sessionUser)

  return { user: sessionUser }
})
