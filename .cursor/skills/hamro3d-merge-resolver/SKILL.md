---
name: hamro3d-merge-resolver
description: >-
  Resolves Git merge conflicts between two branches for the Hamro3D Nuxt 3
  codebase without compromising any feature from either branch. Treats the
  first branch as the priority branch — its intent always wins on a direct
  clash. Inspects conflict regions file-by-file, preserves Nuxt 3 / Vue 3 /
  Tailwind v4 conventions, Dusk Violet Memory tokens, and Hamro3D brand
  language. Triggers on: merge conflict, branch merge, resolve conflict, git
  merge, feature merge, priority branch, combine branches, conflict resolution.
---

# Hamro3D — Merge Conflict Resolver

Resolve merge conflicts between two branches without losing any feature from
either branch. The **first branch is the priority branch** — its version of
any direct clash is the default winner unless the other branch's version is
strictly additive or fixes a bug that the priority branch does not address.

## Invocation

The user calls this skill with:

```
/hamro3d-merge-resolver <priority-branch> <secondary-branch>
```

Example:

```
/hamro3d-merge-resolver feat/memories-page feat/navbar-revamp
```

## Step 0 — Gather branch information

Run the helper script to collect all facts before touching any file:

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/analyze-conflict.sh \
  <priority-branch> <secondary-branch>
```

The script prints:

- Files with conflicts
- Files changed only in the priority branch
- Files changed only in the secondary branch
- Files changed in both (potential conflicts)
- Commit summary for each branch

Read the output in full before proceeding.

## Step 1 — Classify every conflicted file

For each file listed under "conflicts", assign it one of four categories:

| Category | Description |
|----------|-------------|
| **Priority-wins** | The clash is on the same logic/block; priority branch version is correct |
| **Secondary-wins** | The secondary branch fixes a bug or adds something the priority branch breaks or lacks |
| **Both-needed** | Each branch adds distinct code — both halves must be kept |
| **Manual-inspect** | Logic is deeply intertwined; surface it to the user before resolving |

## Step 2 — Resolution rules by file type

### `*.vue` — Component and page files

1. Check `<script setup>` blocks:
   - Keep all `import` statements from both branches (deduplicate identical ones).
   - For the same variable/composable declared differently, use priority branch version; add a code comment `// merged: secondary added X` if secondary branch had a distinct value.
   - Keep all `definePageMeta`, `useSeoMeta`, `useRoute` from both where non-conflicting.

2. Check `<template>` blocks:
   - Priority branch markup wins on any direct clash in the same element.
   - If secondary branch adds a new section/block that does not exist in priority branch, append it in the logical position (below priority content unless layout semantics demand otherwise).
   - Never delete a Hamro3D component (`H3d*`) from either branch without explicit user instruction.

3. Check `<style>` blocks (should be rare — Tailwind-only project):
   - If a `<style scoped>` block exists in only one branch, keep it.
   - On clash, defer to priority branch.

### `*.ts` — Composables, stores, data, server routes

1. Deduplicate imports from both branches.
2. Keep all exported functions/constants from both branches.
3. On a direct conflict in the same function body, use priority branch logic; note the secondary branch's alternative in a `// NOTE:` comment for human review.
4. TypeScript interface fields: merge all fields from both branches (union of fields). If the same field has different types, use priority branch type and flag it.
5. Mock data arrays: append secondary branch entries if their `id` values are unique. On ID clash, keep priority branch entry.

### `app/assets/css/main.css` — Design tokens

- Never remove any `@theme` CSS variable that exists in either branch.
- Priority branch value wins on a variable value clash.
- Append new variables from secondary branch after the last token in their group.

### `nuxt.config.ts`

- Merge `modules` arrays (deduplicate).
- Merge `routeRules` (priority branch wins on key clash).
- Merge `runtimeConfig` (priority branch wins on key clash).
- Keep all `vite.plugins` from both branches.

### `package.json`

- Merge `dependencies` and `devDependencies` (keep higher semver on version clash).
- Merge `scripts` (priority branch wins on key clash).

### `public/` — Static assets

- Keep all assets from both branches.
- On filename clash, keep priority branch file; rename secondary branch file as `<name>-secondary.<ext>` and tell the user.

## Step 3 — Apply resolutions

For each file:

1. Read the raw conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
2. Apply the resolution rule from Step 2.
3. Write the resolved file using `StrReplace` or `Write` — never leave conflict markers in the output.
4. Validate with `ReadLints` after editing each `.vue` or `.ts` file.

## Step 4 — Post-merge verification checklist

After all files are resolved, run through this checklist:

```
- [ ] No conflict markers remain (grep for <<<<<<<)
- [ ] All H3d* components still exist (no accidental deletion)
- [ ] All Tailwind h3d- tokens still present in main.css
- [ ] All page routes still have useSeoMeta and definePageMeta
- [ ] All mock data files export required: type, interface, array, lookup fn
- [ ] nuxt.config.ts has no duplicate module entries
- [ ] package.json has no duplicate dependency keys
- [ ] ReadLints returns no new errors on edited files
```

Run the verification script:

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/verify-merge.sh
```

## Step 5 — Summary report

After resolution, produce a report in this format:

```
## Merge Resolution Summary
Priority branch : <priority-branch>
Secondary branch: <secondary-branch>

### Files resolved
| File | Category | Notes |
|------|----------|-------|
| app/pages/memories/index.vue | Both-needed | Added secondary navbar slot above priority hero |
| app/assets/css/main.css      | Priority-wins | Secondary had duplicate --h3d-accent value |

### Features preserved from priority branch
- <list>

### Features preserved from secondary branch
- <list>

### Items requiring manual review
- <list any Manual-inspect items with specific line numbers>

### Conflicts discarded (neither branch kept)
- <list any deliberate drops with justification>
```

## Brand guardrails during merge

- Never replace Hamro3D brand copy with generic text from either branch.
- Never change `font-h3d-*`, `text-h3d-*`, or `bg-h3d-*` token names.
- If one branch removed Devanagari (`हाम्रो 3D`) support, restore it.
- Never merge in `console.log` statements or debug artifacts.
- Both branches must still pass the brand filter after merge:
  > "Does this feel like a memory — or just a product?"

## Escalate to user when

- A `Manual-inspect` file has business logic that cannot be safely merged automatically.
- Deleting a feature from either branch is the only resolution path.
- A secondary branch API contract (server route shape, Zod schema) conflicts with priority branch — this is a data model decision, not a code decision.
- Any file in `server/` has conflicting route handlers — server behaviour must be confirmed by the user.
