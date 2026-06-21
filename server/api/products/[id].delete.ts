export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')
  await db.query('DELETE FROM products WHERE id = ?', [id])
  return { message: 'Product deleted' }
})
