export default defineEventHandler(async (event) => {
  const path = event.path

  if (!path.startsWith('/api/')) return
  if (path.startsWith('/api/upload')) return
  if (path.startsWith('/api/auth')) return
  if (path.startsWith('/api/categories')) {
    if (event.method !== 'GET') {
      await requireAdmin(event)
    }
    return
  }

  if (path.startsWith('/api/products')) {
    if (event.method !== 'GET') {
      await requireAdmin(event)
    } else {
      const query = getQuery(event)
      const status = String(query.status || '')
      if (status.includes('Draft') || status.includes('Archived')) {
        await requireAdmin(event)
      }
    }
    return
  }

  if (path.startsWith('/api/users')) {
    await requireAdmin(event)
    return
  }

  if (path.startsWith('/api/orders') && event.method !== 'POST') {
    await requireAdmin(event)
  }
})
