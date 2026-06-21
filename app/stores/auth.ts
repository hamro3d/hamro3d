import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const sessionLoaded = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name ?? '')
  const userEmail = computed(() => user.value?.email ?? '')

  const userInitials = computed(() => {
    if (!userName.value) return '?'
    return userName.value
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  function setUser(next: AuthUser | null) {
    user.value = next ? { ...next } : null
  }

  async function fetchSession() {
    await fetchAuthSession()
  }

  async function loginWithCredentials(email: string, password: string) {
    const res = await apiFetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setUser(res.user)
    sessionLoaded.value = true
    return res.user
  }

  async function registerAccount(payload: {
    name: string
    email: string
    phone: string
    address: string
    password: string
  }) {
    const res = await apiFetch<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
    setUser(res.user)
    sessionLoaded.value = true
    return res.user
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
      resetAuthSessionCache()
    }
  }

  return {
    user,
    sessionLoaded,
    isLoggedIn,
    isAdmin,
    userName,
    userEmail,
    userInitials,
    setUser,
    fetchSession,
    loginWithCredentials,
    registerAccount,
    logout,
  }
})
