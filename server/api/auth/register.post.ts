import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  address: z.string().min(3).max(500),
  password: z.string().min(8).max(128),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message || 'Invalid registration data',
    })
  }

  const { name, email, phone, address, password } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()
  const db = useDb()

  const [existing] = await db.query(
    'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
    [normalizedEmail],
  )
  if ((existing as unknown[]).length > 0) {
    throw createError({ statusCode: 409, message: 'An account with this email already exists' })
  }

  const hashed = await hashPassword(password)
  const [result] = await db.query(
    `INSERT INTO users (role, name, email, password, phone, address, status)
     VALUES ('customer', ?, ?, ?, ?, ?, 'Active')`,
    [name.trim(), normalizedEmail, hashed, phone.trim(), address.trim()],
  )

  const insertId = Number((result as { insertId: number }).insertId)
  const sessionUser = toPublicUser({
    id: insertId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'customer',
  })

  setSessionCookie(event, sessionUser)
  return { user: sessionUser }
})
