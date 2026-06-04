<template>
  <div class="flex flex-col min-h-screen bg-h3d-base text-h3d-text">
    <!-- Navbar -->
    <H3dNavbar />

    <!-- Navbar → content fade -->
    <div
      class="sticky top-[68px] z-50 h-8 pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(to bottom, rgba(16,8,26,0.72) 0%, transparent 100%)"
    />

    <!-- Main Content -->
    <main class="flex-grow -mt-8">
      <slot />
    </main>

    <!-- Content → footer fade -->
    <div
      class="h-8 pointer-events-none shrink-0"
      aria-hidden="true"
      style="background: linear-gradient(to top, rgba(16,8,26,0.72) 0%, transparent 100%)"
    />

    <!-- Footer -->
    <H3dFooter />
  </div>
</template>

<script setup lang="ts">
// Layout logic
</script>
