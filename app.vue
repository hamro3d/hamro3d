<template>
  <div class="bg-h3d-base text-h3d-text min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  titleTemplate: '%s — Hamro3D',
  ogLocale: 'en_NP',
  twitterCard: 'summary_large_image',
})
</script>
