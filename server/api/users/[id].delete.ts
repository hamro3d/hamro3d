export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')

  try {
    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    ) as [any, any]

    if (result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return { message: 'User deleted successfully' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})
