<template>
  <div class="min-h-screen bg-h3d-base">
    <div class="grid min-h-screen lg:grid-cols-2">
      <!-- Form column -->
      <div
        class="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 xl:px-20"
      >
        <div class="mx-auto w-full max-w-md">
          <p
            v-if="authError"
            class="font-h3d-body mb-6 border border-h3d-error/40 bg-h3d-error/10 px-4 py-3 text-sm text-h3d-error"
            role="alert"
          >
            {{ authError }}
          </p>

          <!-- Mode tabs -->
          <div
            class="flex gap-0 mb-10 border-b border-h3d-border"
            role="tablist"
            aria-label="Authentication mode"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="authMode === 'login'"
              class="font-h3d-body flex-1 py-3 text-2xs font-semibold tracking-widest uppercase transition-colors border-b-2 -mb-px"
              :class="
                authMode === 'login'
                  ? 'border-h3d-accent text-h3d-text'
                  : 'border-transparent text-h3d-muted hover:text-h3d-text'
              "
              @click="authMode = 'login'"
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="authMode === 'signup'"
              class="font-h3d-body flex-1 py-3 text-2xs font-semibold tracking-widest uppercase transition-colors border-b-2 -mb-px"
              :class="
                authMode === 'signup'
                  ? 'border-h3d-accent text-h3d-text'
                  : 'border-transparent text-h3d-muted hover:text-h3d-text'
              "
              @click="authMode = 'signup'"
            >
              Sign Up
            </button>
          </div>

          <!-- Login -->
          <form
            v-show="authMode === 'login'"
            class="space-y-5"
            @submit.prevent="handleLogin"
          >
            <div>
              <label
                for="login-email"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Email
              </label>
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                for="login-password"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Password
              </label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                name="password"
                autocomplete="current-password"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="font-h3d-body w-full bg-h3d-accent px-6 py-3.5 text-2xs font-semibold tracking-widest uppercase text-h3d-base transition-colors hover:bg-h3d-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Signing in…' : 'LOGIN' }}
            </button>

            <div class="relative flex items-center gap-4 py-2">
              <span class="h-px flex-1 bg-h3d-border" aria-hidden="true" />
              <span
                class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Or
              </span>
              <span class="h-px flex-1 bg-h3d-border" aria-hidden="true" />
            </div>

            <button
              type="button"
              class="font-h3d-body flex w-full items-center justify-center gap-2 border border-h3d-border bg-transparent px-6 py-3.5 text-2xs font-semibold tracking-widest uppercase text-h3d-text transition-colors hover:border-h3d-accent hover:text-h3d-accent"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p class="font-h3d-body pt-4 text-center text-sm text-h3d-muted">
              Don't have an account?
              <button
                type="button"
                class="text-h3d-accent underline-offset-4 transition-colors hover:underline"
                @click="authMode = 'signup'"
              >
                Create one
              </button>
            </p>
          </form>

          <!-- Sign up -->
          <form
            v-show="authMode === 'signup'"
            class="space-y-5"
            @submit.prevent="handleSignup"
          >
            <div>
              <label
                for="signup-name"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                v-model="signupForm.name"
                type="text"
                name="name"
                autocomplete="name"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                for="signup-email"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Email
              </label>
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                for="signup-phone"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Phone
              </label>
              <input
                id="signup-phone"
                v-model="signupForm.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="+977 …"
              />
            </div>
            <div>
              <label
                for="signup-address"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Address
              </label>
              <input
                id="signup-address"
                v-model="signupForm.address"
                type="text"
                name="address"
                autocomplete="shipping address-line1"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="City, area — for delivery"
              />
            </div>
            <div>
              <label
                for="signup-password"
                class="font-h3d-body mb-1.5 block text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Password
              </label>
              <input
                id="signup-password"
                v-model="signupForm.password"
                type="password"
                name="password"
                autocomplete="new-password"
                required
                class="font-h3d-body w-full border border-h3d-border bg-h3d-surface px-4 py-3 text-sm text-h3d-text placeholder:text-h3d-muted/60 outline-none transition-colors focus:border-h3d-accent focus:ring-1 focus:ring-h3d-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="font-h3d-body w-full bg-h3d-accent px-6 py-3.5 text-2xs font-semibold tracking-widest uppercase text-h3d-base transition-colors hover:bg-h3d-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Creating account…' : 'Create account' }}
            </button>

            <div class="relative flex items-center gap-4 py-2">
              <span class="h-px flex-1 bg-h3d-border" aria-hidden="true" />
              <span
                class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted"
              >
                Or
              </span>
              <span class="h-px flex-1 bg-h3d-border" aria-hidden="true" />
            </div>

            <button
              type="button"
              class="font-h3d-body flex w-full items-center justify-center gap-2 border border-h3d-border bg-transparent px-6 py-3.5 text-2xs font-semibold tracking-widest uppercase text-h3d-text transition-colors hover:border-h3d-accent hover:text-h3d-accent"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p class="font-h3d-body pt-4 text-center text-sm text-h3d-muted">
              Already have an account?
              <button
                type="button"
                class="text-h3d-accent underline-offset-4 transition-colors hover:underline"
                @click="authMode = 'login'"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>

      <!-- Brand panel -->
      <div
        class="hidden lg:flex flex-col justify-center border-l border-h3d-border bg-h3d-surface px-14 xl:px-20 py-14"
      >
        <template v-if="authMode === 'login'">
          <p
            class="font-h3d-body mb-5 text-2xs font-semibold tracking-[0.2em] text-h3d-accent uppercase"
          >
            WELCOME BACK
          </p>
          <h2
            class="font-h3d-display text-3xl xl:text-4xl font-light text-h3d-text leading-tight mb-6 max-w-md"
          >
            Your memories are waiting for you.
          </h2>
          <p
            class="font-h3d-body text-sm text-h3d-muted leading-relaxed max-w-md mb-12"
          >
            Sign in to revisit saved commissions, track a piece in progress, and
            keep the story of your gift close at hand.
          </p>
          <ol class="space-y-8 max-w-md">
            <li class="flex gap-5">
              <span
                class="font-h3d-display text-h3d-accent text-xl font-light w-8 shrink-0"
              >
                01
              </span>
              <div>
                <p class="font-h3d-body text-sm font-medium text-h3d-text">
                  Emotional authenticity first
                </p>
                <p class="font-h3d-body text-sm text-h3d-muted mt-1 leading-relaxed">
                  Your moments guide the craft — never the other way around.
                </p>
              </div>
            </li>
            <li class="flex gap-5">
              <span
                class="font-h3d-display text-h3d-accent text-xl font-light w-8 shrink-0"
              >
                02
              </span>
              <div>
                <p class="font-h3d-body text-sm font-medium text-h3d-text">
                  Meaning over mere utility
                </p>
                <p class="font-h3d-body text-sm text-h3d-muted mt-1 leading-relaxed">
                  We shape objects meant to be kept, not used up and forgotten.
                </p>
              </div>
            </li>
            <li class="flex gap-5">
              <span
                class="font-h3d-display text-h3d-accent text-xl font-light w-8 shrink-0"
              >
                03
              </span>
              <div>
                <p class="font-h3d-body text-sm font-medium text-h3d-text">
                  Craft without haste
                </p>
                <p class="font-h3d-body text-sm text-h3d-muted mt-1 leading-relaxed">
                  Studio care from Kathmandu — patient hands, intentional
                  detail.
                </p>
              </div>
            </li>
          </ol>
        </template>

        <template v-else>
          <p
            class="font-h3d-body mb-5 text-2xs font-semibold tracking-[0.2em] text-h3d-accent uppercase"
          >
            JOIN HAMRO3D
          </p>
          <h2
            class="font-h3d-display text-3xl xl:text-4xl font-light text-h3d-text leading-tight mb-8 max-w-lg"
          >
            Every account holds a story yet to be made physical.
          </h2>
          <div
            class="border border-h3d-border bg-h3d-base p-8 max-w-lg relative"
          >
            <span
              class="font-h3d-display text-5xl text-h3d-accent/30 absolute top-4 left-5 leading-none"
              aria-hidden="true"
            >
              “
            </span>
            <blockquote
              class="font-h3d-display text-lg xl:text-xl font-light text-h3d-text leading-relaxed italic pl-2 pt-4 relative z-10"
            >
              We turn meaningful human moments into objects you can keep
              forever.
            </blockquote>
            <p
              class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted mt-6"
            >
              Our promise to you
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiFetch } from '~/utils/apiFetch'
import type { AuthUser } from '~/stores/auth'

