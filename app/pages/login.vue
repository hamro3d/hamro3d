<template>
  <div class="flex h-screen items-center justify-center bg-h3d-surface">
    <div class="w-full max-w-md rounded-lg border border-h3d-border bg-h3d-base p-8 shadow-lg">
      <h2 class="mb-6 text-center font-h3d-display text-2xl font-light text-h3d-text">Admin Login</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block font-h3d-body text-2xs uppercase text-h3d-muted" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            required
            class="mt-1 w-full rounded border border-h3d-border bg-h3d-surface px-3 py-2.5 text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
          />
        </div>
        <div>
          <label class="block font-h3d-body text-2xs uppercase text-h3d-muted" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            class="mt-1 w-full rounded border border-h3d-border bg-h3d-surface px-3 py-2.5 text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
          />
        </div>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-h3d-base border-t-transparent" />
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'

const router = useRouter()
const email = ref('admin@gmail.com')
const password = ref('admin')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    if (res?.success) {
      // redirect to admin dashboard
      await router.push('/admin')
    } else {
      error.value = 'Login failed'
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Login error'
  } finally {
    loading.value = false
  }
}
</script>
