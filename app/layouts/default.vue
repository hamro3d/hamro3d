<template>
  <div class="flex flex-col min-h-screen bg-h3d-base text-h3d-text">
    <!-- Navbar -->
    <H3dNavbar />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <H3dFooter />
  </div>
</template>

<script setup lang="ts">
// Layout logic
</script>
