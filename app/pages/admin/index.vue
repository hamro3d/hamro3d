<template>
  <div>
    <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
      <div class="mx-auto max-w-h3d-max">
        <p class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent">
          ADMIN
        </p>
        <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">
          Dashboard
        </h1>
      </div>
    </div>

    <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border border-h3d-border bg-h3d-surface p-6"
        >
          <p class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted">
            {{ stat.label }}
          </p>
          <p class="mt-3 font-h3d-display text-2xl font-light text-h3d-text md:text-3xl">
            <span v-if="pending" class="inline-block h-7 w-24 animate-pulse rounded bg-h3d-border" />
            <template v-else>{{ stat.value }}</template>
          </p>
        </div>
      </div>

      <!-- Recent orders -->
      <section class="mt-12 border border-h3d-border bg-h3d-surface">
        <div
          class="flex flex-col gap-4 border-b border-h3d-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 class="font-h3d-display text-xl font-light text-h3d-text">
            Recent orders
          </h2>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/admin/products"
              class="inline-flex border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
            >
              Manage Products
            </NuxtLink>
            <NuxtLink
              to="/admin/orders"
              class="inline-flex border border-h3d-border px-5 py-2.5 font-h3d-body text-2xs uppercase tracking-widest text-h3d-text transition-colors hover:border-h3d-accent hover:text-h3d-accent"
            >
              View All Orders
            </NuxtLink>
          </div>
        </div>

        <div class="overflow-x-auto">
          <!-- Loading skeleton -->
          <div v-if="pending" class="space-y-px">
            <div v-for="i in 5" :key="i" class="h-14 animate-pulse bg-h3d-border/30" />
          </div>

          <table v-else class="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr class="border-b border-h3d-border bg-h3d-base">
                <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Order ID</th>
                <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Customer</th>
                <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Date</th>
                <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Status</th>
                <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in recentOrders"
                :key="row.id"
                class="border-b border-h3d-border last:border-0 hover:bg-h3d-accent/[0.03] transition-colors"
              >
                <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">
                  <NuxtLink :to="`/admin/orders/${row.id}`" class="hover:text-h3d-accent transition-colors">
                    {{ row.id }}
                  </NuxtLink>
                </td>
                <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">{{ row.customer_name }}</td>
                <td class="px-6 py-4 font-h3d-body text-sm text-h3d-muted">
                  {{ formatDate(row.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="statusClass(row.status)"
                    class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest"
                  >
                    {{ row.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-h3d-body text-sm text-h3d-text tabular-nums">
                  NPR {{ formatNprPrice(row.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({
  title: 'Admin — Dashboard — Hamro3D',
  description: 'Studio overview for Hamro3D: commissions, revenue, and craft activity.',
})

const { data, pending } = await useFetch('/api/orders')

const statsData = computed(() => (data.value as any)?.stats ?? {})
const allOrders = computed(() => (data.value as any)?.orders ?? [])
const recentOrders = computed(() => allOrders.value.slice(0, 5))

function formatNprPrice(amount: number): string {
  return Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

function formatDate(ts: string): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusClass(status: string): string {
  switch (status) {
    case 'Delivered': return 'border-h3d-success/50 bg-h3d-success/10 text-h3d-success'
    case 'Shipped': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    case 'In craft': return 'border-h3d-accent/50 bg-h3d-accent/10 text-h3d-accent'
    default: return 'border-h3d-border bg-h3d-base text-h3d-muted'
  }
}

const stats = computed(() => [
  { label: 'Total revenue', value: `NPR ${formatNprPrice(statsData.value.totalRevenue ?? 0)}` },
  { label: 'Orders', value: String(statsData.value.totalOrders ?? 0) },
  { label: 'Active products', value: String(statsData.value.totalProducts ?? 0) },
  { label: 'Customers', value: String(statsData.value.totalUsers ?? 0) },
])
</script>
