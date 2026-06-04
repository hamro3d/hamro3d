import type { MockMemory } from '~/data/mock-memories'

export interface ShareLinks {
  whatsapp: string
  facebook: string
  twitter: string
  pageUrl: string
  caption: string
}

export interface ShareToastState {
  visible: boolean
  message: string
}

export function useMemoryShare() {
  const toast = ref<ShareToastState>({ visible: false, message: '' })
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showToast(message: string) {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message }
    toastTimer = setTimeout(() => {
      toast.value = { visible: false, message: '' }
    }, 4000)
  }

  async function captureCard(cardEl: HTMLElement): Promise<Blob> {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#10081a',
      scale: 2,
      useCORS: true,
      logging: false,
    })
    return new Promise((resolve, reject) =>
      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('Canvas capture failed'))),
        'image/png',
      ),
    )
  }

  async function downloadCardImage(memory: MockMemory, cardEl: HTMLElement): Promise<string> {
    const blob = await captureCard(cardEl)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hamro3d-${memory.slug}.png`
    a.click()
    // Return the object URL so caller can use it for preview
    return url
  }

  function buildShareLinks(memory: MockMemory): ShareLinks {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://hamro3d.com'
    const pageUrl = `${base}/memories`
    const caption = `${memory.shareCaption}\n\n${memory.shareHashtags.join(' ')}`
    const captionLine = `${memory.shareCaption} ${memory.shareHashtags.join(' ')}`

    return {
      pageUrl,
      caption,
      // WhatsApp — opens app with pre-filled text (works on mobile + desktop)
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${captionLine}\n\n${pageUrl}`)}`,
      // Facebook — opens sharer with URL (Facebook reads OG tags from the URL)
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(captionLine)}`,
      // Twitter/X — pre-filled text + URL
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionLine)}&url=${encodeURIComponent(pageUrl)}`,
    }
  }

  // Mobile Web Share API — opens native share sheet (Instagram, TikTok, WhatsApp, etc.)
  async function nativeMobileShare(memory: MockMemory, cardEl: HTMLElement): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.share) return false

    const caption = `${memory.shareCaption}\n\n${memory.shareHashtags.join(' ')}`
    try {
      const blob = await captureCard(cardEl)
      const file = new File([blob], `hamro3d-${memory.slug}.png`, { type: 'image/png' })
      const canShareFiles = navigator.canShare?.({ files: [file] }) ?? false

      if (canShareFiles) {
        await navigator.share({ title: memory.storyTitle, text: caption, files: [file] })
      }
      else {
        await navigator.share({ title: memory.storyTitle, text: caption })
      }
      return true
    }
    catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return true // user cancelled — not an error
      return false
    }
  }

  async function copyCaption(memory: MockMemory) {
    const caption = `${memory.shareCaption}\n\n${memory.shareHashtags.join(' ')}`
    try {
      await navigator.clipboard.writeText(caption)
      showToast('Caption copied to clipboard.')
    }
    catch {
      showToast('Could not copy — select the caption above and copy manually.')
    }
  }

  return {
    captureCard,
    downloadCardImage,
    buildShareLinks,
    nativeMobileShare,
    copyCaption,
    showToast,
    toast,
  }
}
