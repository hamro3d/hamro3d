export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')

  const [rows] = await db.query(
    `SELECT
      p.id, p.\`rank\`, p.head, p.title, p.subtitle, p.price, p.price_note,
      p.images, p.material, p.size, p.status, p.stock,
      p.related_product_ids, p.descriptions, p.processes, p.care,
      c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?`,
    [id]
  ) as [any[], any]

  if (!rows.length) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  const product = rows[0]
  if (product.status !== 'Active') {
    const user = getSessionUser(event)
    if (!user || user.role !== 'admin') {
      throw createError({ statusCode: 404, message: 'Product not found' })
    }
  }

  return product
})
