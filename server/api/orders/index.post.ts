export default defineEventHandler(async (event) => {
  const db = useDb()
  const body = await readBody(event)

  const {
    customer_name, customer_email, customer_phone,
    delivery_address, payment_method, lines, shipping = 200,
  } = body

  if (!customer_name || !customer_email || !customer_phone || !delivery_address || !payment_method || !lines?.length) {
    throw createError({ statusCode: 400, message: 'Missing required order fields' })
  }

  // Map lines defensively to support multiple formats
  const parsedLines = lines.map((l: any) => {
    const qty = Number(l.quantity ?? l.qty ?? 1)
    const unitPrice = Number(l.unit_price ?? l.unitPrice ?? 0)
    return {
      product_id: l.product_id,
      name: l.name,
      meta: l.variant ?? l.meta ?? '',
      qty,
      unitPrice,
      lineTotal: qty * unitPrice,
    }
  })

  // Calculate totals server-side
  const subtotal = parsedLines.reduce((s: number, l: any) => s + l.lineTotal, 0)
  const total = subtotal + shipping

  // Generate order ID
  const orderId = `H3D-${Date.now().toString().slice(-8)}`

  const now = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeline = [
    { label: 'Order Placed', date: now, state: 'done' },
    { label: 'Payment Confirmed', date: 'Awaiting confirmation', state: 'active' },
    { label: 'Artisan Assigned', date: 'Pending', state: 'pending' },
    { label: 'Crafting in Progress', date: 'Pending', state: 'pending' },
    { label: 'Quality Check', date: 'Pending', state: 'pending' },
    { label: 'Shipped', date: 'Pending', state: 'pending' },
    { label: 'Delivered', date: 'Pending', state: 'pending' },
  ]

  await db.query(
    `INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, status, payment_method, subtotal, shipping, total, \`lines\`, timeline)
     VALUES (?, ?, ?, ?, ?, 'Awaiting review', ?, ?, ?, ?, ?, ?)`,
    [
      orderId, customer_name, customer_email, customer_phone, delivery_address,
      payment_method, subtotal, shipping, total,
      JSON.stringify(parsedLines), JSON.stringify(timeline),
    ]
  )

  return { id: orderId, total, message: 'Order placed successfully' }
})
