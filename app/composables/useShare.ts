import type { MockMemory } from '~/data/mock-memories'

// ── Domain types ────────────────────────────────────────────────
export interface SharePlatform {
  id: string
  label: string
  description: string
  brandColor: string
  buildUrl: (shareUrl: string, caption: string) => string
}

export interface SharePlatformLink extends SharePlatform {
  href: string
}

// ── Platform definitions (presentation layer) ───────────────────
export const SHARE_PLATFORMS: SharePlatform[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Opens with caption pre-filled',
    brandColor: '#25D366',
    buildUrl: (u, c) => `https://wa.me/?text=${encodeURIComponent(`${c}\n\n${u}`)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Caption auto-copied — paste into your post',
    brandColor: '#1877F2',
    buildUrl: u => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Caption auto-copied — paste into your post',
    brandColor: '#0A66C2',
    buildUrl: u => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    description: 'Opens with caption + link',
    brandColor: '#000000',
    buildUrl: (u, c) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(c)}&url=${encodeURIComponent(u)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    description: 'Opens with caption + link',
    brandColor: '#0088CC',
    buildUrl: (u, c) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(c)}`,
  },
]

// ── Composable ──────────────────────────────────────────────────
export function useShare() {
  const copied = ref<'caption' | 'link' | null>(null)
  let copiedTimer: ReturnType<typeof setTimeout> | null = null

  /** Canonical share URL for a memory — links to SSR page /p/[slug] */
  function buildShareUrl(memory: MockMemory): string {
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://hamro3d.com'
    return `${origin}/p/${memory.slug}`
  }

  /** Full caption with hashtags for sharing */
  function buildCaption(memory: MockMemory): string {
    return `${memory.shareCaption}\n\n${memory.shareHashtags.join(' ')}`
  }

  /** Returns all platforms with their ready-to-open hrefs */
  function getPlatformLinks(memory: MockMemory): SharePlatformLink[] {
    const url = buildShareUrl(memory)
    const caption = buildCaption(memory)
    return SHARE_PLATFORMS.map(p => ({
      ...p,
      href: p.buildUrl(url, caption),
    }))
  }

  function _setCopied(type: 'caption' | 'link') {
    if (copiedTimer) clearTimeout(copiedTimer)
    copied.value = type
    copiedTimer = setTimeout(() => { copied.value = null }, 2200)
  }

  async function copyCaption(memory: MockMemory) {
    try {
      await navigator.clipboard.writeText(buildCaption(memory))
      _setCopied('caption')
    }
    catch { /* silent — clipboard may be denied */ }
  }

  async function copyLink(memory: MockMemory) {
    try {
      await navigator.clipboard.writeText(buildShareUrl(memory))
      _setCopied('link')
    }
    catch { /* silent */ }
  }

  function openPlatform(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer,width=640,height=500')
  }

  return {
    SHARE_PLATFORMS,
    getPlatformLinks,
    buildShareUrl,
    buildCaption,
    copyCaption,
    copyLink,
    openPlatform,
    copied,
  }
}
