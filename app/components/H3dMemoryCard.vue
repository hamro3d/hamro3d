<script setup lang="ts">
import type { MockMemory } from '~/data/mock-memories'

const props = defineProps<{ memory: MockMemory }>()
const emit = defineEmits<{ share: [memory: MockMemory] }>()
</script>

<template>
  <article
    class="group flex flex-col border border-h3d-border bg-h3d-surface transition-all duration-300 hover:border-h3d-accent"
    :aria-label="memory.storyTitle"
  >
    <!-- Hero image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-h3d-base">
      <NuxtImg
        :src="memory.images[0]"
        :alt="`${memory.storyTitle} — made for ${memory.customerFirstName}`"
        class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-h3d-base/80 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <span class="absolute top-3 right-3 font-h3d-body text-2xs tracking-widest uppercase bg-h3d-base/80 text-h3d-accent px-2.5 py-1 border border-h3d-accent/30">
        {{ memory.category }}
      </span>
    </div>

    <!-- Card body -->
    <div class="p-5 flex flex-col gap-3 flex-1">
      <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase">
        {{ memory.occasion }} · {{ memory.location }}
      </p>
      <h3 class="font-h3d-display text-lg text-h3d-text font-light leading-snug line-clamp-1">
        {{ memory.storyTitle }}
      </h3>
      <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed line-clamp-3">
        {{ memory.storyBody }}
      </p>
      <p class="font-h3d-body text-2xs text-h3d-muted/70">
        For {{ memory.customerFirstName }} · {{ memory.occasion }}
      </p>
    </div>

    <!-- Action row -->
    <div class="px-5 pb-4 border-t border-h3d-border pt-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
        @click="emit('share', memory)"
      >
        <svg viewBox="0 0 16 16" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 2.5L8 0 5 2.5M8 0v10M2 6v8h12V6" />
        </svg>
        Share this story
      </button>
    </div>
  </article>
</template>
