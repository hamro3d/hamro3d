<script setup lang="ts">
import type { MockMemory } from '~/data/mock-memories'

const props = defineProps<{
  memory: MockMemory | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { getPlatformLinks, buildShareUrl, buildCaption, copyCaption, copyLink, openPlatform, copied } = useShare()

// Platforms that cannot accept pre-filled text via URL — auto-copy caption on click
const COPY_BEFORE_OPEN = new Set(['facebook', 'linkedin'])

const autoCopied = ref(false)
let autoCopiedTimer: ReturnType<typeof setTimeout> | null = null

async function handlePlatformClick(e: Event, platformId: string, href: string) {
  e.preventDefault()
  if (COPY_BEFORE_OPEN.has(platformId) && props.memory) {
    try {
      await navigator.clipboard.writeText(buildCaption(props.memory))
      autoCopied.value = true
      if (autoCopiedTimer) clearTimeout(autoCopiedTimer)
      autoCopiedTimer = setTimeout(() => { autoCopied.value = false }, 3000)
    }
    catch { /* clipboard denied — still open the platform */ }
  }
  openPlatform(href)
}

const platformLinks = computed(() =>
  props.memory ? getPlatformLinks(props.memory) : [],
)

const caption = computed(() =>
  props.memory ? buildCaption(props.memory) : '',
)

const shareUrl = computed(() =>
  props.memory ? buildShareUrl(props.memory) : '',
)

// ── Close handlers ──────────────────────────────────────────
function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

// ── Body scroll lock ────────────────────────────────────────
watch(() => props.memory, (mem) => {
  if (import.meta.client) {
    document.body.style.overflow = mem ? 'hidden' : ''
  }
}, { immediate: true })

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

// ── Focus trap ──────────────────────────────────────────────
const panelEl = ref<HTMLElement | null>(null)

watch(() => props.memory, async (mem) => {
  if (mem) {
    await nextTick()
    panelEl.value?.focus()
  }
})

// ── Platform icons (inlined SVGs keyed by platform id) ──────
const platformIcons: Record<string, string> = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="#0088CC"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
}
</script>

