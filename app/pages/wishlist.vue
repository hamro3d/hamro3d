<template>
  <div class="max-w-h3d-max mx-auto px-6 sm:px-10 py-10 sm:py-14">
    <!-- Header -->
    <header class="mb-10 sm:mb-12 max-w-2xl">
      <p
        class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent mb-3"
      >
        MY WISHLIST
      </p>
      <h1
        class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-4"
      >
        Saved Pieces
      </h1>
      <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
        Pieces you have saved for later — commissions you are still choosing the right moment to give.
      </p>
    </header>

    <!-- Empty state -->
    <div
      v-if="wishlistItems.length === 0"
      class="flex flex-col items-center justify-center py-16 sm:py-24 text-center border border-h3d-border bg-h3d-surface px-8"
    >
      <div
        class="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-h3d-border bg-h3d-base text-h3d-accent"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-8 w-8 stroke-current fill-none"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          />
        </svg>
      </div>
      <h2
        class="font-h3d-display text-xl sm:text-2xl font-light text-h3d-text mb-3"
      >
        Your wishlist is empty
      </h2>
      <p class="font-h3d-body text-sm text-h3d-muted max-w-md mb-8 leading-relaxed">
        Save pieces you love while you decide — they will wait here quietly until you are ready.
      </p>
      <NuxtLink
        to="/products"
        class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent underline decoration-h3d-border underline-offset-4 transition-colors hover:text-h3d-text"
      >
        Explore Collection
      </NuxtLink>
    </div>

    <!-- Grid -->
    <ul
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
    >
      <li
        v-for="item in wishlistItems"
        :key="item.id"
        class="group relative border border-h3d-border bg-h3d-surface flex flex-col"
      >
        <NuxtLink
          :to="`/products/${item.id}`"
          class="relative aspect-[4/5] bg-h3d-base border-b border-h3d-border flex items-center justify-center"
          :aria-label="`View ${item.name}`"
        >
          <NuxtImg
            v-if="item.image"
            :src="item.image"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            sizes="sm:50vw md:33vw lg:25vw"
          />
          <div
            v-else
            class="h-24 w-16 border border-h3d-border bg-h3d-border/40 opacity-70"
            aria-hidden="true"
          />
          <button
            type="button"
            class="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border border-h3d-border bg-h3d-surface/90 font-h3d-body text-lg leading-none text-h3d-muted transition-colors hover:border-h3d-accent hover:text-h3d-text"
            :aria-label="`Remove ${item.name} from saved pieces`"
            @click.prevent.stop="removeFromWishlist(item.id)"
          >
            <span aria-hidden="true">×</span>
          </button>
        </NuxtLink>
        <div class="h-0.5 bg-h3d-accent/40" aria-hidden="true" />
        <div class="flex flex-1 flex-col p-4 sm:p-5">
          <p
            class="font-h3d-body text-2xs uppercase tracking-widest text-h3d-accent mb-2"
          >
            {{ item.tag }}
          </p>
          <h2 class="font-h3d-display text-base text-h3d-text mb-2 flex-1">
            <NuxtLink :to="`/products/${item.id}`" class="text-inherit transition-colors hover:text-h3d-accent">
              {{ item.name }}
            </NuxtLink>
          </h2>
          <p class="font-h3d-body text-sm text-h3d-muted tabular-nums mb-5">
            NPR {{ item.price }}
          </p>
          <NuxtLink
            :to="`/products/${item.id}`"
            class="mt-auto flex w-full items-center justify-center border border-h3d-border bg-h3d-base py-3 font-h3d-body text-2xs font-semibold uppercase tracking-widest text-h3d-text transition-colors hover:border-h3d-accent hover:bg-h3d-surface no-underline"
          >
            Commission This Piece
          </NuxtLink>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'

definePageMeta({
  layout: 'profile',
})

const wishlist = useWishlistStore()

const wishlistItems = computed(() => wishlist.items)

function removeFromWishlist(id: number): void {
  wishlist.remove(id)
}

useSeoMeta({
  title: 'Saved Pieces',
  description:
    'Your saved Hamro3D pieces — crafts and commissions you are considering for the people who matter.',
  ogTitle: 'Saved Pieces — Hamro3D',
  ogDescription:
    'Pieces you have saved until the right moment to commission.',
})
</script>
