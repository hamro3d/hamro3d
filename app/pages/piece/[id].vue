<template>
  <div class="px-h3d-md py-h3d-section max-w-h3d-max mx-auto w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-h3d-gutter">
      <!-- Piece image gallery will go here -->
      <div class="bg-h3d-surface aspect-h3d-product flex items-center justify-center">
        <p class="text-h3d-muted">Image gallery</p>
      </div>

      <!-- Piece details will go here -->
      <div class="space-y-h3d-md">
        <h1 class="font-h3d-display text-h3d-h2 text-h3d-text">
          Piece Title
        </h1>

        <p class="font-h3d-body text-h3d-lead text-h3d-muted">
          Piece description goes here.
        </p>

        <!-- Price, CTA, etc. -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useSeoMeta({
  title: 'Piece Details',
  description: 'Discover this meaningful keepsake from Hamro3D.',
  ogImage: '/og/piece.jpg',
})
</script>