<template>
  <Teleport to="body">
    <Transition name="h3d-modal">
      <div
        v-if="memory"
        class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Share: ${memory.storyTitle}`"
        @click="onBackdropClick"
        @keydown="onKeydown"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-h3d-base/80 backdrop-blur-sm" aria-hidden="true" />

        <!-- Panel -->
        <Transition name="h3d-modal-panel">
          <div
            v-if="memory"
            ref="panelEl"
            tabindex="-1"
            class="relative z-10 w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto bg-h3d-surface border border-h3d-border shadow-2xl outline-none flex flex-col rounded-t-xl sm:rounded-none"
          >
            <!-- Header -->
            <div class="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-h3d-border shrink-0">
              <div class="flex flex-col gap-1 min-w-0">
                <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase">
                  Share this story
                </p>
                <h2 class="font-h3d-display text-lg sm:text-xl text-h3d-text font-light leading-snug line-clamp-2">
                  {{ memory.storyTitle }}
                </h2>
              </div>
              <button
                type="button"
                class="shrink-0 w-8 h-8 flex items-center justify-center text-h3d-muted hover:text-h3d-text transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                aria-label="Close share modal"
                @click="emit('close')"
              >
                <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            <!-- Memory preview strip -->
            <div class="flex items-center gap-3 px-6 py-4 border-b border-h3d-border bg-h3d-base/40 shrink-0">
              <div class="w-16 h-16 shrink-0 overflow-hidden bg-h3d-base border border-h3d-border">
                <NuxtImg
                  :src="memory.images[0]"
                  :alt="memory.storyTitle"
                  class="w-full h-full object-cover"
                  width="64"
                  height="64"
                  loading="eager"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase truncate">
                  {{ memory.occasion }} · {{ memory.location }}
                </p>
                <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed line-clamp-2 mt-0.5">
                  {{ memory.storyBody }}
                </p>
              </div>
            </div>

            <!-- Scrollable body -->
            <div class="flex flex-col gap-0 overflow-y-auto flex-1">

              <!-- Caption box -->
              <div class="px-6 py-5 border-b border-h3d-border">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase">
                    Auto-generated caption
                  </p>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 font-h3d-body text-2xs text-h3d-muted hover:text-h3d-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                    @click="copyCaption(memory)"
                  >
                    <svg v-if="copied === 'caption'" viewBox="0 0 14 14" class="w-3 h-3 shrink-0 text-h3d-accent" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M2 7l3.5 3.5L12 3" />
                    </svg>
                    <svg v-else viewBox="0 0 14 14" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                      <rect x="4" y="4" width="9" height="9" rx="1" /><path d="M1 10V2a1 1 0 011-1h8" />
                    </svg>
                    {{ copied === 'caption' ? 'Copied!' : 'Copy caption' }}
                  </button>
                </div>
                <div class="bg-h3d-base border border-h3d-border px-3.5 py-3 font-h3d-body text-xs text-h3d-muted leading-relaxed whitespace-pre-line select-all">
                  {{ caption }}
                </div>
              </div>

              <!-- Share link row -->
              <div class="px-6 py-4 border-b border-h3d-border flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <p class="font-h3d-body text-2xs text-h3d-muted/60 truncate">
                    {{ shareUrl }}
                  </p>
                </div>
                <button
                  type="button"
                  class="shrink-0 inline-flex items-center gap-1.5 font-h3d-body text-2xs tracking-widest uppercase border border-h3d-border bg-h3d-base px-3 py-1.5 text-h3d-muted hover:text-h3d-accent hover:border-h3d-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                  @click="copyLink(memory)"
                >
                  <svg v-if="copied === 'link'" viewBox="0 0 14 14" class="w-3 h-3 shrink-0 text-h3d-accent" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 7l3.5 3.5L12 3" />
                  </svg>
                  <svg v-else viewBox="0 0 14 14" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                    <path d="M5.5 8.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L6 3" /><path d="M8.5 5.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L8 11" />
                  </svg>
                  {{ copied === 'link' ? 'Copied!' : 'Copy link' }}
                </button>
              </div>

              <!-- Auto-copy toast (Facebook / LinkedIn) -->
              <Transition name="h3d-toast">
                <div
                  v-if="autoCopied"
                  class="mx-6 mt-4 px-3.5 py-2.5 bg-h3d-base border border-h3d-accent/40 font-h3d-body text-xs text-h3d-accent flex items-center gap-2"
                  role="status"
                  aria-live="polite"
                >
                  <svg viewBox="0 0 14 14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3" /></svg>
                  Caption copied — paste it into your post.
                </div>
              </Transition>

              <!-- Platform buttons -->
              <div class="px-6 py-5 flex flex-col gap-2">
                <p class="font-h3d-body text-2xs text-h3d-muted/60 tracking-widest uppercase mb-1">
                  Share on
                </p>

                <a
                  v-for="platform in platformLinks"
                  :key="platform.id"
                  :href="platform.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="h3d-share-platform-btn group/btn flex items-center gap-3.5 border border-h3d-border bg-h3d-base px-4 py-3 transition-all duration-200 hover:bg-h3d-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
                  :style="`--platform-color: ${platform.brandColor}`"
                  :aria-label="`Share on ${platform.label}`"
                  @click="(e) => handlePlatformClick(e, platform.id, platform.href)"
                >
                  <!-- Icon -->
                  <span
                    class="w-5 h-5 shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                    v-html="platformIcons[platform.id]"
                  />
                  <!-- Label + description -->
                  <div class="flex-1 min-w-0">
                    <p class="font-h3d-body text-sm text-h3d-text font-medium leading-none">
                      {{ platform.label }}
                    </p>
                    <p class="font-h3d-body text-2xs text-h3d-muted/60 mt-0.5">
                      {{ platform.description }}
                    </p>
                  </div>
                  <!-- Arrow -->
                  <svg viewBox="0 0 10 10" class="w-3.5 h-3.5 shrink-0 text-h3d-muted/40 group-hover/btn:text-h3d-muted transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 5h6M5 2l3 3-3 3" />
                  </svg>
                </a>
              </div>

              <!-- Instagram / TikTok note -->
              <div class="mx-6 mb-6 border border-h3d-border/50 bg-h3d-base/30 px-4 py-3.5">
                <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed">
                  <span class="text-h3d-accent font-medium">Instagram & TikTok:</span>
                  copy the link above, paste it into your post, and use the caption.
                  On mobile the native share sheet includes both apps.
                </p>
              </div>

            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.h3d-share-platform-btn:hover {
  border-color: color-mix(in srgb, var(--platform-color) 60%, transparent);
}
</style>
