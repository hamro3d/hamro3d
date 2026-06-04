<script setup lang="ts">
import {
  formatNprPrice,
  getMockProductById,
  getRelatedMockProducts,
  type MockProductSocialVideo,
} from '~/data/mock-products'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

definePageMeta({
  validate(route) {
    const id = String(route.params.id)
    if (!/^\d+$/.test(id)) return false
    return getMockProductById(id) !== undefined
  },
})

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()

const product = computed(() => getMockProductById(String(route.params.id))!)
const isInWishlist = computed(() => wishlist.isSaved(product.value.id))

const relatedPieces = computed(() => getRelatedMockProducts(product.value))

const activeThumb = ref(0)
const quantity = ref(1)

// Ordered media: gif first (slot 0), then up to 10 images
type MediaItem = { src: string; isGif: boolean }
const mediaItems = computed<MediaItem[]>(() => {
  const p = product.value
  const items: MediaItem[] = []
  if (p.gif) items.push({ src: p.gif, isGif: true })
  for (const src of p.images.slice(0, 10)) {
    items.push({ src, isGif: false })
  }
  return items
})

// Gallery swipe / keyboard support
const galleryEl = ref<HTMLElement | null>(null)
const isAnimating = ref(false)
const slideDir = ref<'next' | 'prev'>('next')

function galleryGo(idx: number) {
  if (isAnimating.value || idx === activeThumb.value) return
  slideDir.value = idx > activeThumb.value ? 'next' : 'prev'
  isAnimating.value = true
  activeThumb.value = idx
  setTimeout(() => { isAnimating.value = false }, 400)
}

function galleryNext() {
  const total = mediaItems.value.length
  galleryGo((activeThumb.value + 1) % total)
}

function galleryPrev() {
  const total = mediaItems.value.length
  galleryGo((activeThumb.value - 1 + total) % total)
}

// Touch swipe
let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX
  if (Math.abs(dx) > 40) dx < 0 ? galleryNext() : galleryPrev()
}

// Keyboard navigation (only when gallery is focused)
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') galleryNext()
  else if (e.key === 'ArrowLeft') galleryPrev()
}

const materialOptions = computed(() =>
  product.value.material.map((label, i) => ({
    id: `${i}-${label}`,
    label,
  })),
)

const sizeOptions = computed(() =>
  product.value.size.value.map((v) => `${v}${product.value.size.unit}`),
)

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
  const step = product.value.processes.find((s) =>
    /craft|etch|print|cast|finish/i.test(s.title),
  )
  return step?.description ?? product.value.descriptions[0] ?? ''
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
  const mat = materialOptions.value.find((m) => m.id === selectedMaterial.value)
  const variantLabel = [selectedSize.value, mat?.label].filter(Boolean).join(' · ')
  for (let i = 0; i < quantity.value; i++) {
    cart.addItem(product.value.id, variantLabel)
  }
  showAddedToast()
}

function handleWishlistToggle() {
  wishlist.toggle(product.value.id)
}

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

const platformMeta: Record<MockProductSocialVideo['platform'], { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  tiktok:    { label: 'TikTok',    color: '#ffffff' },
  youtube:   { label: 'YouTube',   color: '#FF0000' },
  facebook:  { label: 'Facebook',  color: '#1877F2' },
}

useSeoMeta({
  title: computed(() => `${product.value.title} — Hamro3D`),
  description: computed(
    () =>
      product.value.descriptions[0] ??
      `Piece ${String(route.params.id)}. Crafted in Kathmandu.`,
  ),
  ogTitle: computed(() => `${product.value.title} — Hamro3D`),
  ogDescription: computed(() => product.value.subtitle),
  ogImage: computed(() => product.value.images[0] ?? '/og/piece.jpg'),
  ogLocale: 'en_NP',
})
</script>

