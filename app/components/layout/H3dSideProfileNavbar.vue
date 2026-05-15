<template>
  <aside
    class="border-r border-h3d-border bg-h3d-surface p-10 flex flex-col h-screen sticky top-0 w-full md:w-64 overflow-y-auto"
    role="navigation"
    aria-label="Profile and account navigation"
  >
    <!-- User Info -->
    <div class="pb-8 border-b border-h3d-border mb-2">
      <div
        class="w-14 h-14 rounded-full border border-h3d-accent bg-h3d-base flex items-center justify-center font-h3d-serif text-lg text-h3d-accent mb-3.5"
      >
        {{ userInitials }}
      </div>
      <div class="font-h3d-serif text-lg text-h3d-text font-light mb-1">
        {{ userName }}
      </div>
      <div class="font-h3d-body text-2xs text-h3d-muted tracking-widest mb-2.5">
        {{ userEmail }}
      </div>
      <div
        class="font-h3d-body text-2xs text-h3d-accent border border-h3d-border px-2 py-0.75 inline-block tracking-widest"
      >
        MEMBER SINCE 2025
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto">
      <div class="flex flex-col">
        <div
          class="font-h3d-body text-2xs text-h3d-muted px-7 py-4 tracking-widest"
        >
          ACCOUNT
        </div>
        <NuxtLink
          v-for="item in userNavItems"
          :key="item.href"
          :to="item.href"
          :class="[
            'flex items-center gap-3 px-7 py-3 border-l-2 transition-colors cursor-pointer text-decoration-none',
            navActive(item.href)
              ? 'border-h3d-accent bg-h3d-base bg-opacity-10'
              : 'border-transparent hover:bg-h3d-base hover:bg-opacity-5',
          ]"
        >
          <svg
            :class="[
              'w-h3d-icon h-h3d-icon stroke-1.5 fill-none stroke-linecap-round stroke-linejoin-round',
              navActive(item.href)
                ? 'stroke-h3d-accent'
                : 'stroke-h3d-muted',
            ]"
            viewBox="0 0 24 24"
            v-html="item.icon"
          ></svg>
          <span
            :class="[
              'font-h3d-body text-sm font-medium tracking-widest',
              navActive(item.href) ? 'text-h3d-text' : 'text-h3d-muted',
            ]"
            >{{ item.label }}</span
          >
        </NuxtLink>
      </div>

      <div class="flex flex-col">
        <div
          class="font-h3d-body text-2xs text-h3d-muted px-7 py-4 tracking-widest"
        >
          ADMIN
        </div>
        <NuxtLink
          v-for="item in adminNavItems"
          :key="item.href"
          :to="item.href"
          :class="[
            'flex items-center gap-3 px-7 py-3 border-l-2 transition-colors cursor-pointer text-decoration-none',
            navActive(item.href)
              ? 'border-h3d-accent bg-h3d-base bg-opacity-10'
              : 'border-transparent hover:bg-h3d-base hover:bg-opacity-5',
          ]"
        >
          <svg
            :class="[
              'w-h3d-icon h-h3d-icon stroke-1.5 fill-none stroke-linecap-round stroke-linejoin-round',
              navActive(item.href)
                ? 'stroke-h3d-accent'
                : 'stroke-h3d-muted',
            ]"
            viewBox="0 0 24 24"
            v-html="item.icon"
          ></svg>
          <span
            :class="[
              'font-h3d-body text-sm font-medium tracking-widest',
              navActive(item.href) ? 'text-h3d-text' : 'text-h3d-muted',
            ]"
            >{{ item.label }}</span
          >
        </NuxtLink>
      </div>
    </nav>

    <!-- Logout -->
    <div class="pt-5 border-t border-h3d-border">
      <button
        class="flex items-center gap-2.5 bg-transparent border-none cursor-pointer text-h3d-muted transition-colors hover:text-h3d-error font-h3d-body text-sm"
        @click="logout"
      >
        <svg
          class="w-3.5 h-3.5 stroke-current stroke-1.5 fill-none"
          viewBox="0 0 24 24"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Sign out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const auth = useAuthStore();

/** Match Nuxt file-based routes; avoid /profile matching /profile/orders, /admin matching /admin/products */
function navActive(href: string) {
  const p = route.path;
  if (href === "/profile") return p === "/profile";
  if (href === "/admin") return p === "/admin";
  return p === href || p.startsWith(`${href}/`);
}
const userName = computed(() => auth.userName);
const userEmail = computed(() => auth.userEmail);
const userInitials = computed(() => auth.userInitials);

const userNavItems = [
  {
    href: "/profile",
    label: "My Profile",
    icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  {
    href: "/profile/orders",
    label: "My Orders",
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
  },
  {
    href: "/cart",
    label: "Cart",
    icon: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  },
];

const adminNavItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  },
];

const logout = () => {
  auth.logout();
  navigateTo("/");
};
</script>
