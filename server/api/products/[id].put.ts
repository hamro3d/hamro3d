export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const {
    rank, head, title, subtitle, descriptions, processes, care,
    price, price_note, images, material, size, status, stock,
    related_product_ids, category_id,
  } = body

  // Build dynamic SET clause
  const fields: string[] = []
  const values: any[] = []

  if (rank !== undefined)              { fields.push('`rank` = ?');              values.push(rank) }
  if (head !== undefined)              { fields.push('head = ?');               values.push(head) }
  if (title !== undefined)             { fields.push('title = ?');              values.push(title) }
  if (subtitle !== undefined)          { fields.push('subtitle = ?');           values.push(subtitle) }
  if (descriptions !== undefined)      { fields.push('descriptions = ?');       values.push(JSON.stringify(descriptions)) }
  if (processes !== undefined)         { fields.push('processes = ?');          values.push(JSON.stringify(processes)) }
  if (care !== undefined)              { fields.push('care = ?');               values.push(JSON.stringify(care)) }
  if (price !== undefined)             { fields.push('price = ?');              values.push(price) }
  if (price_note !== undefined)        { fields.push('price_note = ?');         values.push(price_note) }
  if (images !== undefined)            { fields.push('images = ?');             values.push(JSON.stringify(images)) }
  if (material !== undefined)          { fields.push('material = ?');           values.push(JSON.stringify(material)) }
  if (size !== undefined)              { fields.push('size = ?');               values.push(JSON.stringify(size)) }
  if (status !== undefined)            { fields.push('status = ?');             values.push(status) }
  if (stock !== undefined)             { fields.push('stock = ?');              values.push(stock) }
  if (related_product_ids !== undefined){ fields.push('related_product_ids = ?'); values.push(JSON.stringify(related_product_ids)) }
  if (category_id !== undefined)     { fields.push('category_id = ?');      values.push(category_id) }

  if (!fields.length) {
    throw createError({ statusCode: 400, message: 'No fields to update' })
  }

  values.push(id)
  await db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values)

  return { message: 'Product updated' }
})
