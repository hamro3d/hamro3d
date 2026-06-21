import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const body = await readBody(event)

  const { name, email, password, role = 'customer', phone = null, address = null, status = 'Active' } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'Name, email, and password are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, phone, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone, address, status]
    ) as [any, any]

    return { id: result.insertId, message: 'User created successfully' }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, message: 'A user with this email already exists' })
    }
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
