<script setup lang="ts">
import {
  formatNprPrice,
  getMockProductById,
  getRelatedMockProducts,
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
    <div class="mx-auto w-full max-w-h3d-max px-h3d-md py-h3d-lg">
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
        <div class="lg:sticky lg:top-h3d-md lg:self-start">
          <div
            class="relative flex h-[420px] w-full items-center justify-center overflow-hidden border border-h3d-border bg-h3d-surface"
          >
            <span
              v-if="product.id === 0"
              class="absolute left-h3d-sm top-h3d-sm font-h3d-body text-h3d-body-sm uppercase text-h3d-base z-10"
              style="letter-spacing: 0.18em"
            >
              <span class="bg-h3d-accent px-h3d-sm py-1">Signature piece</span>
            </span>
            <img
              v-if="product.images[activeThumb]"
              :src="product.images[activeThumb]"
              :alt="`${product.title} — view ${activeThumb + 1}`"
              class="max-h-full max-w-full object-contain"
              loading="lazy"
              decoding="async"
            />
            <p
              v-else
              class="font-h3d-body text-h3d-body text-h3d-muted px-h3d-md text-center"
            >
              Photography for this piece is coming soon.
            </p>
            <p
              v-if="product.images.length"
              class="absolute bottom-h3d-sm right-h3d-sm font-h3d-body text-h3d-body-sm text-h3d-muted tabular-nums"
            >
              {{ activeThumb + 1 }} / {{ product.images.length }}
            </p>
          </div>

          <div
            v-if="product.images.length > 1"
            class="mt-h3d-sm flex flex-wrap gap-2"
          >
            <button
              v-for="(src, i) in product.images"
              :key="src + i"
              type="button"
              class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border text-h3d-body-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent sm:h-[4.5rem] sm:w-[4.5rem]"
              :class="
                activeThumb === i
                  ? 'border-h3d-accent bg-h3d-surface text-h3d-text'
                  : 'border-h3d-border bg-h3d-base text-h3d-muted hover:border-h3d-accent hover:text-h3d-text'
              "
              :aria-pressed="activeThumb === i"
              :aria-label="`View image ${i + 1}`"
              @click="activeThumb = i"
            >
              <img :src="src" alt="" class="h-full w-full object-cover" loading="lazy" />
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
        <div class="grid grid-cols-2 gap-h3d-gutter lg:grid-cols-4">
          <NuxtLink
            v-for="p in relatedPieces"
            :key="p.id"
            :to="`/products/${p.id}`"
            class="group border border-h3d-border bg-h3d-surface transition-colors duration-300 hover:border-h3d-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
          >
            <div class="aspect-h3d-product relative overflow-hidden border-b border-h3d-border bg-h3d-base">
              <img
                v-if="p.images[0]"
                :src="p.images[0]"
                :alt="p.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <span
                v-else
                class="flex h-full items-center justify-center font-h3d-body text-h3d-body-sm text-h3d-muted"
              >Preview</span>
            </div>
            <div class="p-h3d-sm">
              <p class="font-h3d-display text-h3d-h4 text-h3d-text group-hover:text-h3d-accent">
                {{ p.title }}
              </p>
              <p class="mt-1 font-h3d-body text-h3d-body-sm text-h3d-muted">
                NPR {{ formatNprPrice(p.price) }}
              </p>
            </div>
          </NuxtLink>
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
