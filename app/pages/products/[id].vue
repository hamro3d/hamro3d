<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

definePageMeta({
  validate(route) {
    const id = String(route.params.id)
    return /^\d+$/.test(id)
  },
})

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()

const productId = computed(() => route.params.id as string)

const { data: rawProduct, pending } = await useFetch(() => `/api/products/${productId.value}`)
const { data: allProductsData } = await useFetch('/api/products?status=Active')

function formatNprPrice(amount: number): string {
  return Number(amount).toLocaleString('en-IN')
}

const product = computed(() => {
  const p = rawProduct.value as any
  if (!p) return null

  const parseJson = (val: any) => {
    if (!val) return []
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return [] }
    }
    return val
  }
  const parseJsonObj = (val: any) => {
    if (!val) return {}
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return {} }
    }
    return val
  }

  return {
    ...p,
    images: parseJson(p.images),
    material: parseJson(p.material),
    size: parseJsonObj(p.size),
    related_product_ids: parseJson(p.related_product_ids),
    descriptions: parseJson(p.descriptions),
    processes: parseJson(p.processes),
    care: parseJson(p.care),
  }
})

const isInWishlist = computed(() => {
  if (!product.value) return false
  return wishlist.isSaved(product.value.id)
})

const relatedPieces = computed(() => {
  if (!product.value) return []
  const ids = product.value.related_product_ids ?? []
  const list = (allProductsData.value as any[]) ?? []
  
  const parseJson = (val: any) => {
    if (!val) return []
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return [] }
    }
    return val
  }

  return ids
    .map((rid: any) => list.find((p) => p.id === Number(rid)))
    .filter((p: any) => p !== undefined)
    .map((p: any) => ({
      ...p,
      images: parseJson(p.images)
    }))
})

const activeThumb = ref(0)
const quantity = ref(1)

// ── Gallery system (images only — API products have no gif field) ─────────
type MediaItem = { src: string; isGif: false }
const mediaItems = computed<MediaItem[]>(() => {
  const p = product.value
  if (!p?.images?.length) return []
  return p.images.slice(0, 10).map((src: string) => ({ src, isGif: false as const }))
})

const galleryEl      = ref<HTMLElement | null>(null)
const isAnimating    = ref(false)
const slideDir       = ref<'next' | 'prev'>('next')

function galleryGo(idx: number) {
  if (isAnimating.value || idx === activeThumb.value) return
  slideDir.value = idx > activeThumb.value ? 'next' : 'prev'
  isAnimating.value = true
  activeThumb.value = idx
  setTimeout(() => { isAnimating.value = false }, 400)
}

function galleryNext() {
  const total = mediaItems.value.length
  if (!total) return
  galleryGo((activeThumb.value + 1) % total)
}

function galleryPrev() {
  const total = mediaItems.value.length
  if (!total) return
  galleryGo((activeThumb.value - 1 + total) % total)
}

let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX
  if (Math.abs(dx) > 40) dx < 0 ? galleryNext() : galleryPrev()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') galleryNext()
  else if (e.key === 'ArrowLeft') galleryPrev()
}



const materialOptions = computed(() => {
  if (!product.value) return []
  return product.value.material.map((label: string, i: number) => ({
    id: `${i}-${label}`,
    label,
  }))
})

const sizeOptions = computed(() => {
  if (!product.value?.size?.value) return []
  return product.value.size.value.map((v: number) => `${v}${product.value.size.unit}`)
})

const selectedMaterial = ref('')
const selectedSize = ref('')

type TabKey = 'description' | 'process' | 'care'
const activeTab = ref<TabKey>('description')

function syncSelectors() {
  const mats = materialOptions.value
  selectedMaterial.value = mats[0]?.id ?? ''
  const sizes = sizeOptions.value
  const mid = Math.max(0, Math.floor((sizes.length - 1) / 2))
  selectedSize.value = sizes[mid] ?? sizes[0] ?? ''
}

watch(
  () => route.params.id,
  () => {
    activeThumb.value = 0
    quantity.value = 1
    activeTab.value = 'description'
    syncSelectors()
  },
)

watch(product, syncSelectors, { immediate: true })

const craftLeadLine = computed(() => {
  if (!product.value) return ''
  const step = product.value.processes?.find((s: any) =>
    /craft|etch|print|cast|finish/i.test(s.title),
  )
  return step?.description ?? product.value.descriptions?.[0] ?? ''
})