type AuthMode = 'login' | 'signup'

useSeoMeta({
  title: 'Login — Hamro3D',
  description:
    'Sign in or join Hamro3D to save memories, track commissions, and gift tangible stories crafted in Kathmandu.',
})

const route = useRoute()
const auth = useAuthStore()

const authMode = ref<AuthMode>('login')
const authError = ref('')
const submitting = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const signupForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
})

function apiErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message
  const e = err as { data?: { message?: string }; statusMessage?: string; message?: string }
  return e?.data?.message || e?.statusMessage || e?.message || 'Something went wrong. Please try again.'
}

async function redirectAfterAuth(user: AuthUser) {
  const raw = route.query.redirect
  const redirect = typeof raw === 'string' ? raw : ''

  if (redirect.startsWith('/') && !redirect.startsWith('//')) {
    if (redirect.startsWith('/admin') && user.role !== 'admin') {
      return navigateTo('/profile')
    }
    return navigateTo(redirect)
  }

  if (user.role === 'admin') {
    return navigateTo('/admin')
  }
  return navigateTo('/profile')
}

onMounted(async () => {
  if (!auth.sessionLoaded) {
    await fetchAuthSession()
  }
  if (auth.isLoggedIn && auth.user) {
    await redirectAfterAuth(auth.user)
  }
})

async function handleLogin() {
  authError.value = ''
  submitting.value = true
  try {
    const res = await apiFetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email: loginForm.email, password: loginForm.password },
    })
    auth.setUser(res.user)
    auth.sessionLoaded = true
    await redirectAfterAuth(res.user)
  } catch (err) {
    authError.value = apiErrorMessage(err)
  } finally {
    submitting.value = false
  }
}

async function handleSignup() {
  authError.value = ''
  if (signupForm.password.length < 8) {
    authError.value = 'Password must be at least 8 characters.'
    return
  }
  submitting.value = true
  try {
    const res = await apiFetch<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: { ...signupForm },
    })
    auth.setUser(res.user)
    auth.sessionLoaded = true
    await redirectAfterAuth(res.user)
  } catch (err) {
    authError.value = apiErrorMessage(err)
  } finally {
    submitting.value = false
  }
}
</script>
