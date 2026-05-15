<template>
  <div class="w-full px-6 sm:px-10 py-10 sm:py-14">
    <!-- Header -->
    <header class="mb-10 text-center sm:mb-12 sm:text-left">
      <p
        class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent mb-3"
      >
        CHECKOUT
      </p>
      <h1
        class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text"
      >
        Complete Your Gift
      </h1>
    </header>

    <!-- Step indicators -->
    <nav
      v-if="cartItems.length > 0"
      class="mb-10 sm:mb-12"
      aria-label="Checkout steps"
    >
      <ol class="flex items-start justify-between gap-2 sm:gap-4">
        <li
          v-for="(label, index) in stepLabels"
          :key="label"
          class="flex min-w-0 flex-1 flex-col items-center"
        >
          <div class="flex w-full items-center">
            <span
              v-if="index > 0"
              class="h-px flex-1 bg-h3d-border transition-colors"
              :class="index < currentStep ? 'bg-h3d-accent/60' : ''"
              aria-hidden="true"
            />
            <span
              class="mx-1 flex h-2.5 w-2.5 shrink-0 rounded-full border border-h3d-border transition-colors sm:mx-2"
              :class="
                index + 1 <= currentStep
                  ? 'bg-h3d-accent border-h3d-accent'
                  : 'bg-h3d-base'
              "
              :aria-current="index + 1 === currentStep ? 'step' : undefined"
            />
            <span
              v-if="index < stepLabels.length - 1"
              class="h-px flex-1 bg-h3d-border transition-colors"
              :class="index + 1 < currentStep ? 'bg-h3d-accent/60' : ''"
              aria-hidden="true"
            />
          </div>
          <span
            class="font-h3d-body mt-3 max-w-[6.5rem] text-center text-2xs uppercase tracking-wider sm:max-w-none"
            :class="
              index + 1 === currentStep
                ? 'text-h3d-text'
                : 'text-h3d-muted'
            "
          >{{ label }}</span>
        </li>
      </ol>
    </nav>

    <!-- Empty cart -->
    <div
      v-if="cartItems.length === 0"
      class="border border-h3d-border bg-h3d-surface px-8 py-16 text-center"
    >
      <h2
        class="font-h3d-display text-xl font-light text-h3d-text mb-3"
      >
        Nothing to complete yet
      </h2>
      <p class="font-h3d-body text-sm text-h3d-muted mb-8 leading-relaxed">
        Add a piece to your selections first — then you can deliver details and finish your gift here.
      </p>
      <NuxtLink
        to="/cart"
        class="inline-flex items-center justify-center bg-h3d-accent px-8 py-3 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
      >
        View Your Selections
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Step 1: Delivery -->
      <section
        v-show="currentStep === 1"
        aria-labelledby="shipping-heading"
        class="mb-10"
      >
        <h2
          id="shipping-heading"
          class="font-h3d-display text-lg text-h3d-text mb-6 border-b border-h3d-border pb-3"
        >
          Delivery details
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label class="block sm:col-span-1">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">First name</span>
            <input
              v-model="shippingForm.firstName"
              type="text"
              autocomplete="given-name"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="Given name"
            >
          </label>
          <label class="block sm:col-span-1">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">Last name</span>
            <input
              v-model="shippingForm.lastName"
              type="text"
              autocomplete="family-name"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="Family name"
            >
          </label>
          <label class="block sm:col-span-1">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">Phone</span>
            <input
              v-model="shippingForm.phone"
              type="tel"
              autocomplete="tel"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="+977 …"
            >
          </label>
          <label class="block sm:col-span-1">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">Email</span>
            <input
              v-model="shippingForm.email"
              type="email"
              autocomplete="email"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="you@example.com"
            >
          </label>
          <label class="block sm:col-span-2">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">Address</span>
            <input
              v-model="shippingForm.address"
              type="text"
              autocomplete="address-line1"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="Street, area, landmark"
            >
          </label>
          <label class="block sm:col-span-2">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">City</span>
            <select
              v-model="shippingForm.city"
              autocomplete="address-level2"
              class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
            >
              <option
                v-for="c in cityOptions"
                :key="c"
                :value="c"
              >
                {{ c }}
              </option>
            </select>
          </label>
          <label class="block sm:col-span-2">
            <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mb-2 block">Gift message</span>
            <textarea
              v-model="giftMessage"
              rows="4"
              class="w-full resize-y border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder:text-h3d-muted/70 focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent"
              placeholder="A few words for the card — optional, and always held in confidence."
            />
          </label>
        </div>
      </section>

      <!-- Step 2: Payment -->
      <section
        v-show="currentStep === 2"
        aria-labelledby="payment-heading"
        class="mb-10"
      >
        <h2
          id="payment-heading"
          class="font-h3d-display text-lg text-h3d-text mb-6 border-b border-h3d-border pb-3"
        >
          Payment
        </h2>
        <fieldset class="space-y-4">
          <legend class="sr-only">Choose payment method</legend>
          <label
            v-for="opt in paymentOptions"
            :key="opt.value"
            class="flex cursor-pointer items-start gap-3 border border-h3d-border bg-h3d-surface p-4 transition-colors has-[:checked]:border-h3d-accent/80"
          >
            <input
              v-model="paymentMethod"
              type="radio"
              name="payment"
              :value="opt.value"
              class="mt-1 h-3.5 w-3.5 shrink-0 border-h3d-border text-h3d-accent focus:ring-h3d-accent"
            >
            <span>
              <span class="font-h3d-body text-sm text-h3d-text block">{{
                opt.label
              }}</span>
              <span
                v-if="opt.hint"
                class="font-h3d-body text-xs text-h3d-muted mt-1 block leading-relaxed"
              >{{ opt.hint }}</span>
            </span>
          </label>
        </fieldset>
        <p class="mt-6 font-h3d-body text-xs text-h3d-muted leading-relaxed border border-h3d-border border-dashed bg-h3d-base/50 px-4 py-3">
          We will confirm your commission by message before anything is prepared. If you choose bank transfer or eSewa, details are sent after you place the gift.
        </p>
      </section>

      <!-- Step 3: Confirmation -->
      <section
        v-show="currentStep === 3"
        aria-labelledby="confirm-heading"
        class="mb-10 border border-h3d-border bg-h3d-surface p-6 sm:p-8 text-center"
      >
        <p class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent mb-3">
          Thank you
        </p>
        <h2
          id="confirm-heading"
          class="font-h3d-display text-2xl font-light text-h3d-text mb-4"
        >
          Your gift is received
        </h2>
        <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed max-w-md mx-auto mb-2">
          We will reach out shortly to confirm delivery and any final touches. Until then, your selections are held with care.
        </p>
        <p class="font-h3d-body text-sm text-h3d-text tabular-nums">
          Total reserved: NPR {{ formatPrice(total) }}
        </p>
      </section>

      <!-- Order summary (all steps with items) -->
      <aside
        class="border border-h3d-border bg-h3d-surface p-6 mb-8"
        aria-labelledby="summary-heading"
      >
        <h2
          id="summary-heading"
          class="font-h3d-display text-lg text-h3d-text mb-6 border-b border-h3d-border pb-4"
        >
          Your selections
        </h2>
        <ul class="divide-y divide-h3d-border border-b border-h3d-border mb-6">
          <li
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-4 py-4 first:pt-0"
          >
            <div
              class="h-[72px] w-[72px] flex-shrink-0 border border-h3d-border bg-h3d-base"
              aria-hidden="true"
            />
            <div class="min-w-0 flex-1">
              <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-1">
                {{ item.tag }}
              </p>
              <p class="font-h3d-display text-base text-h3d-text">{{ item.name }}</p>
              <p
                v-if="item.meta"
                class="font-h3d-body text-xs text-h3d-muted mt-1"
              >
                {{ item.meta }}
              </p>
              <p class="font-h3d-body text-xs text-h3d-muted mt-2 tabular-nums">
                Qty {{ item.quantity }}
              </p>
            </div>
            <p class="font-h3d-body text-sm text-h3d-text tabular-nums shrink-0">
              NPR {{ formatPrice(lineTotal(item)) }}
            </p>
          </li>
        </ul>
        <dl class="space-y-4 font-h3d-body text-sm">
          <div class="flex justify-between gap-4 text-h3d-muted">
            <dt>Subtotal</dt>
            <dd class="tabular-nums text-h3d-text">
              NPR {{ formatPrice(subtotal) }}
            </dd>
          </div>
          <div class="flex justify-between gap-4 text-h3d-muted">
            <dt>Delivery</dt>
            <dd class="tabular-nums text-h3d-text">
              NPR {{ formatPrice(shippingNpr) }}
            </dd>
          </div>
        </dl>
        <div class="my-6 h-px bg-h3d-border" aria-hidden="true" />
        <div class="flex justify-between gap-4 font-h3d-body text-base text-h3d-text">
          <span class="font-medium">Total</span>
          <span class="tabular-nums font-h3d-display text-lg">NPR {{ formatPrice(total) }}</span>
        </div>
        <p class="mt-5 font-h3d-body text-2xs leading-relaxed text-h3d-muted text-center">
          Gift packaging is included where noted. We pack each piece as if it were meant for someone you love.
        </p>
      </aside>

      <!-- Navigation -->
      <div
        class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <button
          v-if="currentStep === 2"
          type="button"
          class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted underline decoration-h3d-border underline-offset-4 transition-colors hover:text-h3d-text sm:order-1"
          @click="goBack"
        >
          Back
        </button>
        <div
          v-else
          class="sm:order-1"
        />

        <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:order-2">
          <button
            v-if="currentStep === 1"
            type="button"
            class="inline-flex items-center justify-center bg-h3d-accent px-8 py-3.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
            @click="currentStep = 2"
          >
            Continue to Payment
          </button>
          <button
            v-if="currentStep === 2"
            type="button"
            class="inline-flex items-center justify-center bg-h3d-accent px-8 py-3.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
            @click="placeOrder"
          >
            Place Order
          </button>
          <NuxtLink
            v-if="currentStep === 3"
            to="/products"
            class="inline-flex items-center justify-center border border-h3d-border bg-transparent px-8 py-3.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-text transition-colors hover:border-h3d-accent hover:text-h3d-accent text-center"
          >
            Explore collections
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'checkout',
})

