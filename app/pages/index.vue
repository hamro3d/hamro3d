<template>
  <div class="space-y-h3d-section">
    <!-- Hero section placeholder -->
    <section class="h-screen bg-h3d-surface flex items-center justify-center">
      <div class="text-center">
        <h1 class="font-h3d-display text-h3d-hero text-h3d-text">
          Hamro3D
        </h1>
        <p class="font-h3d-body text-h3d-lead text-h3d-muted mt-h3d-md">
          Crafted with care. Made to mean something.
        </p>
      </div>
    </section>

    <!-- Collections section placeholder -->
    <section class="px-h3d-md py-h3d-section max-w-h3d-max mx-auto w-full">
      <h2 class="font-h3d-display text-h3d-h2 text-h3d-text mb-h3d-lg">
        Collections
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-h3d-gutter">
        <!-- Collection cards will go here -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Hamro3D — Crafted with Care',
  description: 'Meaningful keepsakes handcrafted in Kathmandu. Preserve moments in tangible form.',
  ogImage: '/og/home.jpg',
  ogType: 'website',
})
</script>
