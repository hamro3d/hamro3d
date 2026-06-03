const VALID_STATUSES = ['Awaiting review', 'In craft', 'Shipped', 'Delivered'] as const
type OrderStatus = (typeof VALID_STATUSES)[number]

const STATUS_TIMELINE: Record<OrderStatus, string[]> = {
  'Awaiting review': ['Order Placed', 'Awaiting Review'],
  'In craft': ['Order Placed', 'Payment Confirmed', 'Artisan Assigned', 'Crafting in Progress'],
  'Shipped': ['Order Placed', 'Payment Confirmed', 'Artisan Assigned', 'Crafting Complete', 'Quality Check', 'Shipped'],
  'Delivered': ['Order Placed', 'Payment Confirmed', 'Artisan Assigned', 'Crafting Complete', 'Quality Check', 'Shipped', 'Delivered'],
}

const ALL_STEPS = ['Order Placed', 'Payment Confirmed', 'Artisan Assigned', 'Crafting in Progress', 'Quality Check', 'Shipped', 'Delivered']

export default defineEventHandler(async (event) => {
  const db = useDb()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { status } = body

  if (!status || !VALID_STATUSES.includes(status as OrderStatus)) {
    throw createError({ statusCode: 400, message: `status must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const doneLabels = STATUS_TIMELINE[status as OrderStatus]
  const now = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  const timeline = ALL_STEPS.map((label) => {
    const idx = doneLabels.indexOf(label)
    if (idx === -1) return { label, date: 'Pending', state: 'pending' }
    if (idx === doneLabels.length - 1) return { label, date: now, state: 'active' }
    return { label, date: now, state: 'done' }
  })

  await db.query(
    'UPDATE orders SET status = ?, timeline = ? WHERE id = ?',
    [status, JSON.stringify(timeline), id]
  )

  return { message: 'Order status updated', status, timeline }
})
