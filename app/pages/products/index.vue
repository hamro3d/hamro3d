<script setup lang="ts">
import { mockProducts, type MockProductCategory } from '~/data/mock-products'

const route = useRoute()

// ── Derive unique filter options from catalogue ─────────────────────────────
const allCategories = computed<MockProductCategory[]>(() => {
  const set = new Set(mockProducts.map((p) => p.category))
  return [...set].sort() as MockProductCategory[]
})

const allMaterials = computed<string[]>(() => {
  const set = new Set(mockProducts.flatMap((p) => p.material))
  return [...set].sort()
})

const allTags = computed<string[]>(() => {
  const set = new Set(mockProducts.flatMap((p) => p.tags ?? []))
  return [...set].sort()
})

const priceMin = computed(() => Math.min(...mockProducts.map((p) => p.price)))
const priceMax = computed(() => Math.max(...mockProducts.map((p) => p.price)))

// ── State ───────────────────────────────────────────────────────────────────
const viewMode   = ref<'grid' | 'list'>('grid')
const sortBy     = ref('signature')
const filtersOpen = ref(false)

// Active (applied) filters — pre-populate from URL query if present
const initialCategory = route.query.category ? [String(route.query.category)] : []
const selectedCategories = ref<string[]>(initialCategory)
const selectedMaterials  = ref<string[]>([])
const selectedTags       = ref<string[]>([])
const priceRange         = ref<[number, number]>([priceMin.value, priceMax.value])
const hasGifOnly         = ref(false)

// Draft filters (local to the panel while it's open — committed on Apply)
const draftCategories = ref<string[]>([])
const draftMaterials  = ref<string[]>([])
const draftTags       = ref<string[]>([])
const draftPriceRange = ref<[number, number]>([priceMin.value, priceMax.value])
const draftGifOnly    = ref(false)

// Sync draft ← applied when panel opens
function openFilters() {
  draftCategories.value = [...selectedCategories.value]
  draftMaterials.value  = [...selectedMaterials.value]
  draftTags.value       = [...selectedTags.value]
  draftPriceRange.value = [...priceRange.value] as [number, number]
  draftGifOnly.value    = hasGifOnly.value
  filtersOpen.value     = true
}

// Commit draft → applied and close
function applyFilters() {
  selectedCategories.value = [...draftCategories.value]
  selectedMaterials.value  = [...draftMaterials.value]
  selectedTags.value       = [...draftTags.value]
  priceRange.value         = [...draftPriceRange.value] as [number, number]
  hasGifOnly.value         = draftGifOnly.value
  filtersOpen.value        = false
}

function clearDraftFilters() {
  draftCategories.value = []
  draftMaterials.value  = []
  draftTags.value       = []
  draftPriceRange.value = [priceMin.value, priceMax.value]
  draftGifOnly.value    = false
}

function clearAllFilters() {
  clearDraftFilters()
  selectedCategories.value = []
  selectedMaterials.value  = []
  selectedTags.value       = []
  priceRange.value         = [priceMin.value, priceMax.value]
  hasGifOnly.value         = false
}

// Draft filter count (shown inside the open panel)
const draftFilterCount = computed(() =>
  draftCategories.value.length +
  draftMaterials.value.length +
  draftTags.value.length +
  (draftGifOnly.value ? 1 : 0) +
  (draftPriceRange.value[0] !== priceMin.value || draftPriceRange.value[1] !== priceMax.value ? 1 : 0),
)

// Active filter count (for the toolbar badge — reflects applied state)
const activeFilterCount = computed(() =>
  selectedCategories.value.length +
  selectedMaterials.value.length +
  selectedTags.value.length +
  (hasGifOnly.value ? 1 : 0) +
  (priceRange.value[0] !== priceMin.value || priceRange.value[1] !== priceMax.value ? 1 : 0),
)

// NOTE: In Vue 3 <script setup>, refs passed from the template are auto-unwrapped.
// So we must accept the actual Ref objects and NOT use them as plain arrays.
// We pass specific named refs and use a switch to identify which to mutate.
function toggleCategory(cat: string) {
  const idx = draftCategories.value.indexOf(cat)
  draftCategories.value = idx === -1
    ? [...draftCategories.value, cat]
    : draftCategories.value.filter((v: string) => v !== cat)
}

function toggleMaterial(mat: string) {
  const idx = draftMaterials.value.indexOf(mat)
  draftMaterials.value = idx === -1
    ? [...draftMaterials.value, mat]
    : draftMaterials.value.filter((v: string) => v !== mat)
}

