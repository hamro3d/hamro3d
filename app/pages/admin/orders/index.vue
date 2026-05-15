<template>
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10 sm:py-14">
    <header class="mb-10 border-b border-h3d-border pb-8 sm:mb-12">
      <p class="mb-3 font-h3d-body text-2xs uppercase tracking-[0.22em] text-h3d-accent">
        Admin
      </p>
      <h1 class="mb-2 font-h3d-display text-3xl font-light text-h3d-text sm:text-4xl">
        Orders
      </h1>
      <p class="font-h3d-body text-sm leading-relaxed text-h3d-muted">
        Track every commission from request to delivery.
      </p>
    </header>

    <!-- Table -->
    <div class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Order ID
            </th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Customer
            </th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Pieces
            </th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Date
            </th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Status
            </th>
            <th class="px-6 py-3 text-right font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              Total
            </th>
            <th class="px-6 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in orders"
            :key="row.id"
            class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
          >
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">
              {{ row.id }}
            </td>
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-text">
              {{ row.customer }}
            </td>
            <td class="max-w-[280px] px-6 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ row.summary }}
            </td>
            <td class="px-6 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ row.date }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="adminStatusBadgeClass(row.status)"
                class="inline-flex items-center border px-2.5 py-1 font-h3d-body text-2xs font-semibold uppercase tracking-widest"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right font-h3d-body text-sm tabular-nums text-h3d-text">
              NPR {{ formatNprPrice(row.totalNpr) }}
            </td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/admin/orders/${row.id}`"
                class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-accent"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MockAdminOrderStatus } from '~/data/mock-admin-orders'
import { mockAdminOrders } from '~/data/mock-admin-orders'
import { formatNprPrice } from '~/data/mock-products'

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: 'Admin — Orders — Hamro3D',
  description: 'Track commissions and delivery status for Hamro3D.',
})

const orders = mockAdminOrders

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
</script>
