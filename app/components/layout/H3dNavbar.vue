<template>
  <nav
    class="sticky top-0 z-100 h-[68px] bg-h3d-base border-b border-h3d-border flex items-center justify-between px-6 sm:px-10"
    role="navigation"
    aria-label="Main navigation"
  >
    <!-- Logo & Brand -->
    <NuxtLink to="/" class="flex items-center gap-3 text-decoration-none shrink-0">
      <img src="/logo/C4907A-H3D-logo.png" alt="Hamro3D Logo" class="h-9 w-auto object-contain" width="36" height="36" />
      <div>
        <div class="font-h3d-display text-xs tracking-widest text-h3d-text leading-tight">
          HAMRO<span class="text-h3d-accent font-light">3D</span>
        </div>
        <div class="font-h3d-body text-2xs tracking-widest text-h3d-muted leading-none">हाम्रो 3D</div>
      </div>
    </NuxtLink>

    <!-- Desktop Links -->
    <ul class="hidden md:flex gap-8 list-none m-0 p-0" role="list">
      <li><NuxtLink to="/" :class="navClass('/', true)">Home</NuxtLink></li>
      <li><NuxtLink to="/products" :class="navClass('/products')">Products</NuxtLink></li>
      <li><NuxtLink to="/our-story" :class="navClass('/our-story')">Our Story</NuxtLink></li>
      <li><NuxtLink to="/contact" :class="navClass('/contact')">Connect</NuxtLink></li>
    </ul>

    <!-- Actions -->
    <div class="flex items-center gap-3 shrink-0">
      <!-- Wishlist link -->
      <NuxtLink to="/wishlist" class="relative text-h3d-muted hover:text-h3d-text transition-colors p-2" aria-label="Wishlist">
        <svg class="w-5 h-5 stroke-current stroke-1.5 fill-none" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        <span v-if="wishlistCount > 0" class="absolute -top-0.5 -right-0.5 bg-h3d-accent text-h3d-base text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
          {{ wishlistCount }}
        </span>
      </NuxtLink>

      <!-- Cart link -->
      <NuxtLink to="/cart" class="relative text-h3d-muted hover:text-h3d-text transition-colors p-2 mr-1" aria-label="Cart">
        <svg class="w-5 h-5 stroke-current stroke-1.5 fill-none" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 bg-h3d-accent text-h3d-base text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
          {{ cartCount }}
        </span>
      </NuxtLink>

      <!-- Auth Action -->
      <template v-if="auth.isLoggedIn">
        <NuxtLink v-if="auth.isAdmin" to="/admin" class="border border-purple-500/50 bg-purple-500/10 px-3 py-1.5 font-h3d-body text-2xs uppercase tracking-widest text-purple-400 hover:bg-purple-500/20 transition-colors no-underline">
          Admin Panel
        </NuxtLink>
        <NuxtLink v-else to="/profile" class="flex h-8 w-8 items-center justify-center rounded-full border border-h3d-accent bg-h3d-base font-h3d-display text-xs text-h3d-accent no-underline hover:bg-h3d-accent hover:text-h3d-base transition-colors">
          {{ userInitials.join('') }}
        </NuxtLink>
      </template>
      <NuxtLink v-else to="/auth" class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-muted hover:text-h3d-text transition-colors no-underline p-2">
        Sign In
      </NuxtLink>

      <!-- Commission CTA — filled when on /contact, outlined otherwise -->
      <NuxtLink
        to="/contact#commission-form"
        :class="[
          'hidden md:inline-flex items-center justify-center border border-h3d-accent px-4 py-2 font-h3d-body text-2xs font-medium tracking-widest uppercase transition-all no-underline ml-1',
          isContactActive
            ? 'bg-h3d-accent text-h3d-base'
            : 'text-h3d-accent hover:bg-h3d-accent hover:text-h3d-base',
        ]"
      >
        Commission
      </NuxtLink>

      <!-- Hamburger (Mobile) -->
      <button
        class="md:hidden flex flex-col gap-1.5 bg-transparent border-none p-2 cursor-pointer"
        :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span
          class="block w-5 h-px transition-all duration-300 origin-center"
          :class="mobileMenuOpen ? 'bg-h3d-accent rotate-45 translate-y-[5px]' : 'bg-h3d-muted'"
        />
        <span
          class="block w-5 h-px transition-all duration-300"
          :class="mobileMenuOpen ? 'bg-h3d-accent opacity-0 scale-x-0' : 'bg-h3d-muted'"
        />
        <span
          class="block w-5 h-px transition-all duration-300 origin-center"
          :class="mobileMenuOpen ? 'bg-h3d-accent -rotate-45 -translate-y-[9px]' : 'bg-h3d-muted'"
        />
      </button>
    </div>

    <!-- Mobile Menu Overlay (animated) -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-200 bg-h3d-base flex flex-col px-7 py-6 md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <!-- Close row -->
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-3">
            <img src="/logo/C4907A-H3D-logo.png" alt="Hamro3D" class="h-8 w-auto object-contain" width="32" height="32" />
            <span class="font-h3d-display text-xs tracking-widest text-h3d-text">HAMRO<span class="text-h3d-accent font-light">3D</span></span>
          </div>
          <button
            class="text-h3d-muted font-h3d-body text-2xs tracking-widest uppercase hover:text-h3d-text transition-colors bg-transparent border-none cursor-pointer p-1"
            @click="mobileMenuOpen = false"
          >
            Close ✕
          </button>
        </div>

        <!-- Nav links -->
        <ul class="flex flex-col gap-0 list-none m-0 p-0 flex-1">
          <li>
            <NuxtLink to="/" :class="mobileNavClass('/', true)" @click="mobileMenuOpen = false">
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/products" :class="mobileNavClass('/products')" @click="mobileMenuOpen = false">
              Products
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/our-story" :class="mobileNavClass('/our-story')" @click="mobileMenuOpen = false">
              Our Story
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" :class="mobileNavClass('/contact')" @click="mobileMenuOpen = false">
              Connect
            </NuxtLink>
          </li>
          <li v-if="auth.isAdmin">
            <NuxtLink to="/admin" :class="mobileNavClass('/admin')" @click="mobileMenuOpen = false">
              Admin Panel
            </NuxtLink>
          </li>
          <li v-else-if="auth.isLoggedIn">
            <NuxtLink to="/profile" :class="mobileNavClass('/profile')" @click="mobileMenuOpen = false">
              My Profile
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/wishlist" :class="mobileNavClass('/wishlist')" @click="mobileMenuOpen = false" class="flex justify-between items-center">
              <span>Wishlist</span>
              <span v-if="wishlistCount > 0" class="bg-h3d-accent text-h3d-base text-2xs px-2.5 py-0.5 rounded-full font-bold tabular-nums">
                {{ wishlistCount }}
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/cart" :class="mobileNavClass('/cart')" @click="mobileMenuOpen = false" class="flex justify-between items-center">
              <span>Cart</span>
              <span v-if="cartCount > 0" class="bg-h3d-accent text-h3d-base text-2xs px-2.5 py-0.5 rounded-full font-bold tabular-nums">
                {{ cartCount }}
              </span>
            </NuxtLink>
          </li>
          <li v-if="!auth.isLoggedIn">
            <NuxtLink to="/auth" :class="mobileNavClass('/auth')" @click="mobileMenuOpen = false">
              Sign In
            </NuxtLink>
          </li>
        </ul>

        <!-- Mobile Commission CTA -->
        <NuxtLink
          to="/contact#commission-form"
          class="mt-8 flex items-center justify-center bg-h3d-accent text-h3d-base py-4 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover no-underline"
          @click="mobileMenuOpen = false"
        >
          Commission a Piece
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useAuthStore } from '~/stores/auth'

const cart = useCartStore()
const wishlist = useWishlistStore()
const auth = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

const wishlistCount = computed(() => wishlist.count)
const cartCount = computed(() => cart.itemCount)
const isContactActive = computed(() => route.path.startsWith('/contact'))
const userInitials = computed(() => auth.userInitials)

// Close mobile menu on route change
watch(() => route.path, () => { mobileMenuOpen.value = false })

onMounted(async () => {
  if (!auth.sessionLoaded) {
    await fetchAuthSession()
  }
})

function navClass(path: string, exact = false) {
  const active = exact ? route.path === path : route.path.startsWith(path)
  return [
    'font-h3d-body text-xs font-medium tracking-widest transition-colors border-b pb-0.5 no-underline',
    active
      ? 'text-h3d-text border-h3d-accent'
      : 'text-h3d-muted border-transparent hover:text-h3d-text hover:border-h3d-muted',
  ]
}

function mobileNavClass(path: string, exact = false) {
  const active = exact ? route.path === path : route.path.startsWith(path)
  return [
    'block py-4 border-b border-h3d-border font-h3d-body text-sm tracking-widest transition-colors no-underline',
    active ? 'text-h3d-accent font-medium' : 'text-h3d-text hover:text-h3d-accent',
  ]
}
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
