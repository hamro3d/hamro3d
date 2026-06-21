<template>
  <div>
    <!-- Header -->
    <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
    <div class="mx-auto flex max-w-h3d-max flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent">Admin</p>
        <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">Products</h1>
      </div>
      <button
        type="button"
        class="inline-flex w-fit border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
        @click="openCreate"
      >
        Add Product
      </button>
    </div>
  </div>

  <!-- Table -->
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
    <div v-if="pending" class="space-y-px border border-h3d-border bg-h3d-surface">
      <div v-for="i in 6" :key="i" class="h-16 animate-pulse bg-h3d-border/25" />
    </div>

    <div v-else class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Name</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Category</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Price</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Stock</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Status</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
          >
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">{{ product.title }}</td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">{{ product.category_name ?? '—' }}</td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text tabular-nums">NPR {{ fmt(product.price) }}</td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">{{ product.stock }}</td>
            <td class="px-5 py-4">
              <span
                class="inline-block border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest"
                :class="product.status === 'Active' ? 'border-h3d-accent text-h3d-accent' : 'border-h3d-border text-h3d-muted'"
              >
                {{ product.status }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <button
                type="button"
                class="mr-3 border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline"
                @click="openEdit(product)"
              >Edit</button>
              <button
                type="button"
                class="border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-red-400 transition-colors"
                @click="confirmDelete(product)"
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
      <div class="w-full max-w-3xl border border-h3d-border bg-h3d-surface shadow-xl">
        <!-- Modal header -->
        <div class="flex items-center justify-between border-b border-h3d-border px-6 py-5">
          <h2 class="font-h3d-display text-xl font-light text-h3d-text">
            {{ editingProduct ? 'Edit Product' : 'Add Product' }}
          </h2>
          <button type="button" class="text-h3d-muted hover:text-h3d-text transition-colors" @click="closeModal">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <form class="divide-y divide-h3d-border" @submit.prevent="saveProduct">
          <div class="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
            <!-- Title -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Title *</span>
              <input v-model="form.title" type="text" required
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Head / tagline -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Head tagline *</span>
              <input v-model="form.head" type="text" required placeholder="e.g. FOR YOUR LOVE · PERSONALIZED PIECE"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Subtitle -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Subtitle</span>
              <input v-model="form.subtitle" type="text"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Category Selection -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Category</span>
              <select v-model="form.category_id"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent">
                <option :value="null">None / Unassigned</option>
                <option v-for="c in categoriesList" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </label>
            <!-- Price -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Price (NPR) *</span>
              <input v-model.number="form.price" type="number" min="0" required
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Stock -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Stock</span>
              <input v-model.number="form.stock" type="number" min="0"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Status -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Status</span>
              <select v-model="form.status"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </label>
            <!-- Rank -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Rank (1 = top)</span>
              <input v-model.number="form.rank" type="number" min="1"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Price note -->
            <label class="block sm:col-span-2">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Price note</span>
              <input v-model="form.price_note" type="text" placeholder="e.g. 25% prepayment required · Free delivery within Kathmandu"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Image URL -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Featured Image</span>
              <input type="file" accept="image/*" @change="onFileSelected" class="w-full border border-h3d-border bg-h3d-base px-3 py-2" />
              <img v-if="form.imageUrl" :src="form.imageUrl" class="mt-2 max-h-32 object-cover" />
            </label>
            <!-- Materials -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Materials (Comma-separated)</span>
              <input v-model="form.materialsText" type="text" placeholder="PLA, Tough Resin, Wood Composite"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Dimensions (Width, Height, Depth) -->
            <fieldset class="block sm:col-span-2 border border-h3d-border bg-h3d-base px-4 py-3">
              <legend class="px-2 font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent">Dimensions (cm)</legend>
              <div class="grid grid-cols-3 gap-3">
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Width</span>
                  <input v-model.number="form.sizeW" type="number" min="0" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1 text-sm text-h3d-text focus:outline-none" />
                </label>
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Height</span>
                  <input v-model.number="form.sizeH" type="number" min="0" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1 text-sm text-h3d-text focus:outline-none" />
                </label>
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Depth</span>
                  <input v-model.number="form.sizeD" type="number" min="0" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1 text-sm text-h3d-text focus:outline-none" />
                </label>
              </div>
            </fieldset>
            <!-- Description text -->
            <label class="block sm:col-span-2">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Descriptions (One paragraph per line)</span>
              <textarea v-model="form.descriptionsText" rows="3" class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:outline-none" />
            </label>
            <!-- Care Instruction text -->
            <label class="block sm:col-span-2">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Care instructions (One tip per line)</span>
              <textarea v-model="form.careText" rows="2" class="w-full border border-h3d-border bg-h3d-base px-3 py-2 font-h3d-body text-sm text-h3d-text focus:outline-none" />
            </label>
            <!-- Processes Descriptions -->
            <fieldset class="block sm:col-span-2 border border-h3d-border bg-h3d-base px-4 py-3">
              <legend class="px-2 font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent">Workflow processes descriptions</legend>
              <div class="space-y-3">
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Step 1: Commission</span>
                  <input v-model="form.process1" type="text" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1.5 text-sm text-h3d-text focus:outline-none" />
                </label>
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Step 2: Craft</span>
                  <input v-model="form.process2" type="text" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1.5 text-sm text-h3d-text focus:outline-none" />
                </label>
                <label class="block">
                  <span class="mb-1 block font-h3d-body text-3xs uppercase tracking-widest text-h3d-muted">Step 3: Deliver</span>
                  <input v-model="form.process3" type="text" class="w-full border border-h3d-border bg-h3d-surface px-2 py-1.5 text-sm text-h3d-text focus:outline-none" />
                </label>
              </div>
            </fieldset>
          </div>

          <!-- Error -->
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
              {{ editingProduct ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Dialog -->
    <div
      v-if="deletingProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div class="w-full max-w-sm border border-h3d-border bg-h3d-surface p-8 text-center shadow-xl">
        <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3">Confirm deletion</p>
        <p class="font-h3d-display text-lg font-light text-h3d-text mb-2">Delete "{{ deletingProduct.title }}"?</p>
        <p class="font-h3d-body text-sm text-h3d-muted mb-8">This action cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button type="button" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors px-4 py-2" @click="deletingProduct = null">Cancel</button>
          <button
            type="button"
            :disabled="deleting"
            class="inline-flex items-center gap-2 border border-red-500/70 bg-red-500/10 px-6 py-2 font-h3d-body text-2xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            @click="deleteProduct"
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
  title: 'Admin — Products — Hamro3D',
  description: 'Manage Hamro3D products.',
})

// Fetch products & collections
const { data, pending, refresh } = await useFetch('/api/products?status=Active,Draft,Archived')
const products = computed(() => (data.value as any[]) ?? [])

const { data: categoriesData } = await useFetch('/api/categories')
const categoriesList = computed(() => (categoriesData.value as any[]) ?? [])

function fmt(n: number) { return Number(n).toLocaleString('en-IN') }

// Helper to safely parse database JSON representations
function parseDbJson(val: any) {
  if (!val) return []
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return val
}
function parseDbJsonObj(val: any) {
  if (!val) return {}
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return {} }
  }
  return val
}

