<script setup lang="ts">
import { mockProducts } from '~/data/mock-products'
import { useWishlistStore } from '~/stores/wishlist'

const wishlist = useWishlistStore()

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('featured')

const sortedProducts = computed(() => {
  const list = [...mockProducts]
  switch (sortBy.value) {
    case 'featured':
      return list.sort((a, b) => a.rank - b.rank)
    case 'name':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case 'price-low':
      return list.sort((a, b) => a.price - b.price)
    case 'price-high':
      return list.sort((a, b) => b.price - a.price)
    default:
      return list
  }
})

useSeoMeta({
  title: 'Products — Hamro3D',
  description: 'Browse Hamro3D keepsakes — figurines, litholamps, nameplates, and gifts made to be kept.',
})
</script>

<template>
  <div class="min-h-screen bg-h3d-base text-h3d-text font-h3d-body">
    <!-- Page header -->
    <header class="relative overflow-hidden bg-h3d-surface border-b border-h3d-border">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(196,144,122,0.18),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_50%,rgba(58,36,80,0.45),transparent_65%)]"
        aria-hidden="true"
      />
      <div class="relative z-10 max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-10 sm:py-12 lg:py-14">
        <nav class="mb-6" aria-label="Breadcrumb">
          <ol
            class="flex flex-wrap items-center gap-x-2 gap-y-1 font-h3d-body text-2xs tracking-wide text-h3d-muted uppercase"
          >
            <li>
              <NuxtLink to="/" class="text-h3d-muted transition-colors hover:text-h3d-text"> Home </NuxtLink>
            </li>
            <li aria-hidden="true" class="text-h3d-border">/</li>
            <li class="text-h3d-text" aria-current="page">Products</li>
          </ol>
        </nav>
        <p
          class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase mb-4"
        >
          Our collection
        </p>
        <h1
          class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text mb-4 leading-tight"
        >
          Gifts made to be kept
        </h1>
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted max-w-2xl leading-relaxed">
          Each piece is crafted to carry a story — for weddings, festivals, quiet remembrance, and the
          everyday moments you never want to lose.
        </p>
      </div>
    </header>

    <!-- Toolbar + listing -->
    <div class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-10 sm:py-12">
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-h3d-border pb-6 mb-8"
      >
        <p class="font-h3d-body text-sm text-h3d-muted">
          Showing <span class="text-h3d-text tabular-nums">{{ sortedProducts.length }}</span> pieces
        </p>
        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
          <label class="sr-only" for="collection-sort">Sort pieces</label>
          <select
            id="collection-sort"
            v-model="sortBy"
            class="font-h3d-body text-2xs tracking-widest uppercase bg-h3d-surface text-h3d-text border border-h3d-border px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-h3d-accent"
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-low">Price · Low to high</option>
            <option value="price-high">Price · High to low</option>
          </select>
          <fieldset class="m-0 min-w-0 border-0 p-0">
            <legend class="sr-only">Layout</legend>
            <div class="inline-flex rounded-none border border-h3d-border bg-h3d-surface">
              <button
                type="button"
                :class="[
                  'px-3 py-2 font-h3d-body text-2xs tracking-widest uppercase transition-colors border-r border-h3d-border',
                  viewMode === 'grid'
                    ? 'bg-h3d-accent text-h3d-base'
                    : 'text-h3d-muted hover:text-h3d-text',
                ]"
                :aria-pressed="viewMode === 'grid'"
                @click="viewMode = 'grid'"
              >
                Grid
              </button>
              <button
                type="button"
                :class="[
                  'px-3 py-2 font-h3d-body text-2xs tracking-widest uppercase transition-colors',
                  viewMode === 'list'
                    ? 'bg-h3d-accent text-h3d-base'
                    : 'text-h3d-muted hover:text-h3d-text',
                ]"
                :aria-pressed="viewMode === 'list'"
                @click="viewMode = 'list'"
              >
                List
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Product grid / list -->
      <div
        :class="
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
            : 'flex flex-col gap-5'
        "
      >
        <H3dProductCard
          v-for="product in sortedProducts"
          :key="product.id"
          :product="product"
          variant="collection"
          :list-mode="viewMode === 'list'"
        />
      </div>

    </div>
  </div>
</template>
