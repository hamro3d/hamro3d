<template>
  <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
    <div
      class="mx-auto flex max-w-h3d-max flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p
          class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent"
        >
          Admin
        </p>
        <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">
          Products
        </h1>
      </div>
      <NuxtLink
        to="/admin/products"
        class="inline-flex w-fit border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
      >
        Add Product
      </NuxtLink>
    </div>
  </div>

  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
    <div class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            />
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Name
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Collection
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Price
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Stock
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Status
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-h3d-border last:border-0"
          >
            <td class="px-5 py-4">
              <div
                class="flex h-14 w-14 items-center justify-center border border-h3d-border bg-h3d-base"
                aria-hidden="true"
              >
                <span class="font-h3d-body text-2xs text-h3d-muted">IMG</span>
              </div>
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">
              {{ product.name }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ product.category }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">
              {{ product.price }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ product.stock }}
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-block border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest"
                :class="
                  product.status === 'Active'
                    ? 'border-h3d-accent text-h3d-accent'
                    : 'border-h3d-border text-h3d-muted'
                "
              >
                {{ product.status }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <button
                type="button"
                class="mr-3 border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                class="border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Admin — Products — Hamro3D',
  description:
    'Manage Hamro3D products: memory lamps, nameplates, and keepsakes.',
})

const products = [
  {
    id: '1',
    name: 'Heritage nameplate — devanagari',
    category: 'Nameplates',
    price: 'NPR 4,500',
    stock: 18,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Memory litholamp — warm glow',
    category: 'Litholamps',
    price: 'NPR 8,200',
    stock: 9,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Moon lamp — remembrance',
    category: 'Moon lamps',
    price: 'NPR 6,900',
    stock: 14,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Keepsake keychain pair',
    category: 'Keychains',
    price: 'NPR 1,800',
    stock: 42,
    status: 'Active',
  },
  {
    id: '5',
    name: 'Family silhouette puzzle',
    category: 'Puzzles',
    price: 'NPR 5,600',
    stock: 11,
    status: 'Draft',
  },
  {
    id: '6',
    name: 'Mini figurine — tender pose',
    category: 'Figurines',
    price: 'NPR 12,000',
    stock: 6,
    status: 'Active',
  },
]
</script>
