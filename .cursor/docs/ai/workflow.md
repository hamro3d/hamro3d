# Hamro3D AI Development Workflow

> This document defines the recommended sequence for using the Hamro3D AI specialist roles to take a feature from idea to production-ready code.

---

## The Full Development Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│                    FEATURE DEVELOPMENT PIPELINE                    │
│                                                                    │
│  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │   PRODUCT    │   │    SOLUTION      │   │  NUXT ENGINEER   │  │
│  │    OWNER     │──▶│   ARCHITECT      │──▶│                  │  │
│  │              │   │                  │   │                  │  │
│  │ • Problem    │   │ • ADR            │   │ • Components     │  │
│  │ • User story │   │ • Route design   │   │ • Pages          │  │
│  │ • Criteria   │   │ • State decision │   │ • Stores         │  │
│  │ • Scope      │   │ • Phase plan     │   │ • Server routes  │  │
│  └──────────────┘   └──────────────────┘   └────────┬─────────┘  │
│                                                      │            │
│                                         ┌────────────▼──────────┐ │
│                                         │    UI/UX REVIEWER    │ │
│                                         │                      │ │
│                                         │ • 8-check review     │ │
│                                         │ • Issue report       │ │
│                                         │ • Priority fixes     │ │
│                                         └────────────┬──────────┘ │
│                                                      │            │
│                                         ┌────────────▼──────────┐ │
│                                         │   SEO SPECIALIST     │ │
│                                         │                      │ │
│                                         │ • useSeoMeta()       │ │
│                                         │ • JSON-LD schema     │ │
│                                         │ • OG strategy        │ │
│                                         └────────────┬──────────┘ │
│                                                      │            │
│                                                      ▼            │
│                                              READY TO SHIP        │
└────────────────────────────────────────────────────────────────────┘
```

---

## Stage-by-Stage Handoffs

### Stage 1: Product Owner → Solution Architect

**What the Product Owner produces:**
- Feature definition document (problem, user stories, acceptance criteria)
- Phase 0 feasibility confirmation
- Strategic filter result (passes/fails)
- Success metrics

**What the Solution Architect consumes:**
- The feature's data requirements (what needs to be stored, fetched, computed)
- The user journey flow (which routes are involved)
- Phase 0 constraints (is this a mock-data feature or does it need a real API?)

**Handoff checkpoint:** The Solution Architect should be able to answer "what files need to be created and where?" before any code is written.

---

### Stage 2: Solution Architect → Nuxt Engineer

**What the Solution Architect produces:**
- Route structure decision (which pages/API routes are needed)
- State management decision (Pinia store, useState, or ref)
- Rendering strategy (ISR, SSR, or prerender for new routes)
- Phase 0 implementation plan (mock-first, then replace with API)
- TypeScript interface designs (if complex)

**What the Nuxt Engineer consumes:**
- List of files to create (pages, components, stores, server routes)
- State boundaries (what lives where)
- Data shape (interfaces, mock data structure)
- Route rules to add to `nuxt.config.ts`

**Handoff checkpoint:** The Nuxt Engineer should be able to implement without architectural guesswork.

---

### Stage 3: Nuxt Engineer → UI/UX Reviewer

**What the Nuxt Engineer produces:**
- Working Vue components, pages, and layouts
- Pinia stores seeded from `app/data/`
- Mock data files in `app/data/`
- All routes functional

**What the UI/UX Reviewer consumes:**
- The completed page or component files
- Description of the intended user and use case
- Any known constraints or concerns

**Handoff checkpoint:** The Nuxt Engineer should not mark a feature "done" until the UI/UX Reviewer has run all 8 checks.

---

### Stage 4: UI/UX Reviewer → Nuxt Engineer (Fixes) → SEO Specialist

**What the UI/UX Reviewer produces:**
- Structured review report with all findings
- Priority fix list (Critical → High → Medium → Low)
- Strengths section

**What the Nuxt Engineer does:**
- Implements all Critical and High priority fixes
- Optionally fixes Medium and Low items

**What the SEO Specialist consumes:**
- Completed, reviewed page
- Page type (for correct schema selection)
- Piece data (for Product schema)

**What the SEO Specialist produces:**
- Complete `useSeoMeta()` block
- JSON-LD structured data
- OG image specification
- Hreflang verification

---

## When to Skip Stages

Not every change requires the full pipeline. Use the decision guide:

| Change type | Stages to use |
|---|---|
| Small bug fix (e.g., wrong color token) | Nuxt Engineer only |
| Copy update | Nuxt Engineer + copy review against `hamro3d-copy-standards.mdc` |
| New page, data from existing mock | Nuxt Engineer → UI/UX Reviewer → SEO Specialist |
| New page with new data shape | Solution Architect → Nuxt Engineer → UI/UX Reviewer → SEO Specialist |
| New feature idea | Full pipeline |
| SEO update to existing page | SEO Specialist only |
| Design system token addition | Solution Architect + Nuxt Engineer |
| Performance investigation | Solution Architect only |
| Mock data update | Nuxt Engineer (data conventions rule applies automatically) |

---

## Phase 0 Lean Workflow (2–3 Person Team)

In Phase 0, the same person often wears multiple hats. Use these shortcuts:

### For new pages (no new data required):
1. Invoke **Nuxt Engineer** with the page spec
2. After implementation, run **UI/UX Reviewer** check yourself (work through the 8 checks)
3. Add `useSeoMeta()` using the **SEO Specialist** template

### For new features (new data shape required):
1. Spend 5 minutes writing a feature definition (use the **Product Owner** template)
2. Decide on state management (use the **Solution Architect** decision matrix)
3. Invoke **Nuxt Engineer** with both the feature definition and state decision
4. Run the UI/UX and SEO steps above

### Lean principle:
> The pipeline exists to catch problems early. In Phase 0, catching one wrong architecture decision or brand misalignment early saves a day of rework.

---

## Feedback Loop

When the UI/UX Reviewer or SEO Specialist finds issues that reveal a structural problem (e.g., a whole page needs redesign, or a route was structured wrong), escalate back up the pipeline:

```
UI/UX Reviewer finds structural issue
    → back to Nuxt Engineer for fix
    → if architectural → back to Solution Architect for ADR
    → then forward again through Reviewer → SEO Specialist
```

The loop always ends at SEO Specialist before shipping.