const showToast = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function bumpQuantity(delta: number) {
  const next = quantity.value + delta
  if (next >= 1 && next <= 10) {
    quantity.value = next
  }
}

function showAddedToast() {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  showToast.value = true
  toastTimer = setTimeout(() => {
    showToast.value = false
    toastTimer = null
  }, 3200)
}

function handleCommission() {
  if (!product.value) return
  const mat = materialOptions.value.find((m) => m.id === selectedMaterial.value)
  const variantLabel = [selectedSize.value, mat?.label].filter(Boolean).join(' · ')
  for (let i = 0; i < quantity.value; i++) {
    cart.addItem({
      id: product.value.id,
      title: product.value.title,
      head: product.value.head,
      price: product.value.price,
      images: product.value.images,
    }, variantLabel)
  }
  showAddedToast()
}

function handleWishlistToggle() {
  if (!product.value) return
  wishlist.toggle(product.value.id)
}

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

useSeoMeta({
  title: computed(() => product.value ? `${product.value.title} — Hamro3D` : 'Product Details — Hamro3D'),
  description: computed(
    () =>
      product.value?.descriptions?.[0] ??
      `Piece ${String(route.params.id)}. Crafted in Kathmandu.`,
  ),
  ogTitle: computed(() => product.value ? `${product.value.title} — Hamro3D` : 'Product Details — Hamro3D'),
  ogDescription: computed(() => product.value?.subtitle ?? ''),
  ogImage: computed(() => product.value?.images?.[0] ?? '/og/piece.jpg'),
  ogLocale: 'en_NP',
})
</script>

