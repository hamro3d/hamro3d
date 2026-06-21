export default defineEventHandler(async () => {
  const db = useDb()

  // Orders list
  const [orders] = await db.query(
    `SELECT id, customer_name, customer_email, delivery_address, status,
            payment_method, subtotal, shipping, total, \`lines\`, created_at
     FROM orders ORDER BY created_at DESC`
  )

  // Stats aggregates
  const [[stats]] = await db.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(total) AS total_revenue,
       SUM(CASE WHEN status != 'Delivered' THEN 1 ELSE 0 END) AS active_orders
     FROM orders`
  ) as [any[], any]

  // Product count
  const [[pCount]] = await db.query(
    'SELECT COUNT(*) AS total_products FROM products WHERE status = "Active"'
  ) as [any[], any]

  // User count
  const [[uCount]] = await db.query(
    'SELECT COUNT(*) AS total_users FROM users'
  ) as [any[], any]

  return {
    orders,
    stats: {
      totalRevenue: Number(stats.total_revenue || 0),
      totalOrders: Number(stats.total_orders || 0),
      activeOrders: Number(stats.active_orders || 0),
      totalProducts: Number(pCount.total_products || 0),
      totalUsers: Number(uCount.total_users || 0),
    },
  }
})
