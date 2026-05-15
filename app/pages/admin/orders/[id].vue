<template>
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10 sm:py-14">
    <!-- Back link -->
    <NuxtLink
      to="/admin/orders"
      class="mb-7 inline-flex items-center gap-2 font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-accent"
    >
      ← Back to Orders
    </NuxtLink>

    <!-- Not found -->
    <div v-if="!order" class="border border-dashed border-h3d-border bg-h3d-surface px-8 py-16 text-center">
      <h1 class="mb-3 font-h3d-display text-xl font-light text-h3d-text">
        Order not found
      </h1>
      <p class="font-h3d-body text-sm text-h3d-muted">
        The order ID <span class="text-h3d-text">{{ displayId }}</span> does not exist.
      </p>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="mb-10 border-b border-h3d-border pb-6">
        <h1 class="font-h3d-display text-2xl font-light text-h3d-text sm:text-3xl">
          #{{ order.id }}
        </h1>
        <div class="mt-3 flex flex-wrap items-center gap-3 gap-y-2 font-h3d-body text-sm text-h3d-muted">
          <span>{{ order.customer }}</span>
          <span aria-hidden="true">·</span>
          <time>{{ order.date }}</time>
          <span aria-hidden="true">·</span>
          <span
            :class="adminStatusBadgeClass(order.status)"
            class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest"
          >
            {{ order.status }}
          </span>
        </div>
      </header>

      <div class="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">
        <!-- Left column -->
        <div class="flex flex-col gap-8">
          <!-- Timeline -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-tl-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-tl-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">
                Order Status
              </h2>
            </div>
            <div class="px-6 py-6">
              <ol class="relative ml-1.5 space-y-0 border-l-2 border-h3d-border pl-7">
                <li
                  v-for="(step, idx) in order.timeline"
                  :key="idx"
                  class="relative pb-6 last:pb-0"
                >
                  <span
                    class="absolute -left-[calc(1.75rem+5px)] top-1 h-3 w-3 rounded-full border-2"
                    :class="dotClass(step.state)"
                    aria-hidden="true"
                  />
                  <p
                    class="font-h3d-body text-sm font-medium"
                    :class="step.state === 'pending' ? 'text-h3d-muted' : step.state === 'active' ? 'text-h3d-accent' : 'text-h3d-text'"
                  >
                    {{ step.label }}
                  </p>
                  <p
                    class="mt-0.5 font-h3d-body text-2xs"
                    :class="step.state === 'pending' ? 'text-h3d-muted/55' : 'text-h3d-muted'"
                  >
                    {{ step.date }}
                  </p>
                </li>
              </ol>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="flex flex-col gap-6">
          <!-- Order Items -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-items-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-items-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">
                Order Items
              </h2>
            </div>
            <div class="divide-y divide-h3d-border">
              <div
                v-for="(line, idx) in order.lines"
                :key="idx"
                class="flex items-start justify-between gap-4 px-6 py-5"
              >
                <div class="min-w-0">
                  <p class="font-h3d-display text-base font-light text-h3d-text">{{ line.name }}</p>
                  <p class="mt-1 font-h3d-body text-2xs leading-relaxed text-h3d-muted">{{ line.meta }}</p>
                  <p class="mt-2 font-h3d-body text-2xs tracking-widest text-h3d-muted">× {{ line.qty }}</p>
                </div>
                <p class="shrink-0 font-h3d-display text-base font-light tabular-nums text-h3d-accent">
                  NPR {{ formatNprPrice(line.lineTotal) }}
                </p>
              </div>
            </div>
          </section>

          <!-- Shipping -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-ship-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-ship-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">
                Shipping
              </h2>
            </div>
            <div class="px-6 py-5">
              <p class="font-h3d-display text-base font-light text-h3d-text">
                {{ order.delivery.name }}
              </p>
              <p class="mt-2 whitespace-pre-line font-h3d-body text-sm leading-relaxed text-h3d-muted">
                {{ order.delivery.address }}
              </p>
              <p class="mt-3 font-h3d-body text-sm text-h3d-muted">
                {{ order.delivery.phone }}
              </p>
            </div>
          </section>

          <!-- Payment -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-pay-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-pay-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">
                Payment
              </h2>
            </div>
            <div class="px-6 py-5">
              <dl class="space-y-2 font-h3d-body text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Method</dt>
                  <dd class="font-medium text-h3d-text">{{ order.payment.method }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Subtotal</dt>
                  <dd class="tabular-nums text-h3d-muted">NPR {{ formatNprPrice(order.payment.subtotal) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Shipping</dt>
                  <dd class="tabular-nums text-h3d-muted">NPR {{ formatNprPrice(order.payment.shipping) }}</dd>
                </div>
                <div class="flex justify-between gap-4 border-t border-h3d-border pt-3 font-medium">
                  <dt class="text-h3d-text">Total</dt>
                  <dd class="font-h3d-display text-lg font-light tabular-nums text-h3d-accent">
                    NPR {{ formatNprPrice(order.payment.total) }}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { MockAdminOrderStatus } from '~/data/mock-admin-orders'
import { getMockAdminOrderById } from '~/data/mock-admin-orders'
import { formatNprPrice } from '~/data/mock-products'

definePageMeta({ layout: 'admin' })

const route = useRoute()

const displayId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] ?? '' : raw ?? ''
})

const order = computed(() => getMockAdminOrderById(displayId.value))

function dotClass(state: 'done' | 'active' | 'pending'): string {
  switch (state) {
    case 'done':
      return 'border-h3d-success bg-h3d-success'
    case 'active':
      return 'border-h3d-accent bg-h3d-accent animate-pulse'
    default:
      return 'border-h3d-border bg-h3d-base'
  }
}

function adminStatusBadgeClass(status: MockAdminOrderStatus): string {
  switch (status) {
    case 'Delivered':
      return 'border-h3d-success/50 bg-h3d-success/10 text-h3d-success'
    case 'Shipped':
      return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'In craft':
      return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'Awaiting review':
      return 'border-h3d-border bg-h3d-base text-h3d-muted'
    default:
      return 'border-h3d-border bg-h3d-base text-h3d-muted'
  }
}

useSeoMeta({
  title: computed(() => `Admin — Order #${displayId.value || '…'} — Hamro3D`),
  description: 'Admin order detail — commission tracking for Hamro3D.',
})
</script>
