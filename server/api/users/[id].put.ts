import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { name, email, password, role, phone, address, status } = body

  if (!name || !email) {
    throw createError({ statusCode: 400, message: 'Name and email are required' })
  }

  try {
    let result: any
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const [res] = await db.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ?, phone = ?, address = ?, status = ? WHERE id = ?',
        [name, email, hashedPassword, role || 'customer', phone || null, address || null, status || 'Active', id]
      ) as [any, any]
      result = res
    } else {
      const [res] = await db.query(
        'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ?, status = ? WHERE id = ?',
        [name, email, role || 'customer', phone || null, address || null, status || 'Active', id]
      ) as [any, any]
      result = res
    }

    if (result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return { message: 'User updated successfully' }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, message: 'A user with this email already exists' })
    }
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
