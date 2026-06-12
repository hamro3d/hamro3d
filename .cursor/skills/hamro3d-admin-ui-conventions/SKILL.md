---
name: hamro3d-admin-ui-conventions
description: >-
  Defines UI/UX, copy, and component conventions for all Hamro3D admin pages
  under /admin/**. Covers CRUD modal pattern, status badges, loading skeletons,
  table layout, page header, brand vocabulary in admin context, and the rule
  that /pages/login.vue must not exist. Triggers on: admin page, admin ui,
  crud modal, admin table, admin form, admin copy, manage products, manage
  users, manage orders, manage categories, admin dashboard, admin layout.
---

# Hamro3D — Admin UI Conventions

Admin pages are internal tools — but they still live inside the Dusk Violet
Memory design system and must carry the brand's quiet confidence. Clarity
first; brand discipline always.

---

## 1. Brand vocabulary in admin context

Even in internal tools, prefer brand-aligned language where it does not
impede operator clarity:

| Generic ops term | Hamro3D admin term |
|------------------|--------------------|
| Product | Piece |
| Products | Pieces |
| Category | Collection |
| Categories | Collections |
| Order | Commission |
| Orders | Commissions |
| Delete | Archive (for soft delete) / Remove (for hard delete) |
| Customer | Customer (this one is fine — internal clarity) |
| User | User |
| Add Product | Add Piece |
| Manage Products | Manage Pieces |
| Edit | Edit (fine as-is) |

---

## 2. Page header pattern

Every admin list/section page uses this exact header block:

```vue
<div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
  <div class="mx-auto flex max-w-h3d-max flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent">
        Admin
      </p>
      <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">
        <!-- Page title here -->
      </h1>
      <!-- Optional subtitle: -->
      <p v-if="!pending" class="mt-2 font-h3d-body text-xs text-h3d-muted">
        {{ items.length }} pieces
      </p>
    </div>
    <!-- Primary action button top-right -->
    <button
      type="button"
      class="inline-flex w-fit border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
      @click="openCreate"
    >
      Add Piece
    </button>
  </div>
</div>
```

---

## 3. Table layout pattern

Wrap every data table in this structure:

```vue
<!-- Loading skeleton -->
<div v-if="pending" class="space-y-px border border-h3d-border bg-h3d-surface">
  <div v-for="i in 6" :key="i" class="h-16 animate-pulse bg-h3d-border/25" />
</div>

<!-- Data table -->
<div v-else class="overflow-x-auto border border-h3d-border bg-h3d-surface">
  <table class="w-full min-w-[720px] border-collapse text-left">
    <thead>
      <tr class="border-b border-h3d-border bg-h3d-base">
        <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">
          Column Name
        </th>
        <!-- more columns -->
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
        class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
      >
        <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">{{ item.name }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

`min-w-[Xpx]` values by table type: products `720px`, users `840px`, orders `760px`.

---

## 4. Status badge pattern (admin-extended)

Three-layer token system — border, background, text:

```typescript
type AdminStatus = 'Active' | 'Draft' | 'Archived' | 'Suspended' | 'Admin' | 'Customer'

function statusBadgeClass(status: AdminStatus): string {
  switch (status) {
    case 'Active':    return 'border-h3d-accent/50  bg-h3d-accent/10  text-h3d-accent'
    case 'Draft':     return 'border-h3d-border      bg-h3d-base       text-h3d-muted'
    case 'Archived':  return 'border-h3d-error/40   bg-h3d-error/10   text-h3d-error'
    case 'Suspended': return 'border-h3d-error/40   bg-h3d-error/10   text-h3d-error'
    case 'Admin':     return 'border-purple-500/50  bg-purple-500/10  text-purple-400'
    case 'Customer':  return 'border-h3d-border      bg-h3d-base       text-h3d-muted'
    default:          return 'border-h3d-border      bg-h3d-base       text-h3d-muted'
  }
}
```

```vue
<span
  class="inline-block border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest"
  :class="statusBadgeClass(item.status)"
>
  {{ item.status }}
</span>
```

---

## 5. CRUD modal pattern

Every admin list page uses a single `<Teleport to="body">` modal for both
Add and Edit. Never use two separate modals.

### State shape

```typescript
const showModal   = ref(false)
const editTarget  = ref<ItemType | null>(null)   // null = create mode
const form        = reactive({ name: '', slug: '', description: '' })

function openCreate() {
  editTarget.value = null
  Object.assign(form, { name: '', slug: '', description: '' })
  showModal.value = true
}

function openEdit(item: ItemType) {
  editTarget.value = item
  Object.assign(form, { name: item.name, slug: item.slug, description: item.description })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editTarget.value = null
}
```

### Modal shell

```vue
<Teleport to="body">
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-12"
    @click.self="closeModal"
  >
    <div class="w-full max-w-lg border border-h3d-border bg-h3d-surface p-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-h3d-display text-xl font-light text-h3d-text">
          {{ editTarget ? 'Edit Piece' : 'Add Piece' }}
        </h2>
        <button
          type="button"
          class="text-h3d-muted transition-colors hover:text-h3d-text"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- form fields -->
        <div class="flex justify-end gap-3">
          <button type="button" class="..." @click="closeModal">Cancel</button>
          <button type="submit" :disabled="saving" class="...">
            <span v-if="saving" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-h3d-base border-t-transparent" />
            {{ editTarget ? 'Save Changes' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</Teleport>
```

---

## 6. Confirm-before-delete pattern

Never use `window.confirm()`. Use an inline ref:

```typescript
const confirmTarget = ref<ItemType | null>(null)

function confirmDelete(item: ItemType) { confirmTarget.value = item }
function cancelDelete()                 { confirmTarget.value = null }

async function executeDelete() {
  if (!confirmTarget.value) return
  await apiFetch(`/api/pieces/${confirmTarget.value.id}`, { method: 'DELETE' })
  confirmTarget.value = null
  await refresh()
}
```

```vue
<!-- Inline confirmation row — renders inside the <tr> or below the item -->
<template v-if="confirmTarget?.id === item.id">
  <td colspan="99" class="bg-h3d-error/10 px-5 py-3 font-h3d-body text-sm text-h3d-error">
    Archive "{{ item.name }}"? This cannot be undone.
    <button @click="executeDelete" class="ml-4 underline">Confirm</button>
    <button @click="cancelDelete"  class="ml-2 text-h3d-muted underline">Cancel</button>
  </td>
</template>
```

---

## 7. Form field pattern

```vue
<div>
  <label class="mb-1 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">
    Title
  </label>
  <input
    v-model="form.title"
    type="text"
    required
    class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text placeholder-h3d-muted/50 focus:border-h3d-accent focus:outline-none"
  />
</div>
```

---

## 8. Page script order

```vue
<script setup lang="ts">
// 1. definePageMeta — must be first
definePageMeta({ layout: 'admin' })

// 2. SEO meta
useSeoMeta({ title: 'Pieces — Hamro3D Admin', description: '' })

// 3. API data
const { data, pending, refresh } = await useFetch('/api/pieces')

// 4. Computed / derived
const items = computed(() => data.value ?? [])

// 5. CRUD state
const showModal   = ref(false)
const editTarget  = ref(null)
const confirmTarget = ref(null)
const saving      = ref(false)
const form        = reactive({ ... })

// 6. CRUD functions
function openCreate() { ... }
function openEdit(item) { ... }
function closeModal() { ... }
async function handleSubmit() { ... }
function confirmDelete(item) { ... }
async function executeDelete() { ... }
</script>
```

---

## 9. Auth page rule

There must be exactly **one** auth entry point: `app/pages/auth.vue`.

`app/pages/login.vue` must be **deleted**. It is a broken duplicate that:
- Pre-fills `admin@gmail.com` / `admin` credentials in source
- Checks `res?.success` which does not exist on the login response
- Uses `$fetch` instead of the project-standard `apiFetch`

All admin login links redirect to `/auth`.

---

## 10. Action button styles

| Button type | Class string |
|-------------|-------------|
| Primary (accent fill) | `border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90` |
| Secondary (outline) | `border border-h3d-border px-5 py-2.5 font-h3d-body text-2xs uppercase tracking-widest text-h3d-text transition-colors hover:border-h3d-accent hover:text-h3d-accent` |
| Ghost link (table actions) | `border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline` |
| Destructive ghost | `border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted transition-colors hover:text-h3d-error` |
