export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')

  const [rows] = await db.query(
    `SELECT id, customer_name, customer_email, customer_phone, delivery_address,
            status, payment_method, subtotal, shipping, total, \`lines\`, timeline, created_at
     FROM orders WHERE id = ?`,
    [id]
  ) as [any[], any]

  if (!rows.length) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  return rows[0]
})
