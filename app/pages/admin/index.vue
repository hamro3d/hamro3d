<template>
  <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
    <div class="mx-auto max-w-h3d-max">
      <p
        class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent"
      >
        ADMIN
      </p>
      <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">
        Dashboard
      </h1>
    </div>
  </div>

  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border border-h3d-border bg-h3d-surface p-6"
      >
        <p class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted">
          {{ stat.label }}
        </p>
        <p class="mt-3 font-h3d-display text-2xl font-light text-h3d-text md:text-3xl">
          {{ stat.value }}
        </p>
      </div>
    </div>

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
            Add Product
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
        <table class="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr class="border-b border-h3d-border bg-h3d-base">
              <th
                class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
              >
                Order ID
              </th>
              <th
                class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
              >
                Customer
              </th>
              <th
                class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
              >
                Date
              </th>
              <th
                class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
              >
                Status
              </th>
              <th
                class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in recentOrders"
              :key="row.id"
              class="border-b border-h3d-border last:border-0"
            >
              <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">
                {{ row.id }}
              </td>
              <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">
                {{ row.customer }}
              </td>
              <td class="px-6 py-4 font-h3d-body text-sm text-h3d-muted">
                {{ row.date }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-block border border-h3d-border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent"
                >
                  {{ row.status }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-right font-h3d-body text-sm text-h3d-text"
              >
                {{ row.total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Admin — Dashboard — Hamro3D',
  description:
    'Studio overview for Hamro3D: commissions, revenue, and craft activity.',
})

const stats = [
  { label: 'Total revenue', value: 'NPR 245,000' },
  { label: 'Orders', value: '42' },
  { label: 'Products', value: '12' },
  { label: 'Customers', value: '156' },
]

const recentOrders = [
  {
    id: 'H3D-24089',
    customer: 'Priya K.',
    date: '6 May 2026',
    status: 'In craft',
    total: 'NPR 12,500',
  },
  {
    id: 'H3D-24088',
    customer: 'Sameer T.',
    date: '5 May 2026',
    status: 'Shipped',
    total: 'NPR 8,900',
  },
  {
    id: 'H3D-24087',
    customer: 'Anita S.',
    date: '4 May 2026',
    status: 'Awaiting review',
    total: 'NPR 15,200',
  },
  {
    id: 'H3D-24086',
    customer: 'Rajan B.',
    date: '3 May 2026',
    status: 'In craft',
    total: 'NPR 6,400',
  },
  {
    id: 'H3D-24085',
    customer: 'Mina L.',
    date: '2 May 2026',
    status: 'Delivered',
    total: 'NPR 22,000',
  },
]
</script>
