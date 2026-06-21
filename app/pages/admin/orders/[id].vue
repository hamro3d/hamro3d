<template>
  <div>
    <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10 sm:py-14">
    <!-- Back -->
    <NuxtLink
      to="/admin/orders"
      class="mb-7 inline-flex items-center gap-2 font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-accent"
    >← Back to Orders</NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div class="h-10 w-48 animate-pulse rounded bg-h3d-border/30" />
      <div class="h-6 w-72 animate-pulse rounded bg-h3d-border/20" />
    </div>

    <!-- Not found -->
    <div v-else-if="!order" class="border border-dashed border-h3d-border bg-h3d-surface px-8 py-16 text-center">
      <h1 class="mb-3 font-h3d-display text-xl font-light text-h3d-text">Order not found</h1>
      <p class="font-h3d-body text-sm text-h3d-muted">ID <span class="text-h3d-text">{{ orderId }}</span> does not exist.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="mb-10 border-b border-h3d-border pb-6">
        <h1 class="font-h3d-display text-2xl font-light text-h3d-text sm:text-3xl">#{{ order.id }}</h1>
        <div class="mt-3 flex flex-wrap items-center gap-3 gap-y-2 font-h3d-body text-sm text-h3d-muted">
          <span>{{ order.customer_name }}</span>
          <span aria-hidden="true">·</span>
          <time>{{ formatDate(order.created_at) }}</time>
          <span aria-hidden="true">·</span>
          <span :class="statusClass(order.status)" class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest">
            {{ order.status }}
          </span>
        </div>
      </header>

      <!-- Status action bar -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3 border border-h3d-border bg-h3d-surface px-5 py-4">
        <div class="flex flex-wrap items-center gap-3">
          <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted mr-3">Update status:</p>
          <button
            v-for="s in VALID_STATUSES"
            :key="s"
            type="button"
            :disabled="order.status === s || updating"
            class="border px-4 py-1.5 font-h3d-body text-2xs uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :class="order.status === s
              ? statusClass(s) + ' cursor-default'
              : 'border-h3d-border text-h3d-muted hover:border-h3d-accent hover:text-h3d-accent'"
            @click="updateStatus(s)"
          >
            <span v-if="updating && updatingTo === s" class="mr-1 inline-block h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {{ s }}
          </button>
        </div>
        <button
          type="button"
          class="border border-red-500/50 bg-red-500/5 px-4 py-1.5 font-h3d-body text-2xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors"
          @click="confirmDelete"
        >
          Delete Order
        </button>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">
        <!-- Left: Timeline -->
        <div class="flex flex-col gap-8">
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-tl-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-tl-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">Order Status</h2>
            </div>
            <div class="px-6 py-6">
              <ol class="relative ml-1.5 space-y-0 border-l-2 border-h3d-border pl-7">
                <li
                  v-for="(step, idx) in timeline"
                  :key="idx"
                  class="relative pb-6 last:pb-0"
                >
                  <span
                    class="absolute -left-[calc(1.75rem+5px)] top-1 h-3 w-3 rounded-full border-2"
                    :class="dotClass(step.state)"
                    aria-hidden="true"
                  />
                  <p class="font-h3d-body text-sm font-medium" :class="step.state === 'pending' ? 'text-h3d-muted' : step.state === 'active' ? 'text-h3d-accent' : 'text-h3d-text'">
                    {{ step.label }}
                  </p>
                  <p class="mt-0.5 font-h3d-body text-2xs" :class="step.state === 'pending' ? 'text-h3d-muted/55' : 'text-h3d-muted'">
                    {{ step.date }}
                  </p>
                </li>
              </ol>
            </div>
          </section>
        </div>

        <!-- Right: Items / Shipping / Payment -->
        <div class="flex flex-col gap-6">
          <!-- Order Items -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-items-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-items-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">Order Items</h2>
            </div>
            <div class="divide-y divide-h3d-border">
              <div v-for="(line, idx) in lines" :key="idx" class="flex items-start justify-between gap-4 px-6 py-5">
                <div class="min-w-0">
                  <p class="font-h3d-display text-base font-light text-h3d-text">{{ line.name }}</p>
                  <p class="mt-1 font-h3d-body text-2xs leading-relaxed text-h3d-muted">{{ line.meta }}</p>
                  <p class="mt-2 font-h3d-body text-2xs tracking-widest text-h3d-muted">× {{ line.qty }}</p>
                </div>
                <p class="shrink-0 font-h3d-display text-base font-light tabular-nums text-h3d-accent">
                  NPR {{ fmt(line.lineTotal) }}
                </p>
              </div>
            </div>
          </section>

          <!-- Shipping -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-ship-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-ship-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">Shipping</h2>
            </div>
            <div class="px-6 py-5">
              <p class="font-h3d-display text-base font-light text-h3d-text">{{ order.customer_name }}</p>
              <p class="mt-2 whitespace-pre-line font-h3d-body text-sm leading-relaxed text-h3d-muted">{{ order.delivery_address }}</p>
              <p class="mt-3 font-h3d-body text-sm text-h3d-muted">{{ order.customer_phone }}</p>
            </div>
          </section>

          <!-- Payment -->
          <section class="border border-h3d-border bg-h3d-surface" aria-labelledby="admin-pay-heading">
            <div class="border-b border-h3d-border px-6 py-4">
              <h2 id="admin-pay-heading" class="font-h3d-body text-2xs font-medium uppercase tracking-[0.2em] text-h3d-accent">Payment</h2>
            </div>
            <div class="px-6 py-5">
              <dl class="space-y-2 font-h3d-body text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Method</dt>
                  <dd class="font-medium text-h3d-text">{{ order.payment_method }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Subtotal</dt>
                  <dd class="tabular-nums text-h3d-muted">NPR {{ fmt(order.subtotal) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-h3d-muted">Shipping</dt>
                  <dd class="tabular-nums text-h3d-muted">NPR {{ fmt(order.shipping) }}</dd>
                </div>
                <div class="flex justify-between gap-4 border-t border-h3d-border pt-3 font-medium">
                  <dt class="text-h3d-text">Total</dt>
                  <dd class="font-h3d-display text-lg font-light tabular-nums text-h3d-accent">
                    NPR {{ fmt(order.total) }}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>

  <Teleport to="body">
    <!-- Delete Confirm Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div class="w-full max-w-sm border border-h3d-border bg-h3d-surface p-8 text-center shadow-xl">
        <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3">Confirm deletion</p>
        <p class="font-h3d-display text-lg font-light text-h3d-text mb-2">Delete Order #{{ orderId }}?</p>
        <p class="font-h3d-body text-sm text-h3d-muted mb-8">This action cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button type="button" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors px-4 py-2" @click="showDeleteConfirm = false">Cancel</button>
          <button
            type="button"
            :disabled="deleting"
            class="inline-flex items-center gap-2 border border-red-500/70 bg-red-500/10 px-6 py-2 font-h3d-body text-2xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            @click="deleteOrder"
          >
            <span v-if="deleting" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const orderId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] ?? '' : raw ?? ''
})

