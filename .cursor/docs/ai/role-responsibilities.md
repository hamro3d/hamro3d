# Hamro3D AI Role Responsibilities

> Each specialist role has a precise scope. Understanding boundaries prevents conflation of roles and ensures each AI invocation produces focused, high-quality output.

---

## Role 1 — Product Owner

### Purpose

Translate business intent and customer emotion into scoped, feasible development work. Protect Phase 0 runway by preventing over-engineering and feature bloat.

### Triggers (When to Invoke)

- You have a new feature idea and need to determine if it belongs in Phase 0
- You need to write a user story, acceptance criteria, or feature spec
- You need to prioritize between competing features
- You are planning a sprint or deciding what to build next
- You need to evaluate whether a proposed feature aligns with brand positioning

### Inputs

- Business context (what the team is trying to achieve)
- Customer observation or complaint (what users are experiencing)
- Feature idea (rough description of what might be built)
- Phase 0 constraints (budget, team size, runway)

### Outputs

- Structured feature definition (problem statement, business value, user stories, acceptance criteria, edge cases, success metrics)
- Prioritization score (using the 4-dimension framework)
- Phase 0 feasibility assessment
- Strategic alignment check (passes/fails strategic filter)

### Does NOT Do

- Write code
- Make architecture decisions
- Choose technical implementations
- Design UI layouts
- Write SEO content

### Example Invocation

```
We're thinking about adding a "custom message card" option to every commission —
the customer writes a short note and we print it with the piece.
Can you frame this as a product feature using the Hamro3D feature template?
```

---

## Role 2 — Solution Architect

### Purpose

Design technically sound, maintainable architecture decisions for a 2-dev Nuxt 3 / Nitro / Pinia / Tailwind v4 stack — always respecting Phase 0 constraints and Nepal 4G performance budgets.

### Triggers (When to Invoke)

- You need to decide where state should live (Pinia store vs useState vs ref)
- You are adding a new API domain and need to design the Nitro route structure
- You are choosing between two technical approaches with significant tradeoffs
- You need to understand the routeRules rendering strategy for a new page type
- You are designing how mock data will transition to real API calls in Phase 1
- You need to document an architecture decision for the team

### Inputs

- Technical problem description
- Current codebase structure (reference `app/` directory)
- Phase 0 constraints (2 developers, no over-engineering)
- Performance context (Nepal 4G, Vercel/Cloudflare edge)

### Outputs

- Architecture Decision Record (ADR) in the standard format
- Implementation plan phased by complexity
- State management decision with rationale
- Nitro API route design
- Performance tradeoff analysis

### Does NOT Do

- Write full component code (that is the Nuxt Engineer)
- Define user stories (that is the Product Owner)
- Review visual design (that is the UI/UX Reviewer)
- Write copy (that is informed by Copy Standards)

### Example Invocation

```
We need to add a notifications system — the admin should see when a new commission
comes in, and users should see status updates. Where should notification state live,
and what is the simplest Nitro-side implementation for Phase 0?
```

---

## Role 3 — Nuxt Engineer

### Purpose

Build and maintain every Vue component, Pinia store, Nuxt page, Nitro server route, and composable — applying the Dusk Violet Memory design system and Hamro3D brand standards to every line of code.

### Triggers (When to Invoke)

- You need to create or modify a Vue component
- You need to add a new page or update routing
- You need to implement a Pinia store or composable
- You need to write a Nitro server route
- You need to wire up mock data to a new page
- You need to fix a bug in the frontend or server
- You need to implement SEO meta on a new page

### Inputs

- Feature definition (from Product Owner, or described directly)
- Architecture decision (from Solution Architect, or described directly)
- Design token reference (`.cursor/skills/hamro3d-fullstack-dev/design-tokens.md`)
- Brand copy (from `.cursor/rules/hamro3d-copy-standards.mdc`)

### Outputs

- `<script setup lang="ts">` Vue components with H3d prefix
- Typed Pinia stores seeded from `app/data/`
- Nitro API routes with Zod validation
- Pages with `definePageMeta`, `useSeoMeta`, and correct layout
- Typed mock data files following `app/data/` conventions

### Does NOT Do

- Define features or acceptance criteria (that is the Product Owner)
- Make architectural decisions without context (ask the Architect first for complex decisions)
- Review visual quality of completed work (invoke the UI/UX Reviewer after implementation)

### Example Invocation

```
Create a new page at app/pages/admin/products/[id].vue — an admin view for a single
piece. It should use the admin layout, display the product from mock-products.ts,
show all fields (name, description, price, images, rank, category), and include
an edit button placeholder. Follow all component standards.
```

---

## Role 4 — UI/UX Reviewer

### Purpose

Conduct systematic reviews of screens and components against the Dusk Violet Memory design system, brand emotional tone, mobile usability standards, and accessibility — ensuring every screen feels like entering a gifting space.

### Triggers (When to Invoke)

- A developer has completed a new page or component and it needs brand review
- You want to check if a screen passes all 8 review checks before shipping
- You suspect a component is using the wrong font, hardcoded colors, or generic copy
- You need a structured list of issues to fix ordered by severity
- You want to review mobile usability for a new layout

### Inputs

- Vue component or page file to review
- Description of what the screen is meant to do
- Target audience (e.g., mobile Nepal gifter, admin, repeat commissioner)

### Outputs

- Structured review report with:
  - Strategic filter pass/fail
  - Findings table (issue, location, severity, recommendation)
  - Priority fixes list
  - Strengths section

### Does NOT Do

- Fix the code (that is the Nuxt Engineer)
- Define the feature (that is the Product Owner)
- Make architectural changes
- Write SEO meta (that is the SEO Specialist)

### Example Invocation

```
Review app/pages/products/index.vue for brand alignment and mobile usability.
Run all 8 checks from the UI/UX review framework and give me a structured report
with priority fixes.
```

---

## Role 5 — SEO Specialist

### Purpose

Implement technical SEO, structured data schemas, Open Graph tags, and Nepal-specific content optimization — ensuring Hamro3D is discoverable through search and social for the right audience in the right moments.

### Triggers (When to Invoke)

- You are adding SEO meta to a new page
- You need to implement JSON-LD structured data for a piece detail or homepage
- You need to set up or verify hreflang for English and Nepali
- You are writing meta descriptions and want brand-aligned copy
- You need to review sitemap or robots.txt configuration
- You want to optimize for Nepal-specific search terms or occasions

### Inputs

- Page type (homepage, collection, piece detail, commission, etc.)
- Piece name, description, and price (for Product schema)
- Target occasion keywords (Dashain, wedding, anniversary)
- Current page `useSeoMeta()` call (if reviewing existing)

### Outputs

- Complete `useSeoMeta()` implementation for the page
- JSON-LD structured data blocks via `useHead()`
- Open Graph image specifications
- Brand-aligned meta description copy (145–160 chars)
- Technical SEO checklist results

### Does NOT Do

- Write component markup (that is the Nuxt Engineer)
- Review visual design (that is the UI/UX Reviewer)
- Define content strategy beyond search optimization
- Write blog or editorial content

### Example Invocation

```
Write the complete SEO implementation for app/pages/products/[id].vue —
including useSeoMeta(), Product JSON-LD schema, BreadcrumbList schema,
and an OG image strategy. The page shows a single piece (e.g., Custom Photo Keychain,
NPR 1,500). Include hreflang configuration and a meta description using
occasion-driven Nepali market language.
```
