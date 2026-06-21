<template>
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10 sm:py-14">
    <header class="mb-10 border-b border-h3d-border pb-8 sm:mb-12">
      <p class="mb-3 font-h3d-body text-2xs uppercase tracking-[0.22em] text-h3d-accent">Admin</p>
      <h1 class="mb-2 font-h3d-display text-3xl font-light text-h3d-text sm:text-4xl">Orders</h1>
      <p class="font-h3d-body text-sm leading-relaxed text-h3d-muted">Track every commission from request to delivery.</p>
    </header>

    <!-- Loading -->
    <div v-if="pending" class="space-y-px border border-h3d-border bg-h3d-surface">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse bg-h3d-border/25" />
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Order ID</th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Customer</th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Pieces</th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Date</th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Status</th>
            <th class="px-6 py-3 text-right font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Total</th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in orders"
            :key="row.id"
            class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
          >
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">{{ row.id }}</td>
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">{{ row.customer_name }}</td>
            <td class="max-w-[240px] px-6 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ summarizeLines(row.lines) }}
            </td>
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-muted">{{ formatDate(row.created_at) }}</td>
            <td class="px-6 py-4">
              <span
                :class="statusClass(row.status)"
                class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right font-h3d-body text-sm tabular-nums text-h3d-text">
              NPR {{ fmt(row.total) }}
            </td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/admin/orders/${row.id}`"
                class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-accent"
              >View</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({
  title: 'Admin — Orders — Hamro3D',
  description: 'Track commissions and delivery status for Hamro3D.',
})

const { data, pending } = await useFetch('/api/orders')
const orders = computed(() => (data.value as any)?.orders ?? [])

function fmt(n: number) { return Number(n).toLocaleString('en-IN') }
function formatDate(ts: string) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
function summarizeLines(lines: any) {
  const arr = typeof lines === 'string' ? JSON.parse(lines) : lines
  if (!Array.isArray(arr)) return '—'
  return arr.map((l: any) => l.name).join(' · ')
}
function statusClass(status: string) {
  switch (status) {
    case 'Delivered': return 'border-h3d-success/50 bg-h3d-success/10 text-h3d-success'
    case 'Shipped': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'In craft': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    default: return 'border-h3d-border bg-h3d-base text-h3d-muted'
  }
}
</script>
