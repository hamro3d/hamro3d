<template>
  <div class="border-b border-h3d-border bg-h3d-surface px-6 py-10 sm:px-10">
    <div class="mx-auto max-w-h3d-max">
      <p
        class="mb-2 font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent"
      >
        Admin
      </p>
      <h1 class="font-h3d-display text-3xl font-light text-h3d-text md:text-4xl">
        Users
      </h1>
      <p class="mt-3 font-h3d-body text-sm text-h3d-muted">
        {{ users.length }} users
      </p>
    </div>
  </div>

  <div class="mx-auto max-w-h3d-max px-6 py-10 sm:px-10">
    <div class="overflow-x-auto border border-h3d-border bg-h3d-surface">
      <table class="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr class="border-b border-h3d-border bg-h3d-base">
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            />
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Name
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Email
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Orders
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Member since
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted"
            >
              Status
            </th>
            <th
              class="px-5 py-3 font-h3d-body text-2xs font-medium uppercase tracking-widest text-h3d-muted text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.email"
            class="border-b border-h3d-border last:border-0"
          >
            <td class="px-5 py-4">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-h3d-accent bg-h3d-base font-h3d-display text-xs text-h3d-accent"
              >
                {{ user.initials }}
              </div>
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">
              {{ user.name }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ user.email }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-text">
              {{ user.orders }}
            </td>
            <td class="px-5 py-4 font-h3d-body text-sm text-h3d-muted">
              {{ user.memberSince }}
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-block border px-2 py-0.5 font-h3d-body text-2xs uppercase tracking-widest"
                :class="
                  user.status === 'Active'
                    ? 'border-h3d-accent text-h3d-accent'
                    : 'border-h3d-border text-h3d-muted'
                "
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <button
                type="button"
                class="border-none bg-transparent font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline-offset-2 hover:underline"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Admin — Users — Hamro3D',
  description:
    'People who have commissioned or follow Hamro3D from Kathmandu and beyond.',
})

const users = [
  {
    initials: 'PK',
    name: 'Priya Khadka',
    email: 'priya.k@example.com',
    orders: 4,
    memberSince: 'Jan 2025',
    status: 'Active',
  },
  {
    initials: 'ST',
    name: 'Sameer Thapa',
    email: 'sameer.t@example.com',
    orders: 2,
    memberSince: 'Mar 2025',
    status: 'Active',
  },
  {
    initials: 'AS',
    name: 'Anita Sharma',
    email: 'anita.s@example.com',
    orders: 7,
    memberSince: 'Nov 2024',
    status: 'Active',
  },
  {
    initials: 'RB',
    name: 'Rajan Basnet',
    email: 'rajan.b@example.com',
    orders: 1,
    memberSince: 'Apr 2026',
    status: 'Active',
  },
  {
    initials: 'ML',
    name: 'Mina Lama',
    email: 'mina.l@example.com',
    orders: 0,
    memberSince: 'May 2026',
    status: 'Invited',
  },
]
</script>