<template>
  <div class="bg-h3d-base min-h-screen font-h3d-body text-h3d-text">

    <!-- Sticky breadcrumb — fixes to top below navbar on scroll -->
    <div class="sticky top-[68px] z-50 bg-h3d-base/90 backdrop-blur-sm border-b border-h3d-border">
      <nav
        class="mx-auto w-full max-w-h3d-max px-h3d-md py-3 font-h3d-body text-h3d-body-sm text-h3d-muted"
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
    </div>

    <div class="mx-auto w-full max-w-h3d-max px-h3d-md py-h3d-lg">

      <!-- Two columns: gallery + info -->
      <div class="grid grid-cols-1 gap-h3d-gutter lg:grid-cols-2 lg:items-start">
        <!-- Gallery -->
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <!-- Main swipeable image viewer -->
          <section
            ref="galleryEl"
            class="group relative rounded-xl overflow-hidden border border-h3d-border bg-h3d-base select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-h3d-accent"
            aria-label="Product image gallery"
            @keydown="onKeydown"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <!-- Atmospheric layers -->
            <div
              class="absolute inset-0 pointer-events-none z-0"
              style="background: radial-gradient(ellipse 75% 65% at 50% 45%, rgba(96,52,168,0.65) 0%, rgba(58,30,96,0.3) 55%, transparent 80%)"
              aria-hidden="true"
            />
            <div
              class="absolute inset-0 pointer-events-none z-10"
              style="background: radial-gradient(ellipse 100% 60% at 50% 115%, rgba(16,8,26,0.85) 0%, transparent 70%)"
              aria-hidden="true"
            />
            <div
              class="absolute inset-0 pointer-events-none z-10"
              style="background: radial-gradient(ellipse 130% 110% at 50% 50%, transparent 42%, rgba(16,8,26,0.5) 100%)"
              aria-hidden="true"
            />

            <!-- Signature badge -->
            <span
              v-if="product.id === 0"
              class="absolute left-h3d-sm top-h3d-sm font-h3d-body text-h3d-body-sm uppercase text-h3d-base z-30"
              style="letter-spacing: 0.18em"
            >
              <span class="bg-h3d-accent px-h3d-sm py-1">Signature piece</span>
            </span>

            <!-- Logo watermark -->
            <div class="absolute top-3.5 right-3.5 z-30 opacity-60">
              <NuxtImg src="/logo/C4907A-H3D-logo.png" alt="Hamro3D" class="w-7 h-7 object-contain" width="28" height="28" loading="lazy" />
            </div>

            <!-- Fixed-height media slot — gif or image, never collapses -->
            <div class="relative z-20 w-full" style="height: 460px;">
              <Transition name="gallery-fade">
                <!-- GIF slide — plain <img> so animation plays -->
                <img
                  v-if="mediaItems[activeThumb]?.isGif"
                  :key="`gif-${activeThumb}`"
                  :src="mediaItems[activeThumb]!.src"
                  :alt="`${product.title} — animated view`"
                  class="absolute inset-0 h-full w-full object-contain p-8"
                />
                <!-- Static image slide -->
                <NuxtImg
                  v-else-if="mediaItems[activeThumb]"
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
                  :key="`empty-${activeThumb}`"
                  class="absolute inset-0 flex items-center justify-center font-h3d-body text-h3d-body text-h3d-muted px-h3d-md text-center"
                >
                  Photography for this piece is coming soon.
                </p>
              </Transition>
            </div>

            <!-- Prev / Next arrow CTAs -->
            <template v-if="mediaItems.length > 1">
              <button
                type="button"
                class="absolute left-3 top-1/2 -translate-y-1/2 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-h3d-border bg-h3d-base/80 text-h3d-muted opacity-0 backdrop-blur-sm transition-all duration-300 hover:border-h3d-accent hover:text-h3d-accent group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-h3d-accent"
                aria-label="Previous"
                @click.stop="galleryPrev"
              >
                <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M10 3L5 8l5 5"/>
                </svg>
              </button>
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-h3d-border bg-h3d-base/80 text-h3d-muted opacity-0 backdrop-blur-sm transition-all duration-300 hover:border-h3d-accent hover:text-h3d-accent group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-h3d-accent"
                aria-label="Next"
                @click.stop="galleryNext"
              >
                <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5"/>
                </svg>
              </button>
            </template>

            <!-- Dot indicators + counter -->
            <div
              v-if="mediaItems.length > 1"
              class="absolute bottom-3 inset-x-0 z-40 flex items-center justify-center gap-3"
            >
              <div class="flex items-center gap-1.5">
                <button
                  v-for="(item, i) in mediaItems"
                  :key="i"
                  type="button"
                  class="rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-h3d-accent"
                  :class="[
                    activeThumb === i ? 'w-4 h-1.5 bg-h3d-accent' : 'w-1.5 h-1.5 bg-h3d-border hover:bg-h3d-muted',
                    item.isGif ? 'ring-1 ring-h3d-accent/40' : '',
                  ]"
                  :aria-label="`Go to ${item.isGif ? 'animated view' : `image ${i}`}`"
                  :aria-current="activeThumb === i ? 'true' : undefined"
                  @click.stop="galleryGo(i)"
                />
              </div>
              <span class="font-h3d-body text-h3d-body-sm text-h3d-muted tabular-nums">
                {{ activeThumb + 1 }}&thinsp;/&thinsp;{{ mediaItems.length }}
              </span>
            </div>

            <!-- Swipe hint mobile -->
            <p
              v-if="mediaItems.length > 1"
              class="pointer-events-none absolute bottom-10 inset-x-0 z-40 text-center font-h3d-body text-h3d-body-sm text-h3d-muted opacity-50 lg:hidden"
              aria-hidden="true"
            >
              Swipe to explore
            </p>

            <!-- Bottom accent line -->
            <div class="absolute bottom-0 inset-x-0 h-px z-30 bg-h3d-accent opacity-30" aria-hidden="true" />
          </section>

          <!-- Thumbnail strip — scrollable row for 11 items -->
          <div
            v-if="mediaItems.length > 1"
            class="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
          >
            <button
              v-for="(item, i) in mediaItems"
              :key="item.src + i"
              type="button"
              class="relative rounded-lg flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent sm:h-[4.5rem] sm:w-[4.5rem]"
              :class="
                activeThumb === i
                  ? 'border-h3d-accent border-2 bg-h3d-base shadow-[0_0_14px_rgba(196,144,122,0.40)]'
                  : 'border-h3d-border bg-h3d-base hover:border-h3d-accent opacity-70 hover:opacity-100'
              "
              :aria-pressed="activeThumb === i"
              :aria-label="`View ${item.isGif ? 'animated' : `image ${i}`}`"
              @click="galleryGo(i)"
            >
              <!-- GIF thumbnail -->
              <template v-if="item.isGif">
                <img :src="item.src" alt="" class="h-full w-full object-contain p-1.5" />
                <!-- GIF badge -->
                <span class="absolute bottom-0.5 right-0.5 rounded-sm bg-h3d-accent px-1 font-h3d-body leading-none text-h3d-base" style="font-size: 8px; padding-top: 2px; padding-bottom: 2px;">GIF</span>
              </template>
              <!-- Static image thumbnail -->
              <NuxtImg v-else :src="item.src" alt="" class="h-full w-full object-contain p-1.5" loading="lazy" sizes="72px" />
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

          <!-- ── Collection + Tags ── -->
          <div class="space-y-3">
            <!-- Category pill -->
            <div class="flex items-center gap-2">
              <span class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted" style="letter-spacing: 0.14em">Collection</span>
              <NuxtLink
                to="/products"
                class="inline-flex items-center gap-1.5 rounded-full border border-h3d-accent/40 bg-h3d-surface px-3 py-1 font-h3d-body text-2xs text-h3d-accent transition-colors hover:border-h3d-accent hover:bg-h3d-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              >
                <svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <path d="M5 0L6.18 3.82 10 5 6.18 6.18 5 10 3.82 6.18 0 5 3.82 3.82 5 0z"/>
                </svg>
                {{ product.category }}
              </NuxtLink>
            </div>
            <!-- Tags -->
            <div v-if="product.tags?.length" class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="inline-block rounded-sm border border-h3d-border/60 bg-h3d-base px-2.5 py-0.5 font-h3d-body text-2xs text-h3d-muted transition-colors hover:border-h3d-accent/50 hover:text-h3d-text"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- ── See it in action ── -->
          <div v-if="product.socialVideos?.length" class="space-y-3">
            <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted" style="letter-spacing: 0.14em">
              See it in action
            </p>
            <div class="flex flex-col gap-2">
              <a
                v-for="video in product.socialVideos"
                :key="video.url + video.label"
                :href="video.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group/sv flex items-center gap-3 rounded-lg border border-h3d-border/60 bg-h3d-surface px-4 py-2.5 transition-all duration-200 hover:border-h3d-accent/50 hover:bg-h3d-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              >
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" :style="`background: ${platformMeta[video.platform].color}22`">
                  <svg v-if="video.platform === 'instagram'" class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" stroke-width="1.8"/>
                    <circle cx="12" cy="12" r="5" stroke="#E1306C" stroke-width="1.8"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
                  </svg>
                  <svg v-else-if="video.platform === 'tiktok'" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" fill="#ffffff"/>
                  </svg>
                  <svg v-else-if="video.platform === 'youtube'" class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" fill="#FF0000"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                  </svg>
                  <svg v-else-if="video.platform === 'facebook'" class="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block font-h3d-body text-h3d-body-sm text-h3d-text group-hover/sv:text-h3d-accent transition-colors duration-200 leading-snug truncate">{{ video.label }}</span>
                  <span class="block font-h3d-body text-2xs text-h3d-muted/70 uppercase tracking-wider">{{ platformMeta[video.platform].label }}</span>
                </span>
                <svg class="h-4 w-4 shrink-0 text-h3d-muted/50 transition-transform duration-200 group-hover/sv:translate-x-0.5 group-hover/sv:text-h3d-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- ── Material + Size options ── -->
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

          <!-- Details label -->
          <p class="font-h3d-body text-h3d-body-sm uppercase text-h3d-muted" style="letter-spacing: 0.14em">
            Details
          </p>

          <!-- Details tabs — toned down so image remains primary focus -->
          <div
            class="overflow-hidden rounded-lg border border-h3d-border/60"
            style="background: rgba(27,14,40,0.5)"
          >
            <!-- Tab bar -->
            <div
              class="relative flex border-b border-h3d-border/50 px-2 pt-1.5 gap-0.5"
              style="background: rgba(16,8,26,0.35)"
              role="tablist"
              aria-label="Piece details"
            >
              <button
                v-for="tab in ([
                  { key: 'description', label: 'Description' },
                  { key: 'process',     label: 'Our process' },
                  { key: 'care',        label: 'Care' },
                ] as const)"
                :id="`tab-${tab.key}`"
                :key="tab.key"
                type="button"
                role="tab"
                :aria-selected="activeTab === tab.key"
                :aria-controls="`panel-${tab.key}`"
                class="relative flex-1 rounded-t-md px-3 py-2 font-h3d-body text-h3d-body-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                :class="activeTab === tab.key ? 'text-h3d-muted' : 'text-h3d-muted hover:text-h3d-text'"
                @click="activeTab = tab.key"
              >
                <span
                  v-if="activeTab === tab.key"
                  class="absolute bottom-0 inset-x-3 h-px bg-h3d-accent opacity-60"
                  aria-hidden="true"
                />
                <span class="relative">{{ tab.label }}</span>
              </button>
            </div>

            <!-- Panel grid — all panels in DOM so container never collapses (zero layout shift) -->
            <div class="relative grid">

              <!-- Description -->
              <div
                id="panel-description"
                role="tabpanel"
                aria-labelledby="tab-description"
                class="col-start-1 row-start-1 h3d-tab-panel"
                :class="activeTab === 'description' ? 'h3d-tab-panel--active' : 'h3d-tab-panel--hidden'"
                :aria-hidden="activeTab !== 'description'"
              >
                <div
                  v-if="product.descriptions[0]"
                  class="border-l-2 border-h3d-accent/50 pl-3 mx-h3d-md mt-h3d-md mb-3"
                >
                  <p class="font-h3d-body text-h3d-body text-h3d-muted leading-relaxed">
                    {{ product.descriptions[0] }}
                  </p>
                </div>
                <div class="px-h3d-md pb-h3d-md space-y-2.5">
                  <p
                    v-for="(para, idx) in product.descriptions.slice(1)"
                    :key="idx"
                    class="font-h3d-body text-h3d-body-sm text-h3d-muted/80 leading-relaxed"
                  >
                    {{ para }}
                  </p>
                </div>
              </div>

              <!-- Our process — numbered steps -->
              <div
                id="panel-process"
                role="tabpanel"
                aria-labelledby="tab-process"
                class="col-start-1 row-start-1 px-h3d-md py-h3d-md h3d-tab-panel"
                :class="activeTab === 'process' ? 'h3d-tab-panel--active' : 'h3d-tab-panel--hidden'"
                :aria-hidden="activeTab !== 'process'"
              >
                <ol class="space-y-0">
                  <li
                    v-for="(step, idx) in product.processes"
                    :key="idx"
                    class="relative flex gap-3"
                  >
                    <div class="flex flex-col items-center">
                      <div
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-h3d-border font-h3d-body font-medium text-h3d-muted/70"
                        style="background: rgba(58,36,80,0.4); font-size: 11px;"
                      >
                        {{ idx + 1 }}
                      </div>
                      <div
                        v-if="idx < product.processes.length - 1"
                        class="mt-1 w-px flex-1 bg-h3d-border/40"
                        style="min-height: 18px"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="pb-4">
                      <p class="font-h3d-body text-h3d-body-sm font-medium text-h3d-muted" style="letter-spacing: 0.04em">
                        {{ step.title.replace(/:$/, '') }}
                      </p>
                      <p class="mt-0.5 font-h3d-body text-h3d-body-sm text-h3d-muted/70 leading-relaxed">
                        {{ step.description }}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <!-- Care — icon bullets -->
              <div
                id="panel-care"
                role="tabpanel"
                aria-labelledby="tab-care"
                class="col-start-1 row-start-1 px-h3d-md py-h3d-md h3d-tab-panel"
                :class="activeTab === 'care' ? 'h3d-tab-panel--active' : 'h3d-tab-panel--hidden'"
                :aria-hidden="activeTab !== 'care'"
              >
                <ul class="space-y-3">
                  <li
                    v-for="(line, idx) in product.care"
                    :key="idx"
                    class="flex gap-2.5"
                  >
                    <span class="mt-1 shrink-0 text-h3d-accent/60" aria-hidden="true">
                      <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 13c1-5 5-8 10-9.5C11.5 8 8 11.5 3 13z"/>
                        <path d="M3 13 8 8"/>
                      </svg>
                    </span>
                    <p class="font-h3d-body text-h3d-body-sm text-h3d-muted/80 leading-relaxed">{{ line }}</p>
                  </li>
                </ul>
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
