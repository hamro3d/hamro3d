import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userName = ref('Aarav Sharma')
  const userEmail = ref('aarav@example.com')

  const userInitials = computed(() => {
    if (!userName.value) return '?'
    return userName.value
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  function login(name: string, email: string) {
    userName.value = name
    userEmail.value = email
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
  }

  return { isLoggedIn, userName, userEmail, userInitials, login, logout }
})
