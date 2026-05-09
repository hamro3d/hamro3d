# Hamro3D — Design Token Reference for Nuxt + Tailwind v4

## Tailwind v4 Theme Configuration

In your `app/assets/css/main.css`, define all tokens using `@theme`:

```css
@import "tailwindcss";

@theme {
  /* ── Color: Core ── */
  --color-h3d-base: #1A0E24;
  --color-h3d-surface: #271540;
  --color-h3d-text: #F2EDE8;
  --color-h3d-muted: #A898B8;
  --color-h3d-border: #3A2450;

  /* ── Color: Accent & Functional ── */
  --color-h3d-accent: #C4907A;
  --color-h3d-accent-hover: #A07060;
  --color-h3d-success: #6B8A70;
  --color-h3d-error: #8B2A3A;

  /* ── Typography: Families ── */
  --font-h3d-display: 'EB Garamond', Georgia, serif;
  --font-h3d-body: 'Jost', system-ui, sans-serif;
  --font-h3d-devanagari: 'Rozha One', serif;
  --font-h3d-devanagari-body: 'Noto Sans Devanagari', sans-serif;

  /* ── Typography: Sizes ── */
  --text-h3d-hero: clamp(38px, 5vw, 84px);
  --text-h3d-h2: clamp(30px, 4vw, 50px);
  --text-h3d-h3: clamp(16px, 2vw, 22px);
  --text-h3d-h4: clamp(14px, 1.5vw, 17px);
  --text-h3d-h5: 11px;
  --text-h3d-lead: clamp(17px, 2vw, 21px);
  --text-h3d-body: 15px;
  --text-h3d-body-sm: 13px;
  --text-h3d-cta: 13px;
  --text-h3d-nav: 13px;
  --text-h3d-legal: 11px;

  /* ── Spacing ── */
  --spacing-h3d-xs: 8px;
  --spacing-h3d-sm: 16px;
  --spacing-h3d-md: 24px;
  --spacing-h3d-lg: 48px;
  --spacing-h3d-xl: 80px;
  --spacing-h3d-section: clamp(80px, 12vw, 220px);
  --spacing-h3d-gutter: 24px;

  /* ── Layout ── */
  --width-h3d-max: 1240px;
  --width-h3d-text: 660px;
  --width-h3d-grid: 1100px;

  /* ── Borders ── */
  --radius-h3d-none: 0;
  --radius-h3d-sm: 3px;

  /* ── Shadows ── */
  --shadow-h3d-card: 0 20px 56px rgba(26, 14, 36, 0.95), 0 4px 12px rgba(196, 144, 122, 0.1);

  /* ── Animation ── */
  --ease-h3d: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-h3d-reveal: 700ms;
  --duration-h3d-hover: 300ms;
}
```

## CSS Custom Properties (for non-Tailwind usage)

These are set alongside the Tailwind theme for use in custom CSS or JS:

```css
:root {
  /* ── Effects (not directly Tailwind-mappable) ── */
  --h3d-blur-glass: blur(14px);
  --h3d-glass-bg: rgba(39, 21, 64, 0.9);
  --h3d-grain-opacity: 0.08;

  /* ── Typography: Line Heights ── */
  --h3d-leading-hero: 1.18;
  --h3d-leading-body: 1.82;
  --h3d-leading-lead: 1.8;

  /* ── Typography: Tracking ── */
  --h3d-tracking-logo: 0.12em;
  --h3d-tracking-cta: 0.22em;
  --h3d-tracking-label: 0.2em;
  --h3d-tracking-nav: 0.1em;
}
```

## Google Fonts Import (in nuxt.config.ts)

