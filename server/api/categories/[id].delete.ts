export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')

  try {
    const [result] = await db.query(
      'DELETE FROM categories WHERE id = ?',
      [id]
    ) as [any, any]

    if (result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    return { message: 'Category deleted successfully' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
