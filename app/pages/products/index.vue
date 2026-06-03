<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'

const wishlist = useWishlistStore()

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('featured')

const { data, pending } = await useFetch('/api/products?status=Active')

function formatNprPrice(amount: number): string {
  return Number(amount).toLocaleString('en-IN')
}

const products = computed(() => {
  const list = (data.value as any[]) ?? []
  return list.map((p) => {
    let imagesArr: string[] = []
    if (p.images) {
      if (Array.isArray(p.images)) {
        imagesArr = p.images
      } else if (typeof p.images === 'string') {
        // Try parsing JSON array; if fails, treat as single URL string
        try {
          const parsed = JSON.parse(p.images)
          imagesArr = Array.isArray(parsed) ? parsed : [p.images]
        } catch {
          imagesArr = [p.images]
        }
      }
    }
    return {
      ...p,
      images: imagesArr,
    }
  })
})

const sortedProducts = computed(() => {
  const list = [...products.value]
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
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
            : 'flex flex-col gap-6'
        "
      >
        <NuxtLink
          v-for="product in sortedProducts"
          :key="product.id"
          :to="`/products/${product.id}`"
          :class="[
            'group border border-h3d-border bg-h3d-surface transition-all hover:border-h3d-accent',
            viewMode === 'grid'
              ? 'block hover:-translate-y-0.5'
              : 'flex flex-col sm:flex-row sm:items-stretch hover:-translate-y-0',
          ]"
        >
          <!-- Image + wishlist -->
          <div
            :class="[
              'aspect-square bg-h3d-base flex items-center justify-center border-b border-h3d-border relative overflow-hidden',
              viewMode === 'list' ? 'sm:aspect-auto sm:w-52 sm:min-h-[200px] md:w-60' : '',
            ]"
          >
            <img
              v-if="product.images[0]"
              :src="product.images[0]"
              :alt="product.title"
              class="absolute inset-0 h-full w-full object-contain p-4"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else
              class="w-14 h-20 bg-h3d-border border border-h3d-border-light flex items-center justify-center opacity-70"
              aria-hidden="true"
            />
            <!--
            <button
              type="button"
              class="absolute top-3 right-3 bg-transparent border-none p-1 cursor-pointer transition-opacity z-10"
              :class="wishlist.isSaved(product.id) ? 'opacity-100' : 'opacity-40 hover:opacity-100'"
              :aria-label="wishlist.isSaved(product.id) ? `Remove ${product.title} from saved memories` : `Save ${product.title} to saved memories`"
              @click.prevent.stop="wishlist.toggle(product.id)"
            >
              <svg
                viewBox="0 0 24 24"
                class="w-5 h-5 stroke-h3d-accent pointer-events-none"
                :class="wishlist.isSaved(product.id) ? 'fill-h3d-accent' : 'fill-none'"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                />
              </svg>
            </button>
            -->
          </div>

          <!-- Body -->
          <div
            :class="[
              'p-5 sm:p-6 flex flex-col justify-center flex-1 min-w-0',
              viewMode === 'list' ? 'sm:pl-8 sm:pr-6' : '',
            ]"
          >
            <div class="w-10 h-px bg-h3d-accent mb-4" aria-hidden="true" />
            <p class="font-h3d-body text-2xs text-h3d-accent tracking-wide uppercase mb-2">
              {{ product.head }}
            </p>
            <h2
              class="font-h3d-display text-xl sm:text-2xl font-light text-h3d-text mb-3 leading-snug group-hover:text-h3d-accent transition-colors"
            >
              {{ product.title }}
            </h2>
            <p class="font-h3d-body text-sm text-h3d-muted">
              From <span class="text-h3d-text tabular-nums">NPR {{ formatNprPrice(product.price) }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
