<template>
  <div class="max-w-h3d-max mx-auto px-6 sm:px-10 py-10 sm:py-14">
    <!-- Header -->
    <header class="mb-10 sm:mb-12">
      <p
        class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent mb-3"
      >
        MY CART
      </p>
      <h1
        class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-2"
      >
        Your Cart
      </h1>
      <p class="font-h3d-body text-sm text-h3d-muted">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} in your cart
      </p>
    </header>

    <!-- Empty state -->
    <div
      v-if="cartItems.length === 0"
      class="flex flex-col items-center justify-center py-16 sm:py-24 text-center border border-h3d-border bg-h3d-surface px-8"
    >
      <div
        class="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-h3d-border bg-h3d-base text-h3d-accent"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-8 w-8 stroke-current fill-none"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 6h15l-1.5 9h-12z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 6L5 3H2"
          />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </div>
      <h2
        class="font-h3d-display text-xl sm:text-2xl font-light text-h3d-text mb-3"
      >
        Your cart is empty
      </h2>
      <p class="font-h3d-body text-sm text-h3d-muted max-w-md mb-8 leading-relaxed">
        When you commission a piece, it will appear here until you are ready to
        complete your gift.
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center justify-center bg-h3d-accent px-8 py-3 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
      >
        Browse Collection
      </NuxtLink>
    </div>

    <!-- Cart + summary -->
    <div
      v-else
      class="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start lg:gap-12"
    >
      <!-- Line items -->
      <ul class="space-y-0 divide-y divide-h3d-border border border-h3d-border bg-h3d-surface">
        <li
          v-for="item in cartItems"
          :key="item.id"
          class="flex gap-4 p-4 sm:p-5"
        >
          <NuxtLink
            :to="`/products/${item.productId}`"
            class="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden border border-h3d-border bg-h3d-base"
            :aria-label="`View ${item.name}`"
          >
            <img
              v-if="item.image"
              :src="item.image"
              alt=""
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <span
              v-else
              class="flex h-full w-full items-center justify-center font-h3d-body text-2xs text-h3d-muted"
            >—</span>
          </NuxtLink>
          <div class="min-w-0 flex-1">
            <p
              class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-1"
            >
              {{ item.tag }}
            </p>
            <h2 class="font-h3d-display text-base text-h3d-text mb-1">
              <NuxtLink
                :to="`/products/${item.productId}`"
                class="text-inherit transition-colors hover:text-h3d-accent"
              >
                {{ item.name }}
              </NuxtLink>
            </h2>
            <p
              v-if="item.meta"
              class="font-h3d-body text-xs text-h3d-muted mb-4"
            >
              {{ item.meta }}
            </p>
            <div
              class="flex flex-wrap items-center justify-between gap-3 sm:justify-start sm:gap-6"
            >
              <div
                class="flex items-center gap-0 border border-h3d-border bg-h3d-base"
              >
                <button
                  type="button"
                  class="font-h3d-body px-3 py-2 text-sm text-h3d-text transition-colors hover:bg-h3d-surface"
                  :aria-label="`Decrease quantity for ${item.name}`"
                  @click="updateQuantity(item.id, -1)"
                >
                  −
                </button>
                <span
                  class="font-h3d-body min-w-[2rem] text-center text-sm text-h3d-text tabular-nums"
                >{{ item.quantity }}</span>
                <button
                  type="button"
                  class="font-h3d-body px-3 py-2 text-sm text-h3d-text transition-colors hover:bg-h3d-surface"
                  :aria-label="`Increase quantity for ${item.name}`"
                  @click="updateQuantity(item.id, 1)"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-error underline decoration-h3d-border underline-offset-4 transition-colors hover:text-h3d-text"
                @click="removeItem(item.id)"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 text-right">
            <p class="font-h3d-body text-xs text-h3d-muted tabular-nums">
              NPR {{ formatPrice(item.unitPrice) }} each
            </p>
            <p class="font-h3d-body text-sm font-medium text-h3d-text tabular-nums">
              NPR {{ formatPrice(lineTotal(item)) }}
            </p>
          </div>
        </li>
      </ul>

      <!-- Order summary -->
      <aside
        class="lg:sticky lg:top-24 border border-h3d-border bg-h3d-surface p-6"
      >
        <h2
          class="font-h3d-display text-lg text-h3d-text mb-6 border-b border-h3d-border pb-4"
        >
          Summary
        </h2>
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
        <div class="flex justify-between gap-4 font-h3d-body text-base text-h3d-text mb-8">
          <span class="font-medium">Total</span>
          <span class="tabular-nums font-h3d-display text-lg">NPR {{ formatPrice(total) }}</span>
        </div>
        <NuxtLink
          to="/checkout"
          class="flex w-full items-center justify-center bg-h3d-accent py-3.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
        >
          Proceed to Checkout
        </NuxtLink>
        <p class="mt-5 font-h3d-body text-2xs leading-relaxed text-h3d-muted text-center">
          Gift packaging is available at checkout. We pack each piece as if it were meant for someone you love.
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

definePageMeta({
  layout: 'profile',
  middleware: 'auth',
})

const cart = useCartStore()

const cartItems = computed(() => cart.items)
const itemCount = computed(() => cart.itemCount)
const subtotal = computed(() => cart.subtotal)
const shippingNpr = cart.shippingNpr
const total = computed(() => cart.total)

function formatPrice(value: number): string {
  return value.toLocaleString('en-IN')
}

function lineTotal(item: (typeof cart.items)[number]): number {
  return cart.lineTotal(item)
}

function updateQuantity(id: number, delta: number): void {
  cart.updateQuantity(id, delta)
}

function removeItem(id: number): void {
  cart.removeItem(id)
}

useSeoMeta({
  title: 'Your Cart',
  description:
    'Review your selections from Hamro3D — handcrafted keepsakes from Kathmandu, made to mean something.',
  ogTitle: 'Your Cart — Hamro3D',
  ogDescription:
    'Review your selections before you complete your gift.',
})
</script>
