export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { name, slug, description } = body

  if (!name || !slug) {
    throw createError({ statusCode: 400, message: 'Name and slug are required' })
  }

  try {
    const [result] = await db.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description || null, id]
    ) as [any, any]

    if (result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    return { message: 'Category updated successfully' }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, message: 'A category with this slug already exists' })
    }
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
