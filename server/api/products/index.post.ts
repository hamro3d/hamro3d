export default defineEventHandler(async (event) => {
  const db = useDb()
  const body = await readBody(event)

  const {
    rank = 10, head, title, subtitle = '', descriptions = [], processes = [],
    care = [], price, price_note = '', images = [], material = ['PLA'],
    size = { unit: 'cm', value: [] }, status = 'Active', stock = 0,
    related_product_ids = [], category_id = null,
  } = body

  if (!head || !title || !price) {
    throw createError({ statusCode: 400, message: 'head, title, and price are required' })
  }

  const [result] = await db.query(
    `INSERT INTO products (\`rank\`, head, title, subtitle, descriptions, processes, care, price, price_note, images, material, size, status, stock, related_product_ids, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rank, head, title, subtitle,
      JSON.stringify(descriptions), JSON.stringify(processes), JSON.stringify(care),
      price, price_note, JSON.stringify(images), JSON.stringify(material),
      JSON.stringify(size), status, stock, JSON.stringify(related_product_ids), category_id,
    ]
  ) as [any, any]

  return { id: result.insertId, message: 'Product created' }
})
