<script setup lang="ts">
import { mockMemories } from '~/data/mock-memories'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const memory = computed(() =>
  mockMemories.find(m => m.slug === slug.value),
)

// 404 when memory is not found
if (!memory.value) {
  throw createError({ statusCode: 404, statusMessage: 'This story could not be found.' })
}

// ── SSR-safe canonical URL ───────────────────────────────────────
// useRequestURL() works on both server and client in Nuxt 3
const requestUrl = useRequestURL()
const canonicalUrl = `${requestUrl.origin}/p/${memory.value.slug}`
const ogImageUrl = `${requestUrl.origin}${memory.value.images[0]}`

// ── Dynamic OG + Twitter card metadata ──────────────────────────
useSeoMeta({
  // Standard meta
  title: memory.value.storyTitle,
  description: memory.value.storyBody.slice(0, 160),

  // Open Graph (Facebook, LinkedIn, WhatsApp previews)
  ogType: 'article',
  ogTitle: memory.value.storyTitle,
  ogDescription: memory.value.storyBody.slice(0, 160),
  ogImage: ogImageUrl,
  ogImageAlt: `${memory.value.storyTitle} — Hamro3D`,
  ogUrl: canonicalUrl,
  ogSiteName: 'Hamro3D',

  // Twitter Card (X, Telegram previews)
  twitterCard: 'summary_large_image',
  twitterTitle: memory.value.storyTitle,
  twitterDescription: memory.value.storyBody.slice(0, 160),
  twitterImage: ogImageUrl,
  twitterImageAlt: `${memory.value.storyTitle} — Hamro3D`,
})

// ── Canonical link tag ───────────────────────────────────────────
useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
})

// ── Share composable ─────────────────────────────────────────────
const { getPlatformLinks, copyCaption, copyLink, openPlatform, copied } = useShare()
const platformLinks = computed(() => memory.value ? getPlatformLinks(memory.value) : [])
</script>

<template>
  <div v-if="memory" class="min-h-screen bg-h3d-base text-h3d-text font-h3d-body">

    <!-- Back navigation -->
    <div class="border-b border-h3d-border bg-h3d-surface px-6 sm:px-10 py-3.5">
      <div class="max-w-h3d-max mx-auto">
        <NuxtLink
          to="/memories"
          class="inline-flex items-center gap-2 font-h3d-body text-2xs text-h3d-muted hover:text-h3d-accent transition-colors tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
        >
          <svg viewBox="0 0 14 14" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 2L4 7l5 5" />
          </svg>
          All memories
        </NuxtLink>
      </div>
    </div>

    <!-- Story hero -->
    <div class="max-w-h3d-max mx-auto px-6 sm:px-10 pt-12 pb-10 lg:grid lg:grid-cols-[1fr_400px] lg:gap-16 lg:items-start">

      <!-- Left: story content -->
      <div class="flex flex-col gap-6">
        <!-- Eyebrow -->
        <div>
          <p class="font-h3d-body text-2xs text-h3d-accent tracking-[0.2em] uppercase mb-1">
            {{ memory.occasion }} · {{ memory.location }}
          </p>
          <div class="w-10 h-px bg-h3d-accent" aria-hidden="true" />
        </div>

        <!-- Headline -->
        <h1 class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text leading-tight">
          {{ memory.storyTitle }}
        </h1>

        <!-- Story body -->
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted leading-loose max-w-h3d-text">
          {{ memory.storyBody }}
        </p>

        <!-- Credit + tags -->
        <div class="flex flex-col gap-3 pt-2">
          <p class="font-h3d-body text-xs text-h3d-muted/60">
            Made for <span class="text-h3d-muted">{{ memory.customerFirstName }}</span> · {{ memory.date }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in memory.tags"
              :key="tag"
              class="font-h3d-body text-2xs text-h3d-muted border border-h3d-accent/30 px-2.5 py-1 tracking-wide"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: image + share panel -->
      <div class="mt-10 lg:mt-0 flex flex-col gap-6 lg:sticky lg:top-24">

        <!-- Product image -->
        <div class="relative overflow-hidden bg-h3d-surface border border-h3d-border aspect-[4/3]">
          <NuxtImg
            :src="memory.images[0]"
            :alt="`${memory.storyTitle} — made for ${memory.customerFirstName}`"
            class="w-full h-full object-cover"
            loading="eager"
            width="800"
          />
          <!-- Category pill -->
          <span class="absolute top-3 right-3 font-h3d-body text-2xs tracking-widest uppercase bg-h3d-base/80 text-h3d-accent px-2.5 py-1 border border-h3d-accent/30">
            {{ memory.category }}
          </span>
        </div>

        <!-- Share panel -->
        <div class="border border-h3d-border bg-h3d-surface p-5 flex flex-col gap-4">
          <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase">
            Share this story
          </p>

          <!-- Platform buttons -->
          <div class="flex flex-col gap-2">
            <a
              v-for="platform in platformLinks"
              :key="platform.id"
              :href="platform.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group/btn flex items-center gap-3 border border-h3d-border bg-h3d-base px-3.5 py-2.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              :aria-label="`Share on ${platform.label}`"
              @click.prevent="openPlatform(platform.href)"
            >
              <span class="font-h3d-body text-xs text-h3d-text flex-1">{{ platform.label }}</span>
              <span class="font-h3d-body text-2xs text-h3d-muted/50 group-hover/btn:text-h3d-muted transition-colors" aria-hidden="true">→</span>
            </a>
          </div>

          <!-- Copy row -->
          <div class="flex gap-2 pt-1 border-t border-h3d-border">
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-center gap-1.5 font-h3d-body text-2xs tracking-widest uppercase border border-h3d-border py-2.5 text-h3d-muted hover:text-h3d-accent hover:border-h3d-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              @click="copyCaption(memory)"
            >
              <svg v-if="copied === 'caption'" viewBox="0 0 14 14" class="w-3 h-3 shrink-0 text-h3d-accent" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" /></svg>
              {{ copied === 'caption' ? 'Copied!' : 'Copy caption' }}
            </button>
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-center gap-1.5 font-h3d-body text-2xs tracking-widest uppercase border border-h3d-border py-2.5 text-h3d-muted hover:text-h3d-accent hover:border-h3d-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
              @click="copyLink(memory)"
            >
              <svg v-if="copied === 'link'" viewBox="0 0 14 14" class="w-3 h-3 shrink-0 text-h3d-accent" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" /></svg>
              {{ copied === 'link' ? 'Copied!' : 'Copy link' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Back CTA -->
    <section class="border-t border-h3d-border bg-h3d-surface py-14 text-center">
      <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Want yours here?</span>
      <h2 class="font-h3d-display text-3xl font-light text-h3d-text mb-5 leading-tight max-w-md mx-auto">
        Your story deserves a permanent home.
      </h2>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/contact#commission-form"
          class="bg-h3d-accent text-h3d-base px-8 py-3 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
        >
          Begin Your Commission
        </NuxtLink>
        <NuxtLink
          to="/memories"
          class="font-h3d-body text-xs tracking-widest text-h3d-muted hover:text-h3d-accent transition-colors uppercase"
        >
          See all memories →
        </NuxtLink>
      </div>
    </section>

  </div>
</template>
