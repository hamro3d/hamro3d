<script setup lang="ts">
import type { MockProduct } from '~/data/mock-products'
import { formatNprPrice } from '~/data/mock-products'

const props = defineProps<{
  product: MockProduct
  /** 'collection' shows head + full price row, 'related' shows compact layout */
  variant?: 'collection' | 'related'
  /** When true, renders side-by-side image + text (list view) */
  listMode?: boolean
  /** Extra classes on the wrapping link */
  cardClass?: string
}>()

const variant = computed(() => props.variant ?? 'collection')

// Hover-gif: reveal after 1 s of continuous hover, hide immediately on leave
const showGif = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function onMouseEnter() {
  if (!props.product.gif) return
  hoverTimer = setTimeout(() => { showGif.value = true }, 150)
}

function onMouseLeave() {
  if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
  showGif.value = false
}

onUnmounted(() => {
  if (hoverTimer) clearTimeout(hoverTimer)
})
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group relative rounded-xl overflow-hidden border border-h3d-border bg-h3d-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-h3d-accent hover:shadow-[0_8px_40px_rgba(196,144,122,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
    :class="[listMode ? 'flex flex-col sm:flex-row sm:items-stretch' : 'flex flex-col', cardClass]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Image area -->
    <div
      class="relative overflow-hidden bg-h3d-base"
      :class="listMode
        ? 'aspect-square sm:aspect-auto sm:w-56 sm:min-h-[220px] md:w-64 shrink-0'
        : 'aspect-[4/4.2]'"
    >
      <!-- Atmospheric gradients -->
      <div
        class="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-75 group-hover:opacity-100"
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

      <!-- Static product image — hidden while GIF is playing -->
      <Transition name="img-hide">
        <NuxtImg
          v-if="product.images[0] && !showGif"
          :src="product.images[0]"
          :alt="product.title"
          class="absolute inset-0 h-full w-full object-contain z-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          :class="variant === 'related' ? 'p-5' : 'p-6'"
          loading="lazy"
          decoding="async"
          :sizes="variant === 'related' ? 'sm:50vw md:33vw lg:25vw' : 'sm:100vw md:50vw lg:33vw'"
        />
      </Transition>
      <span
        v-if="!product.images[0] && !showGif"
        class="absolute inset-0 flex items-center justify-center font-h3d-body text-h3d-body-sm text-h3d-muted z-0"
        aria-hidden="true"
      >Preview</span>

      <!-- GIF overlay — only rendered when product has a gif; fades in after 1 s hover -->
      <Transition v-if="product.gif" name="gif-reveal">
        <img
          v-if="showGif"
          :src="product.gif"
          :alt="`${product.title} — animated preview`"
          class="absolute inset-0 h-full w-full object-contain z-20"
          :class="variant === 'related' ? 'p-5' : 'p-6'"
          aria-hidden="true"
        />
      </Transition>

      <!-- Logo watermark -->
      <div
        class="absolute z-30 opacity-50 group-hover:opacity-80 transition-opacity duration-300"
        :class="variant === 'related' ? 'top-2.5 right-2.5' : 'top-3.5 right-3.5'"
      >
        <NuxtImg
          src="/logo/C4907A-H3D-logo.png"
          alt="Hamro3D"
          class="object-contain"
          :class="variant === 'related' ? 'w-5 h-5' : 'w-7 h-7'"
          :width="variant === 'related' ? 20 : 28"
          :height="variant === 'related' ? 20 : 28"
          loading="lazy"
        />
      </div>

      <!-- Bottom accent line -->
      <div class="absolute bottom-0 inset-x-0 h-px z-30 bg-h3d-accent opacity-30 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true" />
    </div>

    <!-- Text body -->
    <div
      class="flex flex-col justify-center bg-h3d-surface flex-1 min-w-0"
      :class="[
        variant === 'related' ? 'px-4 py-3' : 'px-5 py-4 sm:px-6 sm:py-5',
        listMode ? 'sm:pl-8' : '',
      ]"
    >
      <p
        v-if="variant === 'collection'"
        class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase mb-1.5 truncate"
      >
        {{ product.head }}
      </p>
      <p
        class="font-h3d-display font-light leading-snug transition-colors duration-300 group-hover:text-h3d-accent"
        :class="variant === 'related' ? 'text-base text-h3d-text' : 'text-xl sm:text-2xl text-h3d-text mb-2'"
      >
        {{ product.title }}
      </p>
      <p class="font-h3d-body text-h3d-muted" :class="variant === 'related' ? 'mt-1 text-h3d-body-sm' : 'text-sm'">
        <template v-if="variant === 'collection'">
          From <span class="text-h3d-text tabular-nums font-medium">NPR {{ formatNprPrice(product.price) }}</span>
        </template>
        <template v-else>
          NPR {{ formatNprPrice(product.price) }}
        </template>
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* GIF fades in on enter, snaps out on leave */
.gif-reveal-enter-active {
  transition: opacity 0.35s ease;
}
.gif-reveal-leave-active {
  transition: opacity 0.15s ease;
}
.gif-reveal-enter-from,
.gif-reveal-leave-to {
  opacity: 0;
}
.gif-reveal-enter-to,
.gif-reveal-leave-from {
  opacity: 1;
}

/* Static image fades out when GIF takes over, fades back in when GIF leaves */
.img-hide-leave-active {
  transition: opacity 0.25s ease;
}
.img-hide-enter-active {
  transition: opacity 0.35s ease 0.1s; /* slight delay so GIF exits first */
}
.img-hide-enter-from,
.img-hide-leave-to {
  opacity: 0;
}
.img-hide-enter-to,
.img-hide-leave-from {
  opacity: 1;
}
</style>
