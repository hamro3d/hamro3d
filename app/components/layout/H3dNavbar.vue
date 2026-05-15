<template>
  <nav class="sticky top-0 z-100 h-[68px] bg-h3d-base border-b border-h3d-border flex items-center justify-between px-6 sm:px-10" role="navigation" aria-label="Main navigation">
    <!-- Logo & Brand -->
    <NuxtLink to="/" class="flex items-center gap-3 text-decoration-none">
      <NuxtImg src="/logo/C4907A-H3D-logo.png" alt="Hamro3D Logo" class="h-9 w-auto object-contain" width="36" height="36" preload />
      <div>
        <div class="font-h3d-display text-xs tracking-widest text-h3d-text leading-tight">
          HAMRO<span class="text-h3d-accent font-light">3D</span>
        </div>
        <div class="font-h3d-body text-2xs tracking-widest text-h3d-muted leading-none">हाम्रो 3D</div>
      </div>
    </NuxtLink>

    <!-- Desktop Links -->
    <ul class="hidden md:flex gap-8 list-none" role="list">
      <li><NuxtLink to="/" :class="navClass('/', true)">Home</NuxtLink></li>
      <li><NuxtLink to="/products" :class="navClass('/products')">Products</NuxtLink></li>
      <li><NuxtLink to="/our-story" :class="navClass('/our-story')">Our Story</NuxtLink></li>
      <li><NuxtLink to="/contact" :class="navClass('/contact')">Connect</NuxtLink></li>
    </ul>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <!--
        TEMP: Wishlist, cart, auth hidden until backend is ready.

        <NuxtLink to="/wishlist" ...>wishlist</NuxtLink>
        <NuxtLink to="/cart" ...>cart</NuxtLink>
        <NuxtLink to="/auth" ...>Login / Signup</NuxtLink>
      -->

      <!-- Commission CTA -->
      <NuxtLink
        to="/contact#commission-form"
        class="hidden md:inline-flex items-center justify-center border border-h3d-accent text-h3d-accent px-4 py-2 font-h3d-body text-2xs font-medium tracking-widest uppercase transition-all hover:bg-h3d-accent hover:text-h3d-base no-underline"
      >
        Commission a Piece
      </NuxtLink>

      <!-- Hamburger (Mobile) -->
      <button class="md:hidden flex flex-col gap-1 bg-transparent border-none p-1 cursor-pointer" aria-label="Open menu" @click="mobileMenuOpen = !mobileMenuOpen">
        <span class="block w-5 h-px bg-h3d-muted"></span>
        <span class="block w-5 h-px bg-h3d-muted"></span>
        <span class="block w-5 h-px bg-h3d-muted"></span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-200 bg-h3d-base bg-opacity-96 flex flex-col px-7 py-6 md:hidden">
      <button class="self-end text-h3d-muted font-h3d-body text-xs tracking-widest font-medium mb-8" @click="mobileMenuOpen = false">CLOSE ✕</button>
      <ul class="flex flex-col gap-0 list-none">
        <li><NuxtLink to="/" :class="mobileNavClass('/')" @click="mobileMenuOpen = false">Home</NuxtLink></li>
        <li><NuxtLink to="/products" :class="mobileNavClass('/products')" @click="mobileMenuOpen = false">Products</NuxtLink></li>
        <li><NuxtLink to="/our-story" :class="mobileNavClass('/our-story')" @click="mobileMenuOpen = false">Our Story</NuxtLink></li>
        <li><NuxtLink to="/contact" :class="mobileNavClass('/contact')" @click="mobileMenuOpen = false">Connect</NuxtLink></li>
        <!-- <li v-if="!isLoggedIn">
          <NuxtLink
            to="/auth"
            class="block py-4 border-b border-h3d-border font-h3d-body text-h3d-accent tracking-widest text-xs uppercase"
            @click="mobileMenuOpen = false"
          >
            Login / Signup
          </NuxtLink>
        </li> -->
      </ul>
    </div>
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

const isLoggedIn = computed(() => auth.isLoggedIn)
const userInitials = computed(() => auth.userInitials)
const wishlistCount = computed(() => wishlist.count)
const cartCount = computed(() => cart.itemCount)

function navClass(path: string, exact = false) {
  const active = exact ? route.path === path : route.path.startsWith(path)
  return [
    'font-h3d-body text-xs font-medium tracking-widest transition-colors border-b pb-0.5',
    active
      ? 'text-h3d-text border-h3d-accent'
      : 'text-h3d-muted border-transparent hover:text-h3d-text hover:border-h3d-muted',
  ]
}

function mobileNavClass(path: string) {
  const active = route.path.startsWith(path)
  return [
    'block py-4 border-b border-h3d-border font-h3d-body tracking-widest transition-colors',
    active ? 'text-h3d-accent font-medium' : 'text-h3d-text',
  ]
}
</script>
