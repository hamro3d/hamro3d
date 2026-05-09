<template>
  <div class="px-h3d-md py-h3d-section max-w-h3d-max mx-auto w-full">
    <h1 class="font-h3d-display text-h3d-h2 text-h3d-text mb-h3d-lg">
      Collection: {{ route.params.slug }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-h3d-gutter">
      <!-- Pieces in collection will be rendered here -->
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useSeoMeta({
  title: `Collection: ${route.params.slug}`,
  description: `Explore the ${route.params.slug} collection from Hamro3D.`,
  ogImage: '/og/collection.jpg',
})
</script>