type CartLine = {
  id: number
  name: string
  tag: string
  meta: string
  unitPrice: number
  quantity: number
}

const stepLabels = ['Shipping', 'Payment', 'Confirmation'] as const

const currentStep = ref(1)

const cityOptions = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Other',
] as const

const shippingForm = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: 'Kathmandu' as (typeof cityOptions)[number],
})

const giftMessage = ref('')

const paymentMethod = ref<'cod' | 'bank' | 'esewa'>('cod')

const paymentOptions = [
  {
    value: 'cod' as const,
    label: 'Cash on Delivery',
    hint: 'Pay when your piece arrives — we will confirm before dispatch.',
  },
  {
    value: 'bank' as const,
    label: 'Bank Transfer',
    hint: 'Account details are shared after you place the gift.',
  },
  {
    value: 'esewa' as const,
    label: 'eSewa',
    hint: 'We will send instructions for a secure transfer.',
  },
]

const shippingNpr = 200

const cartItems = ref<CartLine[]>([
  {
    id: 1,
    name: 'Custom Human Figurine',
    tag: 'Custom figurine · Commission',
    meta: 'Scale: 15 cm · Finish: Standard',
    unitPrice: 8500,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Portrait Litholamp',
    tag: 'Litholamp · Portrait',
    meta: '',
    unitPrice: 2200,
    quantity: 2,
  },
  {
    id: 3,
    name: 'Photo Keychain',
    tag: 'Keychain · Everyday carry',
    meta: '',
    unitPrice: 850,
    quantity: 1,
  },
])

function formatPrice(value: number): string {
  return value.toLocaleString('en-IN')
}

function lineTotal(item: CartLine): number {
  return item.unitPrice * item.quantity
}

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + lineTotal(item), 0),
)

const total = computed(() => subtotal.value + shippingNpr)

function goBack(): void {
  if (currentStep.value <= 1) return
  currentStep.value -= 1
}

function placeOrder(): void {
  currentStep.value = 3
}

useSeoMeta({
  title: 'Complete Your Gift',
  description:
    'Delivery and payment for your Hamro3D selections — handcrafted keepsakes from Kathmandu, made to mean something.',
  ogTitle: 'Complete Your Gift — Hamro3D',
  ogDescription:
    'Finish delivery details and choose how you would like to complete your commission.',
})
</script>
