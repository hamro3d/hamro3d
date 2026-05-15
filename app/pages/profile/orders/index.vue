<template>
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10 sm:py-14">
    <header class="mb-10 border-b border-h3d-border pb-8 sm:mb-12">
      <p class="mb-3 font-h3d-body text-2xs uppercase tracking-[0.22em] text-h3d-accent">
        My Orders
      </p>
      <h1 class="mb-2 font-h3d-display text-3xl font-light text-h3d-text sm:text-4xl">
        Order History
      </h1>
      <p class="font-h3d-body text-sm leading-relaxed text-h3d-muted">
        Track every commission from our Kathmandu studio to your door.
      </p>
    </header>

    <!-- Empty state -->
    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center border border-dashed border-h3d-border bg-h3d-surface px-8 py-16 text-center sm:py-24"
    >
      <h2 class="mb-3 font-h3d-display text-xl font-light text-h3d-text sm:text-2xl">
        No orders yet
      </h2>
      <p class="mb-8 max-w-sm font-h3d-body text-sm leading-relaxed text-h3d-muted">
        Your story is waiting to take shape. Explore custom figurines, lamps, and keepsakes crafted in Nepal.
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center justify-center bg-h3d-accent px-7 py-3 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover"
      >
        Explore Products
      </NuxtLink>
    </div>

    <!-- Order cards -->
    <div v-else class="flex flex-col gap-5">
      <article
        v-for="order in orders"
        :key="order.id"
        class="border border-h3d-border bg-h3d-surface p-6 sm:p-7"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <div class="flex flex-wrap items-center gap-3 gap-y-2">
              <h2 class="font-h3d-display text-lg font-light text-h3d-text">
                #{{ order.id }}
              </h2>
              <span class="font-h3d-body text-2xs tracking-widest text-h3d-muted">
                {{ order.date }}
              </span>
              <span
                :class="statusBadgeClass(order.status)"
                class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest"
              >
                {{ order.status }}
              </span>
            </div>
            <p
              v-if="order.items.length"
              class="mt-3 font-h3d-body text-sm leading-relaxed text-h3d-muted"
            >
              {{ order.items.join(' · ') }}
            </p>
          </div>
          <div class="sm:text-right">
            <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">
              Total
            </p>
            <p class="font-h3d-display text-xl font-light tabular-nums text-h3d-accent">
              NPR {{ order.total }}
            </p>
          </div>
        </div>
        <div class="mt-4 flex justify-end border-t border-h3d-border pt-4">
          <NuxtLink
            :to="`/profile/orders/${order.id}`"
            class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-accent"
            style="border-bottom: 1px solid transparent; padding-bottom: 2px;"
          >
            View Details
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MockUserOrderStatus } from '~/data/mock-user-orders'
import { mockUserOrders } from '~/data/mock-user-orders'
import { formatNprPrice } from '~/data/mock-products'

definePageMeta({ layout: 'profile' })

const orders = computed(() =>
  mockUserOrders.map((o) => ({
    id: o.id,
    date: o.date,
    status: o.status,
    items: o.lines.map((l) => l.name),
    total: formatNprPrice(o.total),
  })),
)

function statusBadgeClass(status: MockUserOrderStatus): string {
  switch (status) {
    case 'Delivered':
      return 'border-h3d-success/50 bg-h3d-success/10 text-h3d-success'
    case 'In Progress':
      return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'Processing':
      return 'border-h3d-border bg-h3d-base text-h3d-muted'
    default:
      return 'border-h3d-border bg-h3d-base text-h3d-muted'
  }
}

useSeoMeta({
  title: 'Order History — Hamro3D',
  description: 'View your Hamro3D commissions — order history, status, and details for each piece.',
})
</script>
