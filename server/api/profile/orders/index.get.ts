export default defineEventHandler(async (event) => {
  const user = getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized. Please sign in.' })
  }

  const db = useDb()
  const [rows] = await db.query(
    `SELECT id, customer_name, customer_email, delivery_address, status,
            payment_method, subtotal, shipping, total, \`lines\`, created_at
     FROM orders WHERE customer_email = ? ORDER BY created_at DESC`,
    [user.email]
  )

  return rows
})
