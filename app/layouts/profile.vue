<template>
  <div
    class="flex min-h-screen flex-col bg-h3d-base font-h3d-body text-h3d-text"
  >
    <H3dNavbar />

    <div
      class="flex min-h-[calc(100vh-68px)] flex-1 flex-col bg-h3d-base md:flex-row"
    >
      <div
        class="hidden w-[260px] flex-shrink-0 bg-h3d-surface md:block"
      >
        <H3dSideProfileNavbar />
      </div>

      <main class="min-w-0 flex-1 bg-h3d-base">
        <slot />
      </main>
    </div>

    <H3dFooter />
  </div>
</template>

<script setup lang="ts"></script>
