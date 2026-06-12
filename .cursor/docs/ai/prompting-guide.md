# Hamro3D AI Prompting Guide

> How to write prompts that produce consistent, brand-aligned outputs from each specialist role. Good prompts load context, state constraints, and define the desired output format.

---

## How to Write Effective Prompts

Every prompt that produces great Hamro3D output follows this pattern:

```
1. State the role (optional — Cursor picks up from trigger words)
2. Provide context (what page, what feature, what constraint)
3. Reference relevant files with @
4. Define the output format (what you want back)
5. State any explicit constraints (do not change X, stay consistent with Y)
```

---

## Template Prompts by Scenario

### Adding a New Piece / Product Type

**Context:** You want to add a new product category (e.g., custom figurines) to the mock catalogue and product listing.

```
Add a new piece type called "Custom Figurine" to the mock product catalogue.

Context:
- Phase 0 — use mock data in @app/data/mock-products.ts
- The figurine should have a rank of 1 (top featured)
- Price: NPR 4,500 starting
- Category: figurine
- Image placeholder: /images/products/figurine-placeholder.jpg

Requirements:
- Add 2–3 new MockProduct entries to @app/data/mock-products.ts
- Follow the existing product interface exactly
- Ensure IDs are unique (check existing IDs before adding)
- Use brand copy in name and description fields ("piece" not "product")
- Update the rank field to ensure the new piece appears in the homepage top 3 if appropriate

Output: The updated mock-products.ts entries only.
```

---

### Building a New Page (Profile Section)

**Context:** You need to add a new profile section page, e.g., saved addresses.

```
Create a new page at app/pages/profile/addresses/index.vue — the user's saved
delivery addresses.

Context:
- Layout: profile
- Mock data: create a new mock-addresses.ts in @app/data/ following the data conventions
- Design: match the visual pattern of @app/pages/profile/orders/index.vue
  (same card-based layout, same spacing, same empty state pattern)

Requirements:
- definePageMeta({ layout: 'profile' }) as first statement
- useSeoMeta with warm copy
- Use sibling route pattern (index.vue, not addresses.vue)
- Empty state: "No addresses saved yet." with link to commission page
- Each address card: name, full address lines, city, phone
- Trailing action: "Remove" link (no functionality needed — Phase 0 placeholder)
- Follow @.cursor/rules/hamro3d-component-standards.mdc exactly
- Follow @.cursor/rules/hamro3d-typescript-standards.mdc exactly

Do NOT create a detail page — only the list for now.
```

---

### Building a New Page (Admin Section)

**Context:** You need to build the admin user list page.

```
Create the admin user list page at app/pages/admin/users/index.vue.

Context:
- Layout: admin
- Mock data: create app/data/mock-admin-users.ts with 4–5 sample users
  Each user: id (string), name, email, phone, joinDate (ISO string),
  commissionsCount (number), status ('Active' | 'Inactive')
- Visual pattern: match @app/pages/admin/orders/index.vue (table layout)

Requirements:
- definePageMeta({ layout: 'admin' }) first
- useSeoMeta({ title: 'Users · Hamro3D Studio' })
- Table columns: Name, Email, Phone, Member Since, Commissions, Status, Action
- Status badge using statusBadgeClass pattern (Active = success, Inactive = muted)
- Action column: "View" NuxtLink to /admin/users/:id (placeholder route — no detail page yet)
- Empty state: "No members in the studio yet."
- Follow all component, TypeScript, and data conventions
```

---

### Reviewing a Component for Brand Alignment

**Context:** You want a systematic review before shipping a component.

```
Run a full UI/UX review on @app/pages/products/index.vue.

Apply all 8 checks from the hamro3d-ui-ux-reviewer skill:
1. Emotional tone
2. Brand consistency (h3d- tokens only)
3. Typography hierarchy
4. Spacing rhythm
5. Mobile experience (test at 375px mentally)
6. Accessibility
7. Conversion
8. Empty and loading states

Output format: structured review report with:
- Strategic filter result (pass/fail)
- Findings table (issue, location, severity, recommendation)
- Priority fixes (ordered Critical → High → Medium)
- Strengths section

Be specific about line numbers and class names where relevant.
```

---

### Creating a New Pinia Store

**Context:** You need to add a new store, e.g., for notifications.

```
Create a new Pinia store at app/stores/notifications.ts.

Context:
- Phase 0 — no API, mock state only
- A notification has: id (string), type ('commission' | 'status_update' | 'system'),
  message (string), read (boolean), createdAt (string ISO)
- Admin only sees commission notifications
- Users see status update notifications

Requirements:
- Use Setup Store syntax (arrow function), not Options Store
- State: notifications ref<MockNotification[]> seeded with 2–3 mock entries inline
  (no separate data file needed — too small for Phase 0)
- Getters: unreadCount (computed), adminNotifications (computed), userNotifications (computed)
- Actions: markRead(id), markAllRead(), clear()
- Export: useNotificationStore
- Follow @.cursor/rules/hamro3d-typescript-standards.mdc
- No any, no enums — union type for notification type
```

