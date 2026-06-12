# Hamro3D AI System Overview

> This document describes the AI development team built into the Hamro3D Cursor workspace. It exists to make every AI interaction consistent with the brand, technically sound, and productive for a small team.

---

## What This System Is

The Hamro3D AI system is a set of five specialist AI roles, four shared coding rules, and documentation — all embedded into the Cursor IDE via `.cursor/skills/` and `.cursor/rules/`.

Each role is a SKILL file that teaches an AI agent how to think, decide, and produce output as a specific specialist on the Hamro3D team. Rules are automatic guardrails applied to matching files. Together they form a structured multi-role AI development workflow.

This system exists because:
- Hamro3D has a strong, specific brand identity that generic AI does not know
- The codebase has established patterns (H3d prefix, h3d- tokens, sibling routes) that must be consistent
- A 2–3 person team cannot afford rework caused by AI outputs that miss brand or technical standards
- Every output — code, copy, architecture decision, SEO tag — must pass one filter: *"Does this feel like a memory — or just a product?"*

---

## The Five Specialist Roles

| Role | Skill File | Single-Line Purpose |
|---|---|---|
| **Product Owner** | `.cursor/skills/hamro3d-product-owner/SKILL.md` | Frames features as emotional problems, scopes Phase 0 work, protects brand from generic e-commerce thinking |
| **Solution Architect** | `.cursor/skills/hamro3d-solution-architect/SKILL.md` | Makes architecture decisions for a 2-dev Nuxt 3 / Nitro / Pinia stack, Nepal 4G performance budget |
| **Nuxt Engineer** | `.cursor/skills/hamro3d-fullstack-dev/SKILL.md` | Builds and maintains every Vue component, Pinia store, Nitro route, and page — brand-first |
| **UI/UX Reviewer** | `.cursor/skills/hamro3d-ui-ux-reviewer/SKILL.md` | Reviews every screen against the Dusk Violet Memory design system and emotional quality standard |
| **SEO Specialist** | `.cursor/skills/hamro3d-seo-specialist/SKILL.md` | Implements technical SEO, structured data, and Nepal-specific content optimization |

---

## How Roles Relate to the Brand Mission

Hamro3D's mission is: **Preserve meaningful human moments in tangible form.**

Every role serves this mission differently:

```
Product Owner    → ensures features serve memory-preservation, not generic commerce
Solution Architect → ensures architecture enables artisan-quality experiences, not commodity speed
Nuxt Engineer    → ensures every component evokes emotion, not just functionality
UI/UX Reviewer   → ensures every screen feels like entering a gifting space
SEO Specialist   → ensures people find Hamro3D through meaning, not keyword stuffing
```

---

## Files Each Role Reads Before Acting

| Role | Mandatory reads |
|---|---|
| Product Owner | `.cursor/docs/brand/1. hamro3d-brand-foundation.md`, `.cursor/docs/brand/2. hamro3d-brandguidelines.md`, `.cursor/docs/brand/3. hamro3d-ui-ux-system-plan.md`, `.cursor/skills/hamro3d-fullstack-dev/SKILL.md` |
| Solution Architect | `.cursor/rules/hamro3d-nuxt-engineering.mdc`, `.cursor/rules/hamro3d-web-standards.mdc`, `.cursor/skills/hamro3d-fullstack-dev/SKILL.md`, `.cursor/skills/hamro3d-fullstack-dev/design-tokens.md`, `.cursor/docs/brand/1. hamro3d-brand-foundation.md` |
| Nuxt Engineer | `.cursor/docs/brand/1. hamro3d-brand-foundation.md`, `.cursor/docs/brand/2. hamro3d-brandguidelines.md`, `.cursor/skills/hamro3d-fullstack-dev/design-tokens.md` |
| UI/UX Reviewer | `.cursor/rules/hamro3d-design-system.mdc`, `.cursor/skills/hamro3d-fullstack-dev/design-tokens.md`, `.cursor/docs/brand/2. hamro3d-brandguidelines.md`, `.cursor/docs/brand/3. hamro3d-ui-ux-system-plan.md`, `.cursor/rules/hamro3d-component-standards.mdc` |
| SEO Specialist | `.cursor/rules/hamro3d-web-standards.mdc`, `.cursor/rules/hamro3d-nuxt-engineering.mdc`, `.cursor/docs/brand/1. hamro3d-brand-foundation.md`, `.cursor/rules/hamro3d-copy-standards.mdc` |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HAMRO3D AI SYSTEM                               │
│                                                                     │
│  ┌──────────────────┐   ┌──────────────────┐                       │
│  │  BRAND RULES     │   │  CODE RULES      │                       │
│  │  (alwaysApply)   │   │  (glob-scoped)   │                       │
│  │                  │   │                  │                       │
│  │ brand-identity   │   │ typescript-      │                       │
│  │ design-system    │   │   standards      │                       │
│  │ web-standards    │   │ component-       │                       │
│  │ nuxt-engineering │   │   standards      │                       │
│  └──────┬───────────┘   │ data-conventions │                       │
│         │               │ copy-standards   │                       │
│         │               └──────┬───────────┘                       │
│         │                      │                                    │
│         └──────────┬───────────┘                                    │
│                    │                                                │
│                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SPECIALIST SKILLS                         │   │
│  │                                                              │   │
│  │  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐  │   │
│  │  │  Product    │  │   Solution     │  │  Nuxt Engineer  │  │   │
│  │  │   Owner     │  │  Architect     │  │  (fullstack-dev)│  │   │
│  │  └─────────────┘  └────────────────┘  └─────────────────┘  │   │
│  │                                                              │   │
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐  │   │
│  │  │   UI/UX Reviewer    │  │      SEO Specialist         │  │   │
│  │  └─────────────────────┘  └─────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                    │                                                │
│                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    BRAND SOURCES                             │   │
│  │  .cursor/docs/brand/1. hamro3d-brand-foundation.md                  │   │
│  │  .cursor/docs/brand/2. hamro3d-brandguidelines.md                   │   │
│  │  .cursor/docs/brand/3. hamro3d-ui-ux-system-plan.md                 │   │
│  │  .cursor/docs/brand/4. hamro3d-ui-tech-rules.md                     │   │
│  │  .cursor/skills/hamro3d-fullstack-dev/design-tokens.md      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How Skills and Rules Relate

**Rules** are automatic. Cursor applies them whenever you work on files that match their glob pattern, without needing to invoke them explicitly.

| Rule | Glob | When it activates |
|---|---|---|
| `hamro3d-brand-identity` | — (alwaysApply) | Every interaction |
| `hamro3d-design-system` | — (alwaysApply) | Every interaction |
| `hamro3d-web-standards` | — (alwaysApply) | Every interaction |
| `hamro3d-nuxt-engineering` | — (alwaysApply) | Every interaction |
| `hamro3d-typescript-standards` | `**/*.{ts,tsx,vue}` | When editing TS/Vue files |
| `hamro3d-component-standards` | `**/*.vue` | When editing Vue files |
| `hamro3d-data-conventions` | `app/data/**` | When editing mock data |
| `hamro3d-copy-standards` | `**/*.{vue,ts,md}` | When editing copy-bearing files |

**Skills** are intentional. You invoke them by describing a task that matches their trigger words. The AI agent reads the skill file and adopts that specialist role for the conversation.

> Rules protect the floor. Skills raise the ceiling.
