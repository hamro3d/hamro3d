# Hamro3D — Nuxt 3 Web Application

A premium, emotionally-driven craft brand web application built with Nuxt 3, Vue 3, Tailwind CSS v4, and the Dusk Violet Memory design system.

**Purpose:** Preserve meaningful human moments in tangible form.

## Stack

- **Framework:** Nuxt 3 (Vue 3 Composition API)
- **Styling:** Tailwind CSS v4 with `h3d-` token system
- **Server:** Nitro for API routes
- **State:** Pinia (global), `useState` (SSR-safe shared)
- **i18n:** English + Nepali (Devanagari support)
- **Images:** Nuxt Image with WebP optimization
- **Validation:** Zod for runtime schema validation

## Getting Started

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## Project Structure

```
hamro3d-ui/
├── app.vue                   # Root shell
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.ts        # Tailwind token system
├── app/
│   ├── assets/css/           # Main styles + Tailwind
│   ├── components/           # UI, layout, product, commission, shared
│   ├── composables/          # Reusable composition API functions
│   ├── layouts/              # default, checkout
│   ├── pages/                # File-based routing
│   ├── plugins/              # Nuxt plugins
│   ├── middleware/           # Route middleware
│   ├── stores/               # Pinia stores
│   ├── types/                # TypeScript interfaces
│   └── utils/                # Auto-imported utilities
├── server/
│   ├── api/                  # Nitro API routes
│   ├── middleware/           # Server middleware
│   └── utils/                # Server utilities
├── public/                   # Static assets, OG images
├── docs/brand/               # Brand foundation & guidelines
└── logo/                     # Brand logo assets
```

## Design System

All colors, typography, and spacing use the **Dusk Violet Memory** palette via Tailwind `h3d-` token classes:

- **Colors:** `bg-h3d-base`, `text-h3d-text`, `text-h3d-accent`, etc.
- **Typography:** `font-h3d-display`, `font-h3d-body`, sized via `text-h3d-hero`, `text-h3d-h2`, etc.
- **Spacing:** `p-h3d-md`, `py-h3d-section`, `gap-h3d-gutter`

See `.cursor/rules/hamro3d-design-system.mdc` for full reference.

## Key Standards

- **Performance:** Images via `<NuxtPicture>` with WebP, LCP < 2.5s on 4G
- **SEO:** Every page uses `useSeoMeta()` with OG/Twitter cards
- **Accessibility:** Semantic HTML, focus states, ARIA, 1.82 line-height
- **Code:** TypeScript strict mode, Vue 3 Composition API with `<script setup lang="ts">`
- **Rendering:** ISR for collections/pieces, SSR for commission, prerender for static pages
- **Copy:** "Commission" not "Order", "Piece" not "Product"

## Development Guidelines

Refer to:
- `.cursor/rules/hamro3d-brand-identity.mdc` — Brand values & strategic filter
- `.cursor/rules/hamro3d-design-system.mdc` — Colors, typography, components
- `.cursor/rules/hamro3d-web-standards.mdc` — Performance, accessibility, SEO
- `.cursor/rules/hamro3d-nuxt-engineering.mdc` — Architecture, code conventions
- `.cursor/skills/hamro3d-fullstack-dev/SKILL.md` — Senior engineer persona

**Strategic Filter:**
> "Does this feel like a memory — or just a product?"

If it feels like just a product, it does not align with Hamro3D.

## License

Private — Hamro3D brand
