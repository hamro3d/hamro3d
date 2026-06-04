---
name: hamro3d-memories-feature
description: >-
  Specialist skill for building the Hamro3D /memories page — a public mini-blog
  of completed customer commissions. Covers: MemoryCard component architecture,
  mock memory data schema, social comment embed strategy (TikTok/FB/IG),
  share-card generation via html2canvas + Web Share API, and preset caption/
  hashtag system. Use whenever building or editing anything in app/pages/memories/,
  app/components/H3dMemoryCard.vue, app/data/mock-memories.ts, or any
  share/comment composable.
---

# Hamro3D — Memories Feature Skill

You are building the **/memories** page for Hamro3D — a curated, emotionally-driven mini-blog that showcases real commissions the studio has completed. Every card is a story, not a showcase.

Apply the brand's strategic filter to every decision:
> "Does this feel like a memory — or just a product?"

---

## 1. Data Schema — `MockMemory`

```typescript
// app/data/mock-memories.ts
export interface MockMemory {
  id: number
  slug: string                  // URL-safe identifier e.g. "aarav-anniversary-sculpture"
  date: string                  // ISO date string "2025-11-14"
  productTitle: string          // e.g. "Anniversary Sculpture"
  category: string              // e.g. "Figurine" | "Litholamp" | "Nameplate" …
  tags: string[]                // e.g. ["anniversary", "couple", "gift"]

  // The story — written by the studio in brand voice
  head: string                  // short eyebrow e.g. "TWELVE YEARS · TOGETHER IN FORM"
  storyTitle: string            // headline e.g. "A decade and two, captured in resin"
  storyBody: string             // 2–4 sentence brand-voice narrative
  customerFirstName: string     // first name only — privacy-first e.g. "Priya"
  occasion: string              // e.g. "Wedding Anniversary"
  location: string              // e.g. "Kathmandu" | "Pokhara"

  // Media
  images: string[]              // paths under /images/memories/{slug}/
  // images[0] is always the hero / shareable card image

  // Social engagement
  tiktokVideoId?: string        // TikTok embed ID (optional)
  instagramPostId?: string      // Instagram embed shortcode (optional)
  facebookPostUrl?: string      // Facebook post URL (optional)

  // Share system
  shareCaption: string          // preset caption for sharing — brand voice
  shareHashtags: string[]       // e.g. ["#Hamro3D", "#MemoryToObject", "#MadeInNepal"]
}
```

---

## 2. Page Architecture

```
app/pages/memories/
├── index.vue          → /memories         (grid of all memory cards)
└── [slug].vue         → /memories/:slug   (full memory detail page) [future]

app/components/
└── H3dMemoryCard.vue  → reusable card used in the grid

app/data/
└── mock-memories.ts   → 8–12 seeded mock entries

app/composables/
└── useMemoryShare.ts  → share card generation + Web Share API
```

---

## 3. MemoryCard Design Rules

The `H3dMemoryCard.vue` component follows the same visual language as `H3dProductCard.vue` but tells a human story:

### Card anatomy (top → bottom):
1. **Hero image** — `aspect-[4/3]` or `aspect-square`, `object-cover`, with a bottom gradient overlay
2. **Eyebrow** — `font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase` — e.g. "ANNIVERSARY · KATHMANDU"
3. **Story headline** — `font-h3d-display text-lg text-h3d-text font-light`
4. **Story body excerpt** — `font-h3d-body text-xs text-h3d-muted leading-relaxed` — max 2 lines, clamp with `line-clamp-2`
5. **Customer credit** — `font-h3d-body text-2xs text-h3d-muted` — "For Priya · Anniversary"
6. **Tag pills** — small `border-h3d-accent/30 text-h3d-muted` pills
7. **Action row** — Share button + Comment anchor link (both `pointer` cursor, icon + label)

### Card states:
- Default: `border border-h3d-border bg-h3d-surface`
- Hover: `hover:border-h3d-accent` + image subtle scale `group-hover:scale-[1.03]`
- All transitions: `transition-all duration-300`

---

## 4. Comment Section Strategy

Since TikTok/Facebook/Instagram comment widgets **cannot be natively embedded** without their official SDKs and the user having an account, use this layered approach:

### Layer A — Social embed (when `tiktokVideoId` / `instagramPostId` exists)
Embed the social post directly using each platform's official oEmbed / embed code. Users comment on the original platform — the embed just shows live engagement.