// ── Modal state ───────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingProduct = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const emptyForm = () => ({
  title: '',
  head: '',
  subtitle: '',
  price: 0,
  stock: 0,
  status: 'Active',
  rank: 10,
  price_note: '',
  category_id: null as number | null,
  imageUrl: '/images/products/custom-human-figurine/1.png',
  descriptionsText: 'A figurine is not a product. It is a moment made permanent.\nSend us one clear photograph.\nEvery figurine is hand-finished and painted.',
  materialsText: 'PLA',
  careText: 'Keep away from direct sunlight.\nTreat it as a precious object.',
  sizeW: 10,
  sizeH: 15,
  sizeD: 17,
  process1: 'Place your order and share your reference photograph.',
  process2: 'Our team prints, refines, and hand-finishes your figurine.',
  process3: 'Your piece arrives gift-ready, wrapped with care.',
})

const form = reactive(emptyForm())

function openCreate() {
  Object.assign(form, emptyForm())
  editingProduct.value = null
  saveError.value = ''
  showModal.value = true
}

function openEdit(product: any) {
  const desc = parseDbJson(product.descriptions)
  const mat = parseDbJson(product.material)
  const care = parseDbJson(product.care)
  const size = parseDbJsonObj(product.size)
  const proc = parseDbJson(product.processes)
  const imgs = parseDbJson(product.images)

  Object.assign(form, {
    title: product.title,
    head: product.head,
    subtitle: product.subtitle ?? '',
    price: product.price,
    stock: product.stock,
    status: product.status,
    rank: product.rank,
    price_note: product.price_note ?? '',
    category_id: product.category_id ?? null,
    imageUrl: imgs[0] ?? '/images/products/custom-human-figurine/1.png',
    descriptionsText: desc.join('\n'),
    materialsText: mat.join(', '),
    careText: care.join('\n'),
    sizeW: size.value?.[0] ?? 10,
    sizeH: size.value?.[1] ?? 15,
    sizeD: size.value?.[2] ?? 17,
    process1: proc[0]?.description ?? '',
    process2: proc[1]?.description ?? '',
    process3: proc[2]?.description ?? '',
  })
  editingProduct.value = product
  saveError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('image', file);
  // Upload to server
  $fetch('/api/upload/image', { method: 'POST', body: formData })
    .then((res: any) => {
      if (res?.url) {
        form.imageUrl = res.url;
      }
    })
    .catch((e) => {
      console.error('Image upload failed', e);
    });
}

async function saveProduct() {
  saving.value = true
  saveError.value = ''
  try {
    const payload = {
      title: form.title,
      head: form.head,
      subtitle: form.subtitle,
      price: form.price,
      stock: form.stock,
      status: form.status,
      rank: form.rank,
      price_note: form.price_note,
      category_id: form.category_id ? Number(form.category_id) : null,
      images: [form.imageUrl].filter(Boolean),
      descriptions: form.descriptionsText.split('\n').map((s: string) => s.trim()).filter(Boolean),
      material: form.materialsText.split(',').map((s: string) => s.trim()).filter(Boolean),
      care: form.careText.split('\n').map((s: string) => s.trim()).filter(Boolean),
      size: {
        unit: 'cm',
        value: [Number(form.sizeW), Number(form.sizeH), Number(form.sizeD)]
      },
      processes: [
        { title: 'Commission:', description: form.process1 },
        { title: 'Craft:', description: form.process2 },
        { title: 'Deliver:', description: form.process3 }
      ]
    }

    if (editingProduct.value) {
      await $fetch(`/api/products/${editingProduct.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/products', { method: 'POST', body: payload })
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
const deletingProduct = ref<any>(null)
const deleting = ref(false)

function confirmDelete(product: any) { deletingProduct.value = product }

async function deleteProduct() {
  if (!deletingProduct.value) return
  deleting.value = true
  try {
    await $fetch(`/api/products/${deletingProduct.value.id}`, { method: 'DELETE' })
    deletingProduct.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}
</script>
