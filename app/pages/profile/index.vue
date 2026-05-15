<script setup lang="ts">
definePageMeta({
  layout: 'profile',
})

useSeoMeta({
  title: 'Your Profile — Hamro3D',
  description:
    'Manage your details, delivery addresses, and how we reach you — your space for commissions and keepsakes from Hamro3D in Kathmandu.',
  ogTitle: 'Your Profile — Hamro3D',
  ogDescription:
    'Personal information, security, saved addresses, and notification preferences for your Hamro3D account.',
})

const editingPersonal = ref(false)
const editingPassword = ref(false)
const showToast = ref(false)

let toastTimer: ReturnType<typeof setTimeout> | null = null

function flashToast() {
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
    toastTimer = null
  }, 3200)
}

const personalInfo = reactive({
  firstName: 'Aarav',
  lastName: 'Sharma',
  email: 'aarav@example.com',
  phone: '+977 9812345678',
  city: 'Kathmandu',
  memberSince: 'January 2025',
})

const passwordFields = reactive({
  current: '',
  next: '',
  confirm: '',
})

const notifications = reactive({
  orderUpdates: true,
  commissionUpdates: true,
  newCollectionAlerts: false,
  occasionReminders: true,
  promotionalOffers: false,
})

const stats = [
  { label: 'Orders Placed', value: 4 },
  { label: 'Wishlist Items', value: 2 },
  { label: 'In Progress', value: 1 },
] as const

const defaultAddress = reactive({
  name: 'Aarav Sharma',
  line1: 'Thamel Ward 26',
  city: 'Kathmandu',
})

function savePersonal() {
  editingPersonal.value = false
  flashToast()
}

function cancelPersonalEdit() {
  editingPersonal.value = false
}

function savePassword() {
  editingPassword.value = false
  passwordFields.current = ''
  passwordFields.next = ''
  passwordFields.confirm = ''
  flashToast()
}

function cancelPasswordEdit() {
  editingPassword.value = false
  passwordFields.current = ''
  passwordFields.next = ''
  passwordFields.confirm = ''
}

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

const inputClass =
  'w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text outline-none transition-colors focus:border-h3d-accent'
const labelClass =
  'mb-1.5 block font-h3d-body text-2xs tracking-widest text-h3d-muted uppercase'
const panelHeaderClass =
  'font-h3d-body text-2xs tracking-[0.2em] text-h3d-muted uppercase'
const toggleTrackClass =
  'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-h3d-border bg-h3d-base transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-h3d-muted after:transition-all peer-checked:bg-h3d-accent/30 peer-checked:after:translate-x-5 peer-checked:after:bg-h3d-accent peer-focus-visible:ring-2 peer-focus-visible:ring-h3d-accent/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-h3d-surface'
</script>