Use `@nuxtjs/google-fonts` module:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'EB Garamond': { ital: [400], wght: [400, 600] },
      Jost: [300, 400, 500, 600],
      'Rozha One': [400],
      'Noto Sans Devanagari': [400, 500],
    },
    display: 'swap',
    preload: true,
  },
})
```

## Tailwind Class Quick Reference

### Colors
| Token | Utility Classes |
|-------|----------------|
| Deep Plum background | `bg-h3d-base` |
| Surface/card background | `bg-h3d-surface` |
| Primary text (warm cream) | `text-h3d-text` |
| Secondary text (lavender) | `text-h3d-muted` |
| Borders | `border-h3d-border` |
| Rose gold accent | `bg-h3d-accent` / `text-h3d-accent` |
| Hover accent | `hover:bg-h3d-accent-hover` |
| Success | `text-h3d-success` |
| Error | `text-h3d-error` |

### Typography
| Element | Classes |
|---------|---------|
| Hero H1 | `font-h3d-display text-h3d-hero leading-[1.18]` |
| Section H2 | `font-h3d-display text-h3d-h2` |
| Sub-section H3 | `font-h3d-body text-h3d-h3 font-medium tracking-[0.06em]` |
| Card title H4 | `font-h3d-body text-h3d-h4` |
| Label H5 | `font-h3d-body text-h3d-h5 uppercase tracking-[0.2em]` |
| Lead paragraph | `font-h3d-display text-h3d-lead leading-[1.8]` |
| Body text | `font-h3d-body text-h3d-body leading-[1.82]` |
| CTA button text | `font-h3d-body text-h3d-cta font-semibold uppercase tracking-[0.22em]` |
| Nav link | `font-h3d-body text-h3d-nav font-medium tracking-[0.1em]` |

### Devanagari
| Element | Classes |
|---------|---------|
| Display heading (ne) | `font-h3d-devanagari` + add `lang="ne"` attribute |
| Body text (ne) | `font-h3d-devanagari-body` + add `lang="ne"` attribute |

## Gradient Presets (as Tailwind arbitrary values)

```html
<!-- Hero glow -->
<div class="bg-[radial-gradient(ellipse_at_65%_40%,var(--color-h3d-surface)_0%,var(--color-h3d-base)_75%)]">

<!-- Center glow -->
<div class="bg-[radial-gradient(circle_at_50%_50%,var(--color-h3d-surface)_0%,var(--color-h3d-base)_80%)]">
```

## Animation Presets

Define in `main.css` alongside the theme:

```css
@keyframes h3d-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes h3d-reveal {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.h3d-animate-in {
  animation: h3d-fade-up var(--duration-h3d-reveal) var(--ease-h3d) both;
}

@media (prefers-reduced-motion: reduce) {
  .h3d-animate-in { animation: none; opacity: 1; transform: none; }
}
```

## Component Snippet: H3dButton (Vue)

```vue
<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  as?: string | Component
}>()
</script>

<template>
  <component
    :is="as ?? 'button'"
    :class="[
      'inline-flex items-center justify-center transition-colors',
      'font-h3d-body text-h3d-cta font-semibold uppercase tracking-[0.22em]',
      'focus-visible:outline-2 focus-visible:outline-h3d-accent focus-visible:outline-offset-2',
      variant === 'secondary'
        ? 'border border-h3d-border text-h3d-muted hover:border-h3d-accent hover:text-h3d-text bg-transparent font-h3d-display italic tracking-[0.12em]'
        : 'bg-h3d-accent text-h3d-base hover:bg-h3d-accent-hover px-7 py-3.5',
    ]"
  >
    <slot />
  </component>
</template>
```

## Color Usage Ratio

- **70%** — Deep Plum (`bg-h3d-base`) — backgrounds, atmosphere
- **20%** — Violet Mid + Lavender (`bg-h3d-surface`, `text-h3d-muted`) — containers, readable areas
- **10%** — Rose Gold (`bg-h3d-accent`, `text-h3d-accent`) — CTAs, emotional highlights

## NEVER

- Use bright purple (reads as tech startup)
- Use pure white — always warm cream `text-h3d-text` (#F2EDE8)
- Use cold/blue-white tones anywhere
- Use rounded corners larger than `rounded-sm` (3px) — the brand is precise, not playful
