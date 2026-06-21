export default defineEventHandler(async (event) => {
  const db = useDb()
  const body = await readBody(event)

  const { name, slug, description } = body

  if (!name || !slug) {
    throw createError({ statusCode: 400, message: 'Name and slug are required' })
  }

  try {
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || null]
    ) as [any, any]

    return { id: result.insertId, message: 'Category created successfully' }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, message: 'A category with this slug already exists' })
    }
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
