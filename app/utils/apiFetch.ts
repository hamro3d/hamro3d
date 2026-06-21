type ApiFetchOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

/**
 * Browser-safe API client. Uses native fetch so Nuxt/Vue Router never
 * treats /api/* URLs as app routes (unlike $fetch / ofetch in this stack).
 */
export async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data: { message?: string; statusMessage?: string } & T
  try {
    data = await res.json()
  } catch {
    data = {} as typeof data
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.statusMessage ||
      res.statusText ||
      `Request failed (${res.status})`
    throw new Error(message)
  }

  return data as T
}