---

### Adding Server Routes / API Endpoints

**Context:** You're graduating a mock data endpoint to a real Nitro API.

```
Create a Nitro API route at server/api/pieces/index.get.ts that returns all pieces.

Context:
- Phase 1 — replacing mock-products.ts with a real API response
- For now, the handler can return the same data as mockProducts from
  @app/data/mock-products.ts (import and return it — Phase 1.0 migration step)
- Shape the response to match the existing MockProduct interface

Requirements:
- File: server/api/pieces/index.get.ts
- Method: GET
- Return: { pieces: MockProduct[], total: number }
- No validation needed for GET (no body)
- Use createError() for error cases
- Add a TODO comment: "// TODO Phase 1.1 — replace with DB query"
- Follow @.cursor/rules/hamro3d-nuxt-engineering.mdc Nitro patterns
```

---

### Optimizing SEO for a New Page

**Context:** A new page has been built and needs complete SEO implementation.

```
Add complete SEO implementation to @app/pages/products/[id].vue.

Context:
- This is the piece detail page — shows a single piece by ID
- Piece data comes from getMockProductById(route.params.id)
- Piece has: name, description, price (NPR), image, category

Requirements:
1. useSeoMeta() with:
   - title: "[piece.name] · Hamro3D"
   - description: 145–160 chars, warm brand voice, reference Nepali occasion
   - ogTitle, ogDescription, ogImage: piece.image
   - ogType: 'product'
   - ogLocale: 'en_NP'
   - twitterCard: 'summary_large_image'

2. useHead() with JSON-LD structured data:
   - Product schema (name, price NPR, image, availability, brand: Hamro3D)
   - BreadcrumbList: Home → Pieces → [piece.name]

3. Meta description example to match (do not use verbatim, adapt to piece):
   "A [piece.name] handcrafted in Kathmandu — made to preserve a memory and
    perfect as a personal gift for Dashain, anniversaries, or any occasion
    that deserves something lasting."

Follow @.cursor/rules/hamro3d-web-standards.mdc SEO patterns.
```

---

### Conducting a UX Review of a Feature

**Context:** You've built a multi-step commission form and want a UX review.

```
Conduct a UX review of the commission flow across these files:
- @app/pages/commission.vue
- @app/components/commission/H3dCommissionForm.vue
- @app/components/commission/H3dCommissionSteps.vue

Focus especially on:
- Mobile experience at 375px (this is the primary device for Nepal users)
- Emotional tone (does it feel like beginning something meaningful or filling out a form?)
- Conversion (is the CTA visible? Is there too much friction before the user can express intent?)
- Copy alignment (brand vocabulary throughout)

Output: structured review report.
For mobile experience and conversion, be especially detailed.
```

---

## Anti-Patterns (What Produces Bad Results)

These prompt patterns consistently produce outputs that miss brand or technical standards:

| Anti-pattern | Why it fails | Better approach |
|---|---|---|
| `"Add a product page"` | Generic — produces generic e-commerce output | `"Add a piece detail page at app/pages/products/[id].vue following the Hamro3D component standards"` |
| `"Make this look better"` | No measurable criteria | `"Review against the 8-check UI/UX framework and give me specific fixes"` |
| `"Add SEO"` | Vague — produces generic meta tags | `"Add useSeoMeta() and Product JSON-LD schema following the SEO specialist template"` |
| `"Create an API endpoint"` | No method, path, or shape | Specify: file path, HTTP method, request/response shape, Zod schema |
| `"Add a store for X"` | Missing state shape and seed strategy | Specify: state interface, getters needed, actions needed, Phase 0 seed data |

---

## Context-Loading: Which Files to @ Per Scenario

### Always helpful to include:

- `.cursor/skills/hamro3d-fullstack-dev/design-tokens.md` — for any UI work
- `.cursor/rules/hamro3d-component-standards.mdc` — for any Vue component
- `.cursor/rules/hamro3d-typescript-standards.mdc` — for any TypeScript file

### Per scenario:

| Scenario | @ these files |
|---|---|
| New page | Adjacent existing page (for visual reference), relevant layout file, `hamro3d-component-standards.mdc` |
| New store | Existing store (e.g., `app/stores/cart.ts`), relevant mock data file |
| New mock data | Existing mock file (e.g., `app/data/mock-user-orders.ts`), `hamro3d-data-conventions.mdc` |
| SEO implementation | `hamro3d-web-standards.mdc`, `hamro3d-copy-standards.mdc` |
| UI/UX review | The page/component being reviewed, `design-tokens.md` |
| Architecture decision | `hamro3d-nuxt-engineering.mdc`, `hamro3d-web-standards.mdc`, existing similar files |
| Feature definition | `.cursor/docs/brand/1. hamro3d-brand-foundation.md`, `.cursor/docs/brand/3. hamro3d-ui-ux-system-plan.md` |
| Copy writing | `hamro3d-copy-standards.mdc`, `.cursor/docs/brand/1. hamro3d-brand-foundation.md` |
