export default defineEventHandler(async () => {
  const db = useDb()
  const [rows] = await db.query('SELECT id, name, slug, description FROM categories ORDER BY name ASC')
  return rows
})
