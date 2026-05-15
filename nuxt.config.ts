export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,

  // Pages, layouts, and components live under app/
  srcDir: 'app/',

  // Use H3dNavbar / H3dFooter (not LayoutH3dNavbar) for files in components/layout/
  components: [
    { path: '~/components', ignore: ['**/layout/**'] },
    { path: '~/components/layout', pathPrefix: false },
  ],

  // CSS (relative to project root)
  css: ['./app/assets/css/main.css'],

  // PostCSS for Tailwind v4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  // Image — use Vercel's built-in image optimization in production
  image: {
    quality: 80,
    formats: ['webp', 'avif'],
    provider: 'vercel',
  },

  // Rendering & caching strategy
  routeRules: {
    // Legacy prototype URLs → file-based routes
    '/orders': { redirect: '/profile/orders' },
    '/admin/dashboard': { redirect: '/admin' },
    '/admin/add-product': { redirect: '/admin/products' },
    '/collections': { redirect: '/products' },
    '/collections/**': { redirect: '/products/**' },
    '/piece/**': { redirect: '/products/**' },
    '/': { isr: 3600 },
    '/products/**': { isr: 600 },
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
