<script setup lang="ts">
import type { MockMemory } from '~/data/mock-memories'
import { mockMemories } from '~/data/mock-memories'

useSeoMeta({
  title: 'Memories',
  description: 'Every piece here began with a story. Browse the commissions Hamro3D has made — real moments, handcrafted in Kathmandu, carried forever.',
  ogImage: '/og/memories.jpg',
})

const memories = computed(() => mockMemories)

// ── Share modal state ────────────────────────────────────────
const selectedMemory = ref<MockMemory | null>(null)

function openShareModal(memory: MockMemory) {
  selectedMemory.value = memory
}

function closeShareModal() {
  selectedMemory.value = null
}
</script>

<template>
  <div class="min-h-screen bg-h3d-base text-h3d-text font-h3d-body">

    <!-- Page hero -->
    <header
      class="relative overflow-hidden bg-h3d-surface border-b border-h3d-border"
      aria-labelledby="memories-heading"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(196,144,122,0.20),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_50%,rgba(58,36,80,0.55),transparent_65%)]"
        aria-hidden="true"
      />
      <div class="relative z-10 max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-12 sm:py-14 lg:py-16">
        <p class="font-h3d-body text-2xs tracking-[0.2em] text-h3d-accent uppercase mb-4">
          PIECES WE HAVE MADE · हाम्रा स्मृतिहरू
        </p>
        <div class="w-14 h-px bg-h3d-accent mb-6" aria-hidden="true" />
        <h1
          id="memories-heading"
          class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text mb-6 max-w-h3d-text leading-tight"
        >
          Moments we have held.
        </h1>
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted max-w-h3d-text leading-relaxed mb-4">
          Every piece here began with a story. These are the ones people trusted us to keep.
        </p>
        <p class="font-h3d-body text-2xs text-h3d-muted/60 tracking-widest uppercase">
          {{ memories.length }} memories and counting.
        </p>
      </div>
    </header>

    <!-- Memories grid -->
    <main class="max-w-h3d-max mx-auto px-6 sm:px-10 py-14 sm:py-16">

      <!-- Empty state -->
      <div v-if="!memories.length" class="flex flex-col items-center gap-6 py-24 text-center">
        <p class="font-h3d-display text-3xl text-h3d-text/60 font-light">
          Our first memory is being crafted.
        </p>
        <p class="font-h3d-body text-sm text-h3d-muted max-w-xs leading-relaxed">
          Come back soon — we are still turning the first story into something you can hold.
        </p>
        <NuxtLink
          to="/products"
          class="font-h3d-body text-xs uppercase tracking-widest text-h3d-accent hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
        >
          Explore our pieces →
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <H3dMemoryCard
          v-for="memory in memories"
          :key="memory.id"
          :memory="memory"
          @share="openShareModal"
        />
      </div>
    </main>

    <!-- Bottom CTA -->
    <section
      class="border-t border-h3d-border bg-h3d-surface py-16 sm:py-20 text-center"
      aria-label="Begin a commission"
    >
      <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Want yours here?</span>
      <h2 class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-5 leading-tight max-w-xl mx-auto">
        Your story deserves a permanent home.
      </h2>
      <p class="font-h3d-body text-sm text-h3d-muted mb-8 max-w-md mx-auto leading-relaxed">
        Commission a piece and let us add your memory to this page.
      </p>
      <NuxtLink
        to="/contact#commission-form"
        class="bg-h3d-accent text-h3d-base px-8 py-3 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
      >
        Begin Your Commission
      </NuxtLink>
    </section>

    <!-- Share modal — single instance for the whole page -->
    <H3dShareModal
      :memory="selectedMemory"
      @close="closeShareModal"
    />

  </div>
</template>
