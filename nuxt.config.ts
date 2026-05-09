export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,

  // CSS
  css: ['./app/assets/css/main.css'],

  // PostCSS for Tailwind v4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Modules
  modules: [
    '@nuxt/image',
  ],

  // Image configuration
  image: {
    quality: 80,
    formats: ['webp', 'jpg'],
    provider: 'ipx',
  },

  // Rendering & caching strategy
  routeRules: {
    '/': { isr: 3600 },
    '/collections/**': { isr: 3600 },
    '/piece/**': { isr: 600 },
    '/commission': { ssr: true },
    '/our-story': { prerender: true },
    '/contact': { prerender: true },
    '/api/**': { cors: true },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Vite configuration for development
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.nuxt/**', '**/.output/**'],
      },
    },
  },

  // Compatibility
  compatibilityDate: '2024-04-03',
})