```vue
<!-- TikTok embed -->
<blockquote class="tiktok-embed" :cite="`https://www.tiktok.com/video/${memory.tiktokVideoId}`"
  :data-video-id="memory.tiktokVideoId" style="max-width:605px;min-width:325px;">
</blockquote>
<script async src="https://www.tiktok.com/embed.js" />

<!-- Instagram embed -->
<blockquote class="instagram-media" :data-instgrm-permalink="`https://www.instagram.com/p/${memory.instagramPostId}/`">
</blockquote>
<script async src="//www.instagram.com/embed.js" />
```

Load these scripts **only client-side** using `useHead` with `{ body: true }` and guard with `onMounted`.

### Layer B — Guestbook comment box (always present)
A local, simple guestbook textarea that stores comments in `localStorage` (Phase 0 — no backend yet). Each memory card has its own namespace key: `h3d_comments_${memory.slug}`.

```typescript
// Shape of a local comment
interface LocalComment {
  id: string        // crypto.randomUUID()
  name: string      // user entered
  text: string
  ts: number        // Date.now()
}
```

UI: show stored comments above the input, display commenter name + text + relative time. No auth required. Mark clearly: *"Leave a memory. Your words stay here."*

---

## 5. Share Card System — `useMemoryShare.ts`

```typescript
// app/composables/useMemoryShare.ts
// Requires: html2canvas (install with: npm install html2canvas)

import html2canvas from 'html2canvas'

export function useMemoryShare() {

  async function captureCard(cardEl: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#10081a',  // h3d-base
      scale: 2,                    // retina quality
      useCORS: true,
      logging: false,
    })
    return new Promise(resolve =>
      canvas.toBlob(blob => resolve(blob!), 'image/png')
    )
  }

  async function shareMemory(memory: MockMemory, cardEl: HTMLElement) {
    const caption = `${memory.shareCaption}\n\n${memory.shareHashtags.join(' ')}`

    if (navigator.share) {
      // Web Share API — works on mobile/Safari
      try {
        const blob = await captureCard(cardEl)
        const file = new File([blob], `hamro3d-${memory.slug}.png`, { type: 'image/png' })
        await navigator.share({
          title: memory.storyTitle,
          text: caption,
          files: [file],
        })
        return
      } catch {
        // Fallback if file sharing not supported
      }
    }

    // Desktop fallback — copy caption to clipboard + download image
    await downloadCardImage(memory, cardEl)
    await navigator.clipboard.writeText(caption)
    // Show a toast: "Caption copied! Image downloaded."
  }

  async function downloadCardImage(memory: MockMemory, cardEl: HTMLElement) {
    const blob = await captureCard(cardEl)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hamro3d-${memory.slug}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { shareMemory, downloadCardImage }
}
```

### Preset captions must:
- Open with an emotional hook, not a product description
- Include `#Hamro3D` `#MemoryToObject` `#MadeInNepal` `#HamroKathmandu`
- Be < 280 chars for Twitter/X compatibility
- Feel personal, not promotional

Example:
```
"Some moments deserve more than a photo album. This one lives on a shelf now. 🖤"
#Hamro3D #MemoryToObject #MadeInNepal #HandcraftedInKathmandu
```

---

## 6. Page-level `/memories` index

- **Hero**: Same eyebrow + heading pattern as other pages. Heading: *"Moments we have held."* Sub: *"Every piece here began with a story. These are the ones people trusted us to keep."*
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` — same cadence as Our Collection
- **Filter bar** (optional Phase 1): filter by category or occasion
- **Empty state**: *"Our first memory is being crafted. Come back soon."*
- **SEO**: `useSeoMeta` with title `'Memories'` (titleTemplate adds suffix), description warm brand-voice copy, `ogImage: '/og/memories.jpg'`

---

## 7. Navbar & Footer Integration

Add "Memories" to `H3dNavbar.vue`:
```vue
<li><NuxtLink to="/memories" :class="navClass('/memories')">Memories</NuxtLink></li>
```

---

## 8. Install Requirement

Before implementing the share composable:
```bash
npm install html2canvas
```

---

## 9. Brand & Copy Rules (apply to every word)

| Instead of… | Write… |
|---|---|
| "Customer review" | "Memory shared" |
| "Product showcase" | "A piece we made" |
| "Commission #42" | Use the person's first name and occasion |
| "Posted by" | "For" |
| "Comments" | "Leave a memory" |
| "Share" | "Share this story" |

Every story body must pass the filter: **"Does this feel like a memory — or just a product?"**
