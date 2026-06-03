export default defineEventHandler(async () => {
  const db = useDb()

  const [rows] = await db.query(
    `SELECT
       u.id, u.name, u.email, u.phone, u.role, u.status,
       u.created_at,
       COUNT(o.id) AS order_count
     FROM users u
     LEFT JOIN orders o ON o.customer_email = u.email
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  )

  return rows
})
