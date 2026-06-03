export default defineEventHandler(async (event) => {
  const db = useDb()
  const query = getQuery(event)

  const limit = query.limit ? Number(query.limit) : null
  const sortBy = String(query.sort || 'featured')
  const categoryId = query.category ? Number(query.category) : null
  const statusParam = String(query.status || 'Active')

  // Support comma‑separated statuses
  const statusList = statusParam.split(',').map(s => s.trim()).filter(Boolean)

  let sql = `
    SELECT
      p.id, p.\`rank\`, p.head, p.title, p.subtitle, p.price, p.price_note,
      p.images, p.material, p.size, p.status, p.stock,
      p.related_product_ids, p.descriptions, p.processes, p.care,
      c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status IN (${statusList.map(() => '?').join(',')})
  `
  const params: (string | number)[] = [...statusList]

  if (categoryId) {
    sql += ' AND p.category_id = ?'
    params.push(categoryId)
  }

  switch (sortBy) {
    case 'featured':
      sql += ' ORDER BY p.`rank` ASC'
      break
    case 'name':
      sql += ' ORDER BY p.title ASC'
      break
    case 'price-low':
      sql += ' ORDER BY p.price ASC'
      break
    case 'price-high':
      sql += ' ORDER BY p.price DESC'
      break
    default:
      sql += ' ORDER BY p.`rank` ASC'
  }

  if (limit) {
    sql += ' LIMIT ?'
    params.push(limit)
  }

  const [rows] = await db.query(sql, params)
  return rows
})
