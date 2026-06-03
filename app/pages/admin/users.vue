<template>
  <div>
    <!-- Header -->
    <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
    <div class="mx-auto max-w-h3d-max flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent">Admin</p>
        <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">Users</h1>
        <p v-if="!pending" class="mt-2 font-h3d-body text-xs text-h3d-muted">{{ users.length }} users registered</p>
      </div>
      <button
        type="button"
        class="inline-flex w-fit border border-h3d-accent bg-h3d-accent px-5 py-2.5 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-base transition-opacity hover:opacity-90"
        @click="openCreate"
      >
        Add User
      </button>
    </div>
  </div>

  <!-- Table -->
  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
    <div v-if="pending" class="space-y-px border border-h3d-border bg-h3d-surface">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse bg-h3d-border/25" />
    </div>

    <div v-else class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[840px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted w-16" />
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Name</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Email</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Role</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Orders</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Member since</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted">Status</th>
            <th class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-h3d-border transition-colors last:border-0 hover:bg-h3d-accent/[0.03]"
          >
            <td class="px-5 py-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-full border border-h3d-accent bg-h3d-base font-h3d-display text-xs text-h3d-accent">
                {{ initials(user.name) }}
              </div>
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">{{ user.name }}</td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">{{ user.email }}</td>
            <td class="px-5 py-4">
              <span class="inline-block px-2 py-0.5 font-h3d-body text-3xs uppercase tracking-widest border"
                :class="user.role === 'admin' ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-h3d-border text-h3d-muted'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text tabular-nums">{{ user.order_count || 0 }}</td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">{{ memberSince(user.created_at) }}</td>
            <td class="px-5 py-4">
              <span
                class="inline-block border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest"
                :class="user.status === 'Active' ? 'border-h3d-accent text-h3d-accent' : 'border-h3d-border text-h3d-muted'"
              >{{ user.status }}</span>
            </td>
            <td class="px-5 py-4 text-right">
              <button
                type="button"
                class="mr-3 border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline"
                @click="openEdit(user)"
              >Edit</button>
              <button
                type="button"
                :disabled="user.email === currentUserEmail"
                class="border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                @click="confirmDelete(user)"
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
      <div class="w-full max-w-lg border border-h3d-border bg-h3d-surface shadow-xl">
        <!-- Modal header -->
        <div class="flex items-center justify-between border-b border-h3d-border px-6 py-5">
          <h2 class="font-h3d-display text-xl font-light text-h3d-text">
            {{ editingUser ? 'Edit User' : 'Add User' }}
          </h2>
          <button type="button" class="text-h3d-muted hover:text-h3d-text transition-colors" @click="closeModal">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <form class="divide-y divide-h3d-border" @submit.prevent="saveUser">
          <div class="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
            <!-- Name -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Full Name *</span>
              <input v-model="form.name" type="text" required
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Email -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Email Address *</span>
              <input v-model="form.email" type="email" required
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Password -->
            <label class="block sm:col-span-2">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">
                Password {{ editingUser ? '(Leave blank to keep current)' : '*' }}
              </span>
              <input v-model="form.password" type="password" :required="!editingUser"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Phone -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Phone</span>
              <input v-model="form.phone" type="text" placeholder="98XXXXXXXX"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent" />
            </label>
            <!-- Role -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Role</span>
              <select v-model="form.role"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent">
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <!-- Status -->
            <label class="block">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Status</span>
              <select v-model="form.status"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none focus:ring-1 focus:ring-h3d-accent">
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Invited">Invited</option>
              </select>
            </label>
            <!-- Address -->
            <label class="block sm:col-span-2">
              <span class="mb-1.5 block font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted">Address</span>
              <textarea v-model="form.address" rows="2" placeholder="Kathmandu, Nepal"
                class="w-full border border-h3d-border bg-h3d-base px-3 py-2.5 font-h3d-body text-sm text-h3d-text focus:border-h3d-accent focus:outline-none" />
            </label>
          </div>

          <!-- Error Message -->
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
              {{ editingUser ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Dialog -->
    <div
      v-if="deletingUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div class="w-full max-w-sm border border-h3d-border bg-h3d-surface p-8 text-center shadow-xl">
        <p class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-3">Confirm deletion</p>
        <p class="font-h3d-display text-lg font-light text-h3d-text mb-2">Delete "{{ deletingUser.name }}"?</p>
        <p class="font-h3d-body text-sm text-h3d-muted mb-8">This action cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button type="button" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors px-4 py-2" @click="deletingUser = null">Cancel</button>
          <button
            type="button"
            :disabled="deleting"
            class="inline-flex items-center gap-2 border border-red-500/70 bg-red-500/10 px-6 py-2 font-h3d-body text-2xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            @click="deleteUser"
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
  title: 'Admin — Users — Hamro3D',
  description: 'Manage users, customer accounts, and administrative staff for Hamro3D.',
})

const authStore = useAuthStore()
const currentUserEmail = computed(() => authStore.userEmail)

const { data, pending, refresh } = await useFetch('/api/users')
const users = computed(() => (data.value as any[]) ?? [])

function initials(name: string) {
  if (!name) return ''
  return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
}
function memberSince(ts: string) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// ── Modal state ───────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingUser = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const emptyForm = () => ({
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  role: 'customer',
  status: 'Active',
})

const form = reactive(emptyForm())

function openCreate() {
  Object.assign(form, emptyForm())
  editingUser.value = null
  saveError.value = ''
  showModal.value = true
}

function openEdit(u: any) {
  Object.assign(form, {
    name: u.name,
    email: u.email,
    password: '',
    phone: u.phone ?? '',
    address: u.address ?? '',
    role: u.role,
    status: u.status,
  })
  editingUser.value = u
  saveError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
}

async function saveUser() {
  saving.value = true
  saveError.value = ''
  try {
    const payload = { ...form }
    if (editingUser.value && !payload.password) {
      delete (payload as any).password
    }
    if (editingUser.value) {
      await $fetch(`/api/users/${editingUser.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/users', { method: 'POST', body: payload })
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
const deletingUser = ref<any>(null)
const deleting = ref(false)

function confirmDelete(u: any) { deletingUser.value = u }

async function deleteUser() {
  if (!deletingUser.value) return
  deleting.value = true
  try {
    await $fetch(`/api/users/${deletingUser.value.id}`, { method: 'DELETE' })
    deletingUser.value = null
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Failed to delete user')
  } finally {
    deleting.value = false
  }
}
</script>