<template>
  <div class="bg-h3d-base min-h-screen font-h3d-body text-h3d-text">
    <div v-if="pending" class="mx-auto w-full max-w-h3d-max px-h3d-md py-h3d-lg flex items-center justify-center min-h-[400px]">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-h3d-accent border-t-transparent" />
    </div>
    <div v-else-if="!product" class="mx-auto w-full max-w-h3d-max px-h3d-md py-h3d-lg text-center py-20">
      <h1 class="font-h3d-display text-2xl font-light mb-4 text-h3d-text">Product not found</h1>
      <NuxtLink to="/products" class="text-h3d-accent underline">Back to Products</NuxtLink>
    </div>
    <div v-else class="mx-auto w-full max-w-h3d-max px-h3d-md py-h3d-lg">
      <!-- Breadcrumb -->
      <nav
        class="font-h3d-body text-h3d-body-sm text-h3d-muted mb-h3d-md"
        aria-label="Breadcrumb"
      >
        <ol class="flex flex-wrap items-center gap-2">
          <li>
            <NuxtLink
              to="/"
              class="text-h3d-muted transition-colors duration-300 hover:text-h3d-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
            >
              Home
            </NuxtLink>
          </li>
          <li aria-hidden="true" class="text-h3d-border">/</li>
          <li>
            <NuxtLink
              to="/products"
              class="text-h3d-muted transition-colors duration-300 hover:text-h3d-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
            >
              Products
            </NuxtLink>
          </li>
          <li aria-hidden="true" class="text-h3d-border">/</li>
          <li class="text-h3d-text" aria-current="page">
            {{ product.title }}
          </li>
        </ol>
      </nav>

      <!-- Two columns: gallery + info -->
      <div class="grid grid-cols-1 gap-h3d-gutter lg:grid-cols-2 lg:items-start">
        <!-- Gallery -->
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <!-- Main swipeable image viewer -->
          <section
            ref="galleryEl"
            class="group relative rounded-xl overflow-hidden border border-h3d-border bg-h3d-base select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-h3d-accent"
            aria-label="Product image gallery"
            tabindex="0"
            @keydown="onKeydown"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <!-- Atmosphere layers -->
            <div class="absolute inset-0 pointer-events-none z-0" style="background: radial-gradient(ellipse 75% 65% at 50% 45%, rgba(96,52,168,0.65) 0%, rgba(58,30,96,0.3) 55%, transparent 80%)" aria-hidden="true" />
            <div class="absolute inset-0 pointer-events-none z-10" style="background: radial-gradient(ellipse 100% 60% at 50% 115%, rgba(16,8,26,0.85) 0%, transparent 70%)" aria-hidden="true" />

            <!-- Logo watermark -->
            <div class="absolute top-3.5 right-3.5 z-30 opacity-60">
              <NuxtImg src="/logo/C4907A-H3D-logo.png" alt="Hamro3D" class="w-7 h-7 object-contain" width="28" height="28" loading="lazy" />
            </div>

            <!-- Fixed-height media slot -->
            <div class="relative z-20 w-full" style="height: 460px;">
              <Transition name="gallery-fade">
                <NuxtImg
                  v-if="mediaItems[activeThumb]"
                  :key="activeThumb"
                  :src="mediaItems[activeThumb]!.src"
                  :alt="`${product.title} — view ${activeThumb + 1}`"
                  class="absolute inset-0 h-full w-full object-contain p-8"
                  loading="lazy"
                  decoding="async"
                  sizes="sm:100vw md:60vw lg:50vw"
                />
                <p
                  v-else
                  class="absolute inset-0 flex items-center justify-center font-h3d-body text-h3d-body text-h3d-muted px-h3d-md text-center"
                >
                  Photography for this piece is coming soon.
                </p>
              </Transition>
            </div>

            <!-- Counter -->
            <p
              v-if="mediaItems.length > 1"
              class="absolute bottom-h3d-sm right-h3d-sm z-30 font-h3d-body text-h3d-body-sm text-h3d-muted tabular-nums"
            >
              {{ activeThumb + 1 }} / {{ mediaItems.length }}
            </p>

            <!-- Prev / Next arrows -->
            <button
              v-if="mediaItems.length > 1"
              type="button"
              class="absolute left-3 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-h3d-border bg-h3d-base/60 text-h3d-muted opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:border-h3d-accent hover:text-h3d-accent focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
              aria-label="Previous image"
              @click.stop="galleryPrev"
            >
              <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button
              v-if="mediaItems.length > 1"
              type="button"
              class="absolute right-3 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-h3d-border bg-h3d-base/60 text-h3d-muted opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:border-h3d-accent hover:text-h3d-accent focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
              aria-label="Next image"
              @click.stop="galleryNext"
            >
              <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </section>

          <!-- Thumbnail strip -->
          <div
            v-if="mediaItems.length > 1"
            class="mt-h3d-sm flex flex-wrap gap-2"
            role="list"
            aria-label="Image thumbnails"
          >
            <button
              v-for="(item, i) in mediaItems"
              :key="item.src + i"
              type="button"
              role="listitem"
              class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent sm:h-[4.5rem] sm:w-[4.5rem]"
              :class="activeThumb === i ? 'border-h3d-accent bg-h3d-surface' : 'border-h3d-border bg-h3d-base hover:border-h3d-accent'"
              :aria-pressed="activeThumb === i"
              :aria-label="`View image ${i + 1}`"
              @click="galleryGo(i)"
            >
              <NuxtImg :src="item.src" alt="" class="h-full w-full object-contain p-1.5" loading="lazy" sizes="72px" />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="space-y-h3d-md">
          <p
            class="font-h3d-body text-h3d-h5 uppercase text-h3d-accent"
            style="letter-spacing: 0.2em"
          >
            {{ product.head }}
          </p>
          <h1 class="font-h3d-display text-h3d-h2 text-h3d-text">
            {{ product.title }}
          </h1>
          <p class="font-h3d-body text-h3d-lead text-h3d-muted leading-relaxed">
            {{ product.subtitle }}
          </p>
          <div class="h-px w-full max-w-md bg-h3d-accent" />
          <div>
            <p class="font-h3d-display text-h3d-h3 text-h3d-text">
              NPR {{ formatNprPrice(product.price) }}
            </p>
            <p class="mt-1 font-h3d-body text-h3d-body-sm text-h3d-muted">
              {{ product.priceNote }}
            </p>
          </div>

          <!-- Options -->
          <div class="space-y-h3d-sm">
            <p class="font-h3d-body text-h3d-body-sm uppercase text-h3d-muted" style="letter-spacing: 0.14em">
              Material
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="m in materialOptions"
                :key="m.id"
                type="button"
                class="rounded-sm border px-h3d-sm py-2 font-h3d-body text-h3d-body-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="
                  selectedMaterial === m.id
                    ? 'border-h3d-accent bg-h3d-surface text-h3d-text'
                    : 'border-h3d-border bg-h3d-base text-h3d-muted hover:border-h3d-accent hover:text-h3d-text'
                "
                :aria-pressed="selectedMaterial === m.id"
                @click="selectedMaterial = m.id"
              >
                {{ m.label }}
              </button>
            </div>
          </div>

          <div class="space-y-h3d-sm">
            <p class="font-h3d-body text-h3d-body-sm uppercase text-h3d-muted" style="letter-spacing: 0.14em">
              Size
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in sizeOptions"
                :key="s"
                type="button"
                class="min-w-[4.5rem] rounded-sm border px-h3d-sm py-2 font-h3d-body text-h3d-body-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="
                  selectedSize === s
                    ? 'border-h3d-accent bg-h3d-surface text-h3d-text'
                    : 'border-h3d-border bg-h3d-base text-h3d-muted hover:border-h3d-accent hover:text-h3d-text'
                "
                :aria-pressed="selectedSize === s"
                @click="selectedSize = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <!-- <div class="space-y-h3d-sm">
            <p class="font-h3d-body text-h3d-body-sm uppercase text-h3d-muted" style="letter-spacing: 0.14em">
              Quantity
            </p>
            <div class="inline-flex items-center border border-h3d-border bg-h3d-surface">
              <button
                type="button"
                class="px-h3d-sm py-2 font-h3d-body text-h3d-body text-h3d-text transition-colors hover:bg-h3d-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
                :disabled="quantity <= 1"
                @click="bumpQuantity(-1)"
              >
                −
              </button>
              <span class="min-w-[3rem] px-2 text-center font-h3d-body text-h3d-body text-h3d-text" aria-live="polite">
                {{ quantity }}
              </span>
              <button
                type="button"
                class="px-h3d-sm py-2 font-h3d-body text-h3d-body text-h3d-text transition-colors hover:bg-h3d-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
                :disabled="quantity >= 10"
                @click="bumpQuantity(1)"
              >
                +
              </button>
            </div>
          </div> -->

          <!-- CTAs -->
          <!-- <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center bg-h3d-accent px-h3d-md py-3 font-h3d-body text-h3d-cta uppercase tracking-wide text-h3d-base transition-colors duration-300 hover:bg-h3d-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              style="letter-spacing: 0.22em"
              @click="handleCommission"
            >
              Commission This Piece
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center border px-h3d-md py-3 font-h3d-body text-h3d-cta uppercase tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              :class="isInWishlist
                ? 'border-h3d-accent bg-h3d-accent text-h3d-base hover:bg-h3d-accent-hover'
                : 'border-h3d-border bg-transparent text-h3d-text hover:border-h3d-accent hover:text-h3d-accent'"
              style="letter-spacing: 0.18em"
              @click="handleWishlistToggle"
            >
              {{ isInWishlist ? 'Saved' : 'Save to Memories' }}
            </button>
          </div> -->

          <!-- Specs -->
          <!-- <div class="grid grid-cols-2 gap-px border border-h3d-border bg-h3d-border">
            <div class="bg-h3d-surface p-h3d-sm">
              <p class="font-h3d-body text-h3d-h5 uppercase text-h3d-muted" style="letter-spacing: 0.12em">Process</p>
              <p class="mt-1 font-h3d-body text-h3d-body text-h3d-text">{{ product.processes[0]?.title.replace(/:$/, '') ?? '—' }}</p>
            </div>
            <div class="bg-h3d-surface p-h3d-sm">
              <p class="font-h3d-body text-h3d-h5 uppercase text-h3d-muted" style="letter-spacing: 0.12em">Material</p>
              <p class="mt-1 font-h3d-body text-h3d-body text-h3d-text">{{ product.material.join(' · ') }}</p>
            </div>
            <div class="bg-h3d-surface p-h3d-sm">
              <p class="font-h3d-body text-h3d-h5 uppercase text-h3d-muted" style="letter-spacing: 0.12em">Lead time</p>
              <p class="mt-1 font-h3d-body text-h3d-body text-h3d-text line-clamp-4">{{ craftLeadLine }}</p>
            </div>
            <div class="bg-h3d-surface p-h3d-sm">
              <p class="font-h3d-body text-h3d-h5 uppercase text-h3d-muted" style="letter-spacing: 0.12em">Origin</p>
              <p class="mt-1 font-h3d-body text-h3d-body text-h3d-text">Made in Nepal</p>
            </div>
          </div> -->

          <!-- Tabs -->
          <p class="font-h3d-body text-h3d-body-sm uppercase text-h3d-muted" style="letter-spacing: 0.14em">
            Details
          </p>
          <div class="border border-h3d-border bg-h3d-surface">
            <div
              class="flex flex-wrap border-b border-h3d-border"
              role="tablist"
              aria-label="Piece details"
            >
              <button
                id="tab-desc"
                type="button"
                role="tab"
                class="flex-1 min-w-[8rem] px-h3d-sm py-3 font-h3d-body text-h3d-body-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="activeTab === 'description' ? 'text-h3d-text border-b-2 border-h3d-accent -mb-px' : 'text-h3d-muted hover:text-h3d-text'"
                :aria-selected="activeTab === 'description'"
                aria-controls="panel-desc"
                @click="activeTab = 'description'"
              >
                Description
              </button>
              <button
                id="tab-process"
                type="button"
                role="tab"
                class="flex-1 min-w-[8rem] px-h3d-sm py-3 font-h3d-body text-h3d-body-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="activeTab === 'process' ? 'text-h3d-text border-b-2 border-h3d-accent -mb-px' : 'text-h3d-muted hover:text-h3d-text'"
                :aria-selected="activeTab === 'process'"
                aria-controls="panel-process"
                @click="activeTab = 'process'"
              >
                Our process
              </button>
              <button
                id="tab-care"
                type="button"
                role="tab"
                class="flex-1 min-w-[8rem] px-h3d-sm py-3 font-h3d-body text-h3d-body-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="activeTab === 'care' ? 'text-h3d-text border-b-2 border-h3d-accent -mb-px' : 'text-h3d-muted hover:text-h3d-text'"
                :aria-selected="activeTab === 'care'"
                aria-controls="panel-care"
                @click="activeTab = 'care'"
              >
                Care
              </button>
            </div>

            <div class="p-h3d-md">
              <div
                v-show="activeTab === 'description'"
                id="panel-desc"
                role="tabpanel"
                aria-labelledby="tab-desc"
                class="font-h3d-body text-h3d-body text-h3d-muted leading-relaxed space-y-4"
              >
                <p v-for="(para, idx) in product.descriptions" :key="idx">
                  {{ para }}
                </p>
              </div>
              <div
                v-show="activeTab === 'process'"
                id="panel-process"
                role="tabpanel"
                aria-labelledby="tab-process"
                class="font-h3d-body text-h3d-body text-h3d-muted leading-relaxed space-y-5"
              >
                <div v-for="(step, idx) in product.processes" :key="idx">
                  <p class="font-medium text-h3d-text">{{ step.title.replace(/:$/, '') }}</p>
                  <p class="mt-1">{{ step.description }}</p>
                </div>
              </div>
              <div
                v-show="activeTab === 'care'"
                id="panel-care"
                role="tabpanel"
                aria-labelledby="tab-care"
                class="font-h3d-body text-h3d-body text-h3d-muted leading-relaxed space-y-4"
              >
                <p v-for="(line, idx) in product.care" :key="idx">
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related -->
      <section class="mt-h3d-lg border-t border-h3d-border pt-h3d-lg" aria-labelledby="related-heading">
        <h2 id="related-heading" class="font-h3d-display text-h3d-h3 text-h3d-text mb-h3d-md">
          Related pieces
        </h2>
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <H3dProductCard
            v-for="p in relatedPieces"
            :key="p.id"
            :product="p"
            variant="related"
          />
        </div>
      </section>

    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-3 opacity-0"
    >
      <output
        v-show="showToast"
        class="pointer-events-none fixed bottom-h3d-md left-1/2 z-50 w-[min(100%,22rem)] -translate-x-1/2 px-h3d-md"
        aria-live="polite"
      >
        <div
          class="border border-h3d-border bg-h3d-surface px-h3d-md py-h3d-sm text-center font-h3d-body text-h3d-body-sm text-h3d-text shadow-h3d-card"
        >
          Added to your collection
        </div>
      </output>
    </Transition>
  </div>
</template>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.3s ease;
}
.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}
</style>