<template>
  <div class="relative px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
    <!-- Save confirmation -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-out"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <output
        v-if="showToast"
        aria-live="polite"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-h3d-accent/40 bg-h3d-surface px-5 py-3 font-h3d-body text-sm text-h3d-text shadow-h3d-card"
      >
        Your changes have been saved.
      </output>
    </Transition>

    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <header class="border-b border-h3d-border pb-8">
        <p
          class="font-h3d-body text-2xs tracking-[0.25em] text-h3d-accent uppercase"
        >
          MY ACCOUNT
        </p>
        <h1
          class="mt-3 font-h3d-display text-h3d-h2 font-light italic text-h3d-text"
        >
          Your Profile
        </h1>
        <p
          class="mt-4 max-w-2xl font-h3d-body text-base leading-relaxed text-h3d-muted"
        >
          Keep your details current so every commission and delivery feels
          personal — the same care we put into the piece applies to how we
          reach you.
        </p>
      </header>

      <!-- Stats -->
      <section
        class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
        aria-label="Account summary"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border border-h3d-border bg-h3d-surface px-5 py-6 text-center"
        >
          <p
            class="font-h3d-display text-4xl font-light tabular-nums text-h3d-accent sm:text-5xl"
          >
            {{ stat.value }}
          </p>
          <p
            class="mt-2 font-h3d-body text-2xs tracking-widest text-h3d-muted uppercase"
          >
            {{ stat.label }}
          </p>
        </div>
      </section>

      <!-- Personal info -->
      <section class="mt-10">
        <div
          class="border border-h3d-border bg-h3d-surface p-6 sm:p-8"
        >
          <div
            class="flex flex-col gap-4 border-b border-h3d-border pb-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <h2 :class="panelHeaderClass">
              Personal information
            </h2>
            <button
              type="button"
              class="self-start border border-h3d-border px-4 py-2 font-h3d-body text-2xs font-medium tracking-[0.18em] text-h3d-text uppercase transition-colors hover:border-h3d-accent hover:text-h3d-accent sm:self-auto"
              @click="editingPersonal = !editingPersonal"
            >
              {{ editingPersonal ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <div
            v-if="!editingPersonal"
            class="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2"
          >
            <div>
              <p :class="labelClass">
                First name
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.firstName }}
              </p>
            </div>
            <div>
              <p :class="labelClass">
                Last name
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.lastName }}
              </p>
            </div>
            <div>
              <p :class="labelClass">
                Email
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.email }}
              </p>
            </div>
            <div>
              <p :class="labelClass">
                Phone
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.phone }}
              </p>
            </div>
            <div>
              <p :class="labelClass">
                City
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.city }}
              </p>
            </div>
            <div>
              <p :class="labelClass">
                Member since
              </p>
              <p class="font-h3d-body text-sm text-h3d-text">
                {{ personalInfo.memberSince }}
              </p>
            </div>
          </div>

          <form
            v-else
            class="mt-6 space-y-5"
            @submit.prevent="savePersonal"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="block">
                <span :class="labelClass">First name</span>
                <input
                  v-model="personalInfo.firstName"
                  type="text"
                  autocomplete="given-name"
                  :class="inputClass"
                >
              </label>
              <label class="block">
                <span :class="labelClass">Last name</span>
                <input
                  v-model="personalInfo.lastName"
                  type="text"
                  autocomplete="family-name"
                  :class="inputClass"
                >
              </label>
            </div>
            <label class="block">
              <span :class="labelClass">Email</span>
              <input
                v-model="personalInfo.email"
                type="email"
                autocomplete="email"
                :class="inputClass"
              >
            </label>
            <label class="block">
              <span :class="labelClass">Phone</span>
              <input
                v-model="personalInfo.phone"
                type="tel"
                autocomplete="tel"
                :class="inputClass"
              >
            </label>
            <label class="block sm:max-w-md">
              <span :class="labelClass">City</span>
              <input
                v-model="personalInfo.city"
                type="text"
                autocomplete="address-level2"
                :class="inputClass"
              >
            </label>
            <div class="rounded-sm border border-h3d-border/60 bg-h3d-base/50 px-3 py-3 sm:max-w-md">
              <p :class="labelClass">
                Member since
              </p>
              <p class="font-h3d-body text-sm text-h3d-muted">
                {{ personalInfo.memberSince }}
              </p>
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                class="border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-medium tracking-[0.2em] text-h3d-base uppercase transition-colors hover:bg-h3d-accent-hover"
              >
                Save changes
              </button>
              <button
                type="button"
                class="border border-h3d-border px-5 py-2.5 font-h3d-body text-2xs font-medium tracking-[0.2em] text-h3d-muted uppercase transition-colors hover:border-h3d-accent hover:text-h3d-text"
                @click="cancelPersonalEdit"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Password -->
      <section class="mt-8">
        <div class="border border-h3d-border bg-h3d-surface p-6 sm:p-8">
          <div
            class="flex flex-col gap-4 border-b border-h3d-border pb-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <h2 :class="panelHeaderClass">
              Password &amp; security
            </h2>
            <button
              type="button"
              class="self-start border border-h3d-border px-4 py-2 font-h3d-body text-2xs font-medium tracking-[0.18em] text-h3d-text uppercase transition-colors hover:border-h3d-accent hover:text-h3d-accent sm:self-auto"
              @click="editingPassword = !editingPassword"
            >
              {{ editingPassword ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <div
            v-if="!editingPassword"
            class="mt-6 space-y-4"
          >
            <div>
              <p :class="labelClass">Password</p>
              <p class="font-h3d-body text-sm tracking-widest text-h3d-text">
                ••••••••
              </p>
            </div>
            <div>
              <p :class="labelClass">Last changed</p>
              <p class="font-h3d-body text-sm text-h3d-text">
                3 months ago
              </p>
            </div>
          </div>

          <form
            v-else
            class="mt-6 max-w-md space-y-5"
            @submit.prevent="savePassword"
          >
            <label class="block">
              <span :class="labelClass">Current password</span>
              <input
                v-model="passwordFields.current"
                type="password"
                autocomplete="current-password"
                :class="inputClass"
              >
            </label>
            <label class="block">
              <span :class="labelClass">New password</span>
              <input
                v-model="passwordFields.next"
                type="password"
                autocomplete="new-password"
                :class="inputClass"
              >
            </label>
            <label class="block">
              <span :class="labelClass">Confirm new password</span>
              <input
                v-model="passwordFields.confirm"
                type="password"
                autocomplete="new-password"
                :class="inputClass"
              >
            </label>
            <div class="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                class="border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-medium tracking-[0.2em] text-h3d-base uppercase transition-colors hover:bg-h3d-accent-hover"
              >
                Update password
              </button>
              <button
                type="button"
                class="border border-h3d-border px-5 py-2.5 font-h3d-body text-2xs font-medium tracking-[0.2em] text-h3d-muted uppercase transition-colors hover:border-h3d-accent hover:text-h3d-text"
                @click="cancelPasswordEdit"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Addresses -->
      <section class="mt-8">
        <div class="border border-h3d-border bg-h3d-surface p-6 sm:p-8">
          <h2
            class="border-b border-h3d-border pb-5 font-h3d-body text-2xs tracking-[0.2em] text-h3d-muted uppercase"
          >
            Saved addresses
          </h2>
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article
              class="relative border border-h3d-accent/50 bg-h3d-base p-5"
              aria-label="Default delivery address"
            >
              <p
                class="inline-block border border-h3d-accent/40 bg-h3d-accent/10 px-2 py-0.5 font-h3d-body text-2xs tracking-widest text-h3d-accent uppercase"
              >
                Default
              </p>
              <p class="mt-3 font-h3d-body text-sm font-medium text-h3d-text">
                {{ defaultAddress.name }}
              </p>
              <p class="mt-1 font-h3d-body text-sm leading-relaxed text-h3d-muted">
                {{ defaultAddress.line1 }}<br>
                {{ defaultAddress.city }}
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  class="font-h3d-body text-2xs tracking-[0.15em] text-h3d-accent uppercase underline-offset-4 transition-colors hover:text-h3d-accent-hover hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="font-h3d-body text-2xs tracking-[0.15em] text-h3d-muted uppercase underline-offset-4 transition-colors hover:text-h3d-error hover:underline"
                >
                  Remove
                </button>
              </div>
            </article>
            <button
              type="button"
              class="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-h3d-border bg-transparent px-5 py-8 text-center transition-colors hover:border-h3d-accent/60 hover:bg-h3d-base/40"
            >
              <span
                class="font-h3d-body text-2xl font-light text-h3d-accent"
                aria-hidden="true"
              >+</span>
              <span
                class="mt-2 font-h3d-body text-2xs tracking-[0.18em] text-h3d-muted uppercase"
              >Add new address</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Notifications -->
      <section class="mt-8">
        <div class="border border-h3d-border bg-h3d-surface p-6 sm:p-8">
          <h2
            class="border-b border-h3d-border pb-5 font-h3d-body text-2xs tracking-[0.2em] text-h3d-muted uppercase"
          >
            Notification preferences
          </h2>
          <ul class="mt-6 divide-y divide-h3d-border">
            <li
              class="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
            >
              <span class="font-h3d-body text-sm text-h3d-text">Order updates</span>
              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="sr-only">Order updates</span>
                <input
                  v-model="notifications.orderUpdates"
                  type="checkbox"
                  class="peer sr-only"
                >
                <span :class="toggleTrackClass" aria-hidden="true" />
              </label>
            </li>
            <li
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <span class="font-h3d-body text-sm text-h3d-text">Commission updates</span>
              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="sr-only">Commission updates</span>
                <input
                  v-model="notifications.commissionUpdates"
                  type="checkbox"
                  class="peer sr-only"
                >
                <span :class="toggleTrackClass" aria-hidden="true" />
              </label>
            </li>
            <li
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <span class="font-h3d-body text-sm text-h3d-text">New collection alerts</span>
              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="sr-only">New collection alerts</span>
                <input
                  v-model="notifications.newCollectionAlerts"
                  type="checkbox"
                  class="peer sr-only"
                >
                <span :class="toggleTrackClass" aria-hidden="true" />
              </label>
            </li>
            <li
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <span class="font-h3d-body text-sm text-h3d-text">Occasion reminders</span>
              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="sr-only">Occasion reminders</span>
                <input
                  v-model="notifications.occasionReminders"
                  type="checkbox"
                  class="peer sr-only"
                >
                <span :class="toggleTrackClass" aria-hidden="true" />
              </label>
            </li>
            <li
              class="flex flex-wrap items-center justify-between gap-4 py-4 last:pb-0"
            >
              <span class="font-h3d-body text-sm text-h3d-text">Promotional offers</span>
              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="sr-only">Promotional offers</span>
                <input
                  v-model="notifications.promotionalOffers"
                  type="checkbox"
                  class="peer sr-only"
                >
                <span :class="toggleTrackClass" aria-hidden="true" />
              </label>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
