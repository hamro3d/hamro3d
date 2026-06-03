export default defineEventHandler(async (event) => {
  const user = getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized. Please sign in.' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Order ID is required' })
  }

  const db = useDb()
  const [rows] = await db.query(
    `SELECT id, customer_name, customer_email, customer_phone, delivery_address,
            status, payment_method, subtotal, shipping, total, \`lines\`, timeline, created_at
     FROM orders WHERE id = ? LIMIT 1`,
    [id]
  ) as [any[], any]

  const order = rows[0]
  if (!order) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  // Ensure customer can only access their own orders. Admins can view anything.
  if (order.customer_email !== user.email && user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden. You do not have access to this order.' })
  }

  return order
})