function toggleTag(tag: string) {
  const idx = draftTags.value.indexOf(tag)
  draftTags.value = idx === -1
    ? [...draftTags.value, tag]
    : draftTags.value.filter((v: string) => v !== tag)
}

// Remove a single applied filter from the pill row (without opening panel)
function removeApplied(type: 'category' | 'material' | 'tag' | 'gif' | 'price', val?: string) {
  if (type === 'category' && val) selectedCategories.value = selectedCategories.value.filter((v: string) => v !== val)
  if (type === 'material' && val) selectedMaterials.value  = selectedMaterials.value.filter((v: string) => v !== val)
  if (type === 'tag'      && val) selectedTags.value       = selectedTags.value.filter((v: string) => v !== val)
  if (type === 'gif')             hasGifOnly.value         = false
  if (type === 'price')           priceRange.value         = [priceMin.value, priceMax.value]
}

// ── Filtered + sorted list ──────────────────────────────────────────────────
const filteredProducts = computed(() => {
  let list = [...mockProducts]

  if (selectedCategories.value.length)
    list = list.filter((p) => selectedCategories.value.includes(p.category))

  if (selectedMaterials.value.length)
    list = list.filter((p) => p.material.some((m) => selectedMaterials.value.includes(m)))

  if (selectedTags.value.length)
    list = list.filter((p) => (p.tags ?? []).some((t) => selectedTags.value.includes(t)))

  if (hasGifOnly.value)
    list = list.filter((p) => !!p.gif)

  list = list.filter(
    (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1],
  )

  switch (sortBy.value) {
    // Signature-first: signature pieces float to top by rank, then remaining by rank
    case 'signature':
      list.sort((a, b) => {
        const aSig = a.isSignaturePiece ? 0 : 1
        const bSig = b.isSignaturePiece ? 0 : 1
        return aSig !== bSig ? aSig - bSig : a.rank - b.rank
      })
      break
    case 'rank-low':      list.sort((a, b) => a.rank - b.rank); break
    case 'rank-high':     list.sort((a, b) => b.rank - a.rank); break
    case 'name-asc':      list.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'name-desc':     list.sort((a, b) => b.title.localeCompare(a.title)); break
    case 'price-low':     list.sort((a, b) => a.price - b.price); break
    case 'price-high':    list.sort((a, b) => b.price - a.price); break
  }

  return list
})