const { data, pending, refresh } = await useFetch(() => `/api/orders/${orderId.value}`)
const order = computed(() => data.value as any)

const lines = computed(() => {
  const raw = order.value?.lines
  if (!raw) return []
  return typeof raw === 'string' ? JSON.parse(raw) : raw
})

const timeline = computed(() => {
  const raw = order.value?.timeline
  if (!raw) return []
  return typeof raw === 'string' ? JSON.parse(raw) : raw
})

const VALID_STATUSES = ['Awaiting review', 'In craft', 'Shipped', 'Delivered'] as const
const updating = ref(false)
const updatingTo = ref('')

async function updateStatus(status: string) {
  updating.value = true
  updatingTo.value = status
  try {
    await $fetch(`/api/orders/${orderId.value}`, { method: 'PUT', body: { status } })
    await refresh()
  } finally {
    updating.value = false
    updatingTo.value = ''
  }
}

function fmt(n: number) { return Number(n).toLocaleString('en-IN') }
function formatDate(ts: string) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
function dotClass(state: string) {
  switch (state) {
    case 'done': return 'border-h3d-success bg-h3d-success'
    case 'active': return 'border-h3d-accent bg-h3d-accent animate-pulse'
    default: return 'border-h3d-border bg-h3d-base'
  }
}
function statusClass(status: string) {
  switch (status) {
    case 'Delivered': return 'border-h3d-success/50 bg-h3d-success/10 text-h3d-success'
    case 'Shipped': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'In craft': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    default: return 'border-h3d-border bg-h3d-base text-h3d-muted'
  }
}

const showDeleteConfirm = ref(false)
const deleting = ref(false)

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function deleteOrder() {
  deleting.value = true
  try {
    await $fetch(`/api/orders/${orderId.value}`, { method: 'DELETE' })
    showDeleteConfirm.value = false
    await navigateTo('/admin/orders')
  } catch (e: any) {
    alert(e?.data?.message ?? 'Failed to delete order')
  } finally {
    deleting.value = false
  }
}

useSeoMeta({
  title: computed(() => `Admin — Order #${orderId.value || '…'} — Hamro3D`),
  description: 'Admin order detail — commission tracking for Hamro3D.',
})
</script>
