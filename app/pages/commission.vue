<template>
  <div class="space-y-h3d-md">
    <h1 class="font-h3d-display text-h3d-h2 text-h3d-text">
      Commission Your Piece
    </h1>

    <p class="font-h3d-body text-h3d-lead text-h3d-muted">
      Let's create something meaningful together.
    </p>

    <!-- Commission form will go here -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Commission',
  description: 'Create a custom handcrafted piece from Hamro3D.',
  ogImage: '/og/commission.jpg',
})
</script>