function formatPrice(n: number) {
  return `NPR ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

useSeoMeta({
  title: 'Our Collection',
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
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 font-h3d-body text-2xs tracking-wide text-h3d-muted uppercase">
            <li><NuxtLink to="/" class="text-h3d-muted transition-colors hover:text-h3d-text">Home</NuxtLink></li>
            <li aria-hidden="true" class="text-h3d-border">/</li>
            <li class="text-h3d-text" aria-current="page">Products</li>
          </ol>
        </nav>
        <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase mb-4">Our collection</p>
        <h1 class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text mb-4 leading-tight">
          Gifts made to be kept
        </h1>
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted max-w-2xl leading-relaxed">
          Each piece is crafted to carry a story — for weddings, festivals, quiet remembrance, and the everyday moments you never want to lose.
        </p>
      </div>
    </header>

    <!-- Main content -->
    <div class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-10 sm:py-12">

      <!-- ── Toolbar ─────────────────────────────────────────────────────── -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-h3d-border pb-5 mb-0">

        <!-- Left: count + filter toggle -->
        <div class="flex items-center gap-3">
          <p class="font-h3d-body text-sm text-h3d-muted">
            Showing <span class="text-h3d-text tabular-nums font-medium">{{ filteredProducts.length }}</span>
            <span class="text-h3d-muted"> of {{ mockProducts.length }}</span>
            pieces
          </p>

          <!-- Active filter pills (quick-clear) -->
          <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="cat in selectedCategories"
              :key="`cat-${cat}`"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-h3d-accent/40 bg-h3d-surface px-2 py-0.5 font-h3d-body text-2xs text-h3d-accent hover:bg-h3d-accent/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              :aria-label="`Remove filter: ${cat}`"
              @click="removeApplied('category', cat)"
            >
              {{ cat }}
              <svg class="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>
            </button>
            <button
              v-for="mat in selectedMaterials"
              :key="`mat-${mat}`"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-h3d-border/70 bg-h3d-surface px-2 py-0.5 font-h3d-body text-2xs text-h3d-muted hover:border-h3d-accent/50 hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              :aria-label="`Remove filter: ${mat}`"
              @click="removeApplied('material', mat)"
            >
              {{ mat }}
              <svg class="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>
            </button>
            <button
              v-for="tag in selectedTags"
              :key="`tag-${tag}`"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-h3d-border/70 bg-h3d-surface px-2 py-0.5 font-h3d-body text-2xs text-h3d-muted hover:border-h3d-accent/50 hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              :aria-label="`Remove tag filter: ${tag}`"
              @click="removeApplied('tag', tag)"
            >
              #{{ tag }}
              <svg class="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>
            </button>
            <button
              v-if="hasGifOnly"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-h3d-border/70 bg-h3d-surface px-2 py-0.5 font-h3d-body text-2xs text-h3d-muted hover:border-h3d-accent/50 hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              aria-label="Remove GIF preview filter"
              @click="removeApplied('gif')"
            >
              GIF preview
              <svg class="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>
            </button>
            <button
              v-if="priceRange[0] !== priceMin || priceRange[1] !== priceMax"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-h3d-border/70 bg-h3d-surface px-2 py-0.5 font-h3d-body text-2xs text-h3d-muted hover:border-h3d-accent/50 hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              @click="removeApplied('price')"
            >
              {{ formatPrice(priceRange[0]) }} – {{ formatPrice(priceRange[1]) }}
              <svg class="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>
            </button>
            <button
              type="button"
              class="font-h3d-body text-2xs text-h3d-muted/60 underline underline-offset-2 hover:text-h3d-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
              @click="clearAllFilters"
            >
              Clear all
            </button>
          </div>
        </div>

        <!-- Right: filter toggle + sort + view -->
        <div class="flex flex-wrap items-center gap-3">

          <!-- Filter toggle button -->
          <button
            type="button"
            class="relative inline-flex items-center gap-2 border px-3 py-2 font-h3d-body text-2xs tracking-widest uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
            :class="filtersOpen
              ? 'border-h3d-accent bg-h3d-surface text-h3d-accent'
              : 'border-h3d-border bg-h3d-surface text-h3d-muted hover:border-h3d-accent hover:text-h3d-text'"
            :aria-expanded="filtersOpen"
            @click="filtersOpen ? (filtersOpen = false) : openFilters()"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" stroke-linecap="round"/>
            </svg>
            Filters
            <!-- Active badge -->
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-h3d-accent font-h3d-body text-h3d-base"
              style="font-size: 9px"
            >{{ activeFilterCount }}</span>
          </button>

          <!-- Sort -->
          <label class="sr-only" for="collection-sort">Sort pieces</label>
          <select
            id="collection-sort"
            v-model="sortBy"
            class="font-h3d-body text-2xs tracking-widest uppercase bg-h3d-surface text-h3d-text border border-h3d-border px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-h3d-accent appearance-none"
          >
            <optgroup label="Relevance">
              <option value="signature">Signature first</option>
              <option value="rank-low">Rank · Best first</option>
              <option value="rank-high">Rank · Last first</option>
            </optgroup>
            <optgroup label="Name">
              <option value="name-asc">Name · A → Z</option>
              <option value="name-desc">Name · Z → A</option>
            </optgroup>
            <optgroup label="Price">
              <option value="price-low">Price · Low to high</option>
              <option value="price-high">Price · High to low</option>
            </optgroup>
          </select>

          <!-- View toggle -->
          <fieldset class="m-0 min-w-0 border-0 p-0">
            <legend class="sr-only">Layout</legend>
            <div class="inline-flex border border-h3d-border bg-h3d-surface">
              <button
                type="button"
                :class="['px-3 py-2 font-h3d-body text-2xs tracking-widest uppercase transition-colors border-r border-h3d-border', viewMode === 'grid' ? 'bg-h3d-accent text-h3d-base' : 'text-h3d-muted hover:text-h3d-text']"
                :aria-pressed="viewMode === 'grid'"
                @click="viewMode = 'grid'"
              >Grid</button>
              <button
                type="button"
                :class="['px-3 py-2 font-h3d-body text-2xs tracking-widest uppercase transition-colors', viewMode === 'list' ? 'bg-h3d-accent text-h3d-base' : 'text-h3d-muted hover:text-h3d-text']"
                :aria-pressed="viewMode === 'list'"
                @click="viewMode = 'list'"
              >List</button>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- ── Filter panel (collapsible) ─────────────────────────────────── -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="filtersOpen"
          class="border border-t-0 border-h3d-border bg-h3d-surface mb-8"
          aria-label="Filter options"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-h3d-border/50">

            <!-- Collection / Category -->
            <div class="p-5">
              <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3" style="letter-spacing:0.16em">Collection</p>
              <div class="space-y-1">
                <button
                  v-for="cat in allCategories"
                  :key="cat"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded px-1 py-1 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent group/f"
                  :aria-pressed="draftCategories.includes(cat)"
                  @click="toggleCategory(cat)"
                >
                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150"
                    :class="draftCategories.includes(cat)
                      ? 'border-h3d-accent bg-h3d-accent'
                      : 'border-h3d-border bg-h3d-base group-hover/f:border-h3d-accent/60'"
                    aria-hidden="true"
                  >
                    <svg v-if="draftCategories.includes(cat)" class="h-2.5 w-2.5 text-h3d-base" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="font-h3d-body text-h3d-body-sm select-none transition-colors flex-1" :class="draftCategories.includes(cat) ? 'text-h3d-text' : 'text-h3d-muted group-hover/f:text-h3d-text'">{{ cat }}</span>
                  <span class="font-h3d-body text-2xs text-h3d-muted/50 tabular-nums">{{ mockProducts.filter(p => p.category === cat).length }}</span>
                </button>
              </div>
            </div>

            <!-- Material -->
            <div class="p-5">
              <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3" style="letter-spacing:0.16em">Material</p>
              <div class="space-y-1">
                <button
                  v-for="mat in allMaterials"
                  :key="mat"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded px-1 py-1 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent group/f"
                  :aria-pressed="draftMaterials.includes(mat)"
                  @click="toggleMaterial(mat)"
                >
                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150"
                    :class="draftMaterials.includes(mat)
                      ? 'border-h3d-accent bg-h3d-accent'
                      : 'border-h3d-border bg-h3d-base group-hover/f:border-h3d-accent/60'"
                    aria-hidden="true"
                  >
                    <svg v-if="draftMaterials.includes(mat)" class="h-2.5 w-2.5 text-h3d-base" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="font-h3d-body text-h3d-body-sm select-none transition-colors flex-1" :class="draftMaterials.includes(mat) ? 'text-h3d-text' : 'text-h3d-muted group-hover/f:text-h3d-text'">{{ mat }}</span>
                  <span class="font-h3d-body text-2xs text-h3d-muted/50 tabular-nums">{{ mockProducts.filter(p => p.material.includes(mat)).length }}</span>
                </button>
              </div>
            </div>

            <!-- Price range + GIF preview -->
            <div class="p-5 space-y-6">
              <!-- Price -->
              <div>
                <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3" style="letter-spacing:0.16em">Price range</p>
                <div class="space-y-3">
                  <div class="flex items-center justify-between font-h3d-body text-h3d-body-sm text-h3d-muted tabular-nums">
                    <span>{{ formatPrice(draftPriceRange[0]) }}</span>
                    <span>{{ formatPrice(draftPriceRange[1]) }}</span>
                  </div>
                  <!-- Track visual -->
                  <div class="relative h-1 bg-h3d-border rounded-full">
                    <div
                      class="absolute inset-y-0 rounded-full bg-h3d-accent/50"
                      :style="{
                        left: `${((draftPriceRange[0] - priceMin) / (priceMax - priceMin)) * 100}%`,
                        right: `${100 - ((draftPriceRange[1] - priceMin) / (priceMax - priceMin)) * 100}%`,
                      }"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="draft-price-min" class="sr-only">Minimum price</label>
                    <input
                      id="draft-price-min"
                      type="range"
                      :min="priceMin"
                      :max="priceMax"
                      :step="50"
                      :value="draftPriceRange[0]"
                      class="h3d-range w-full"
                      @input="draftPriceRange = [Math.min(Number(($event.target as HTMLInputElement).value), draftPriceRange[1] - 50), draftPriceRange[1]]"
                    />
                    <label for="draft-price-max" class="sr-only">Maximum price</label>
                    <input
                      id="draft-price-max"
                      type="range"
                      :min="priceMin"
                      :max="priceMax"
                      :step="50"
                      :value="draftPriceRange[1]"
                      class="h3d-range w-full"
                      @input="draftPriceRange = [draftPriceRange[0], Math.max(Number(($event.target as HTMLInputElement).value), draftPriceRange[0] + 50)]"
                    />
                  </div>
                </div>
              </div>

              <!-- GIF preview -->
              <div>
                <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3" style="letter-spacing:0.16em">Preview</p>
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded px-1 py-1 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent group/f"
                  :aria-pressed="draftGifOnly"
                  @click="draftGifOnly = !draftGifOnly"
                >
                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150"
                    :class="draftGifOnly ? 'border-h3d-accent bg-h3d-accent' : 'border-h3d-border bg-h3d-base group-hover/f:border-h3d-accent/60'"
                    aria-hidden="true"
                  >
                    <svg v-if="draftGifOnly" class="h-2.5 w-2.5 text-h3d-base" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="font-h3d-body text-h3d-body-sm select-none transition-colors flex-1" :class="draftGifOnly ? 'text-h3d-text' : 'text-h3d-muted group-hover/f:text-h3d-text'">Animated GIF preview</span>
                  <span class="font-h3d-body text-2xs text-h3d-muted/50 tabular-nums">{{ mockProducts.filter(p => !!p.gif).length }}</span>
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div class="p-5">
              <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3" style="letter-spacing:0.16em">Tags</p>
              <div class="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
                <button
                  v-for="tag in allTags"
                  :key="tag"
                  type="button"
                  class="inline-block rounded-sm border px-2 py-0.5 font-h3d-body text-2xs transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-h3d-accent"
                  :class="draftTags.includes(tag)
                    ? 'border-h3d-accent bg-h3d-accent/15 text-h3d-accent'
                    : 'border-h3d-border/60 bg-h3d-base text-h3d-muted hover:border-h3d-accent/50 hover:text-h3d-text'"
                  @click="toggleTag(tag)"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>

          </div>

          <!-- Filter footer -->
          <div class="flex items-center justify-between border-t border-h3d-border/50 px-5 py-3 gap-3">
            <!-- Clear all — secondary -->
            <button
              type="button"
              class="inline-flex items-center gap-1.5 font-h3d-body text-2xs uppercase tracking-widest border border-h3d-border px-4 py-2 text-h3d-muted transition-colors hover:border-h3d-accent/60 hover:text-h3d-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              :disabled="draftFilterCount === 0"
              :class="draftFilterCount === 0 ? 'opacity-40 cursor-not-allowed' : ''"
              @click="clearDraftFilters"
            >
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round"/>
              </svg>
              Clear all filters
            </button>

            <!-- Apply — primary -->
            <button
              type="button"
              class="inline-flex items-center gap-2 bg-h3d-accent px-6 py-2 font-h3d-body text-2xs uppercase tracking-widest text-h3d-base transition-colors hover:bg-h3d-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              @click="applyFilters"
            >
              Apply filters
              <span v-if="draftFilterCount > 0" class="flex h-4 w-4 items-center justify-center rounded-full bg-h3d-base/30 font-h3d-body tabular-nums" style="font-size:9px">{{ draftFilterCount }}</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- ── Empty state ─────────────────────────────────────────────────── -->
      <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <svg class="h-10 w-10 text-h3d-border mb-5" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
          <rect x="4" y="4" width="32" height="32" rx="4"/><circle cx="15" cy="15" r="4"/><path d="M4 28l10-8 6 6 5-4 11 10"/>
        </svg>
        <p class="font-h3d-display text-xl font-light text-h3d-text mb-2">No pieces match your filters</p>
        <p class="font-h3d-body text-sm text-h3d-muted mb-6 max-w-xs leading-relaxed">Try removing a filter or broadening your search to see more of our collection.</p>
        <button
          type="button"
          class="font-h3d-body text-2xs uppercase tracking-widest border border-h3d-border px-5 py-2.5 text-h3d-muted hover:border-h3d-accent hover:text-h3d-accent transition-colors"
          @click="clearAllFilters"
        >
          Clear all filters
        </button>
      </div>

      <!-- ── Product grid / list ─────────────────────────────────────────── -->
      <TransitionGroup
        v-else
        name="h3d-card"
        tag="div"
        :class="viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
          : 'flex flex-col gap-5'"
      >
        <H3dProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          variant="collection"
          :list-mode="viewMode === 'list'"
        />
      </TransitionGroup>

    </div>
  </div>
</template>

<style scoped>
/*
  Range input pseudo-elements cannot use Tailwind utility classes.
  We define local CSS vars mirroring the h3d design token values so the
  design system intent is preserved in a single place.
*/
.h3d-range {
  --h3d-accent-val: #c4907a;
  --h3d-base-val: #1a0e24;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}
.h3d-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: var(--h3d-accent-val);
  border: 2px solid var(--h3d-base-val);
  cursor: pointer;
  margin-top: -6px;
}
.h3d-range::-webkit-slider-runnable-track {
  height: 2px;
  background: transparent;
}
.h3d-range::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: var(--h3d-accent-val);
  border: 2px solid var(--h3d-base-val);
  cursor: pointer;
}
.h3d-range:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--h3d-accent-val);
  outline-offset: 2px;
}
</style>
