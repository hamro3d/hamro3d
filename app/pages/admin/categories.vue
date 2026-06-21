<template>
  <div>
    <!-- Header -->
    <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
      <div class="mx-auto flex max-w-h3d-max flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent">Admin</p>
          <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">Categories</h1>
        </div>
        <button
          type="button"
          class="inline-flex w-fit border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
          @click="openCreate"
        >
          Add Category
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
      <div v-if="pending" class="space-y-px border border-h3d-border bg-h3d-surface">
        <div v-for="i in 5" :key="i" class="h-16 animate-pulse bg-h3d-border/25" />
      </div>

      <div v-else class="overflow-x-auto border border-h3d-border bg-h3d-surface">
        <table class="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr class="border-b border-h3d-border bg-h3d-base">
              <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Name</th>
              <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Slug</th>
              <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Description</th>
              <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cat in categories"
              :key="cat.id"
              class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
            >
              <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text font-medium">{{ cat.name }}</td>
              <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted font-mono">{{ cat.slug }}</td>
              <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted max-w-xs truncate">{{ cat.description || '—' }}</td>
              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="mr-3 border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline"
                  @click="openEdit(cat)"
                >Edit</button>
                <button
                  type="button"
                  class="border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-red-400 transition-colors"
                  @click="confirmDelete(cat)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-12"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md border border-h3d-border bg-h3d-surface shadow-xl">
          <!-- Modal header -->
          <div class="flex items-center justify-between border-b border-h3d-border px-6 py-5">
            <h2 class="font-h3d-display text-xl font-light text-h3d-text">
              {{ editingCategory ? 'Edit Category' : 'Add Category' }}
            </h2>
            <button type="button" class="text-h3d-muted hover:text-h3d-text transition-colors" @click="closeModal">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <form class="divide-y divide-h3d-border" @submit.prevent="saveCategory">
            <div class="grid grid-cols-1 gap-4 px-6 py-6">
              <!-- Name -->
              <label class="block">
                <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Category Name *</span>
                <input v-model="form.name" type="text" required placeholder="e.g. Personalized Pieces"
                  class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
              </label>
              <!-- Slug -->
              <label class="block">
                <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Slug *</span>
                <input v-model="form.slug" type="text" required placeholder="e.g. personalized-pieces"
                  class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
              </label>
              <!-- Description -->
              <label class="block">
                <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Description</span>
                <textarea v-model="form.description" rows="3" placeholder="Describe this category..."
                  class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none" />
              </label>
            </div>

            <!-- Error message -->
            <p v-if="saveError" class="px-6 py-3 font-h3d-body text-xs text-red-400">{{ saveError }}</p>

            <!-- Modal footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-5">
              <button type="button" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors" @click="closeModal">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center gap-2 border border-h3d-accent bg-h3d-accent px-6 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <span v-if="saving" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-h3d-base border-t-transparent" />
                {{ editingCategory ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirm Dialog -->
      <div
        v-if="deletingCategory"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      >
        <div class="w-full max-w-sm border border-h3d-border bg-h3d-surface p-8 text-center shadow-xl">
          <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3">Confirm deletion</p>
          <p class="font-h3d-display text-lg font-light text-h3d-text mb-2">Delete "{{ deletingCategory.name }}"?</p>
          <p class="font-h3d-body text-sm text-h3d-muted mb-8">This action cannot be undone and will detach products from this category.</p>
          <div class="flex gap-3 justify-center">
            <button type="button" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors px-4 py-2" @click="deletingCategory = null">Cancel</button>
            <button
              type="button"
              :disabled="deleting"
              class="inline-flex items-center gap-2 border border-red-500/70 bg-red-500/10 px-6 py-2 font-h3d-body text-2xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              @click="deleteCategory"
            >
              <span v-if="deleting" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({
  title: 'Admin — Categories — Hamro3D',
  description: 'Manage product categories for Hamro3D.',
})

const { data, pending, refresh } = await useFetch('/api/categories')
const categories = computed(() => (data.value as any[]) ?? [])

// ── Modal state ───────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingCategory = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const emptyForm = () => ({
  name: '',
  slug: '',
  description: '',
})

const form = reactive(emptyForm())

// Auto-generate slug from name
watch(() => form.name, (val) => {
  if (!editingCategory.value) {
    form.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
})

function openCreate() {
  Object.assign(form, emptyForm())
  editingCategory.value = null
  saveError.value = ''
  showModal.value = true
}

function openEdit(cat: any) {
  Object.assign(form, {
    name: cat.name,
    slug: cat.slug,
    description: cat.description ?? '',
  })
  editingCategory.value = cat
  saveError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCategory.value = null
}

async function saveCategory() {
  saving.value = true
  saveError.value = ''
  try {
    if (editingCategory.value) {
      await $fetch(`/api/categories/${editingCategory.value.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/categories', { method: 'POST', body: form })
    }
    closeModal()
    await refresh()
  } catch (e: any) {
    saveError.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
const deletingCategory = ref<any>(null)
const deleting = ref(false)

function confirmDelete(cat: any) { deletingCategory.value = cat }

async function deleteCategory() {
  if (!deletingCategory.value) return
  deleting.value = true
  try {
    await $fetch(`/api/categories/${deletingCategory.value.id}`, { method: 'DELETE' })
    deletingCategory.value = null
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}
</script>
