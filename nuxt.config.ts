import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,

  runtimeConfig: {
    dbHost: process.env.NUXT_DB_HOST || '127.0.0.1',
    dbPort: process.env.NUXT_DB_PORT || '3306',
    dbUser: process.env.NUXT_DB_USER || 'root',
    dbPassword: process.env.NUXT_DB_PASSWORD || '',
    dbName: process.env.NUXT_DB_NAME || 'hamro3d',
    sessionSecret:
      process.env.NUXT_SESSION_SECRET || 'hamro3d-dev-session-secret-change-in-production',
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET || '',
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },

  // Pages, layouts, and components live under app/
  srcDir: 'app/',

  // Server-side code (API routes, middleware, utils) lives in root server/
  serverDir: resolve(__dirname, 'server'),

  // Nuxt resolves dir.* relative to srcDir, so the default dir.public = 'public'
  // becomes 'app/public/' which doesn't exist. Setting an absolute path here fixes:
  //   1. Static file deployment on Vercel (Nitro copies from the right directory)
  //   2. @nuxt/image IPX provider (image.dir defaults to this value)
  dir: {
    public: resolve(__dirname, 'public'),
  },

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

  // Image — @nuxt/image auto-detects ipx locally, vercel on Vercel deployment.
  // image.dir defaults to nuxt.options.dir.public, which is now the correct
  // absolute path set above, so no override is needed here.
  image: {
    provider: 'ipx',
    dir: resolve(__dirname, 'public'),
    quality: 80,
    formats: ['webp', 'avif']
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
    '/admin/**': { ssr: true },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  hooks: {
    'app:resolve'(app) {
      app.plugins = app.plugins.filter(
        (plugin) => !String(plugin.src).includes('pinia') || !String(plugin.src).includes('payload-plugin'),
      )
    },
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

  // Global app config — page & layout transitions
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // Compatibility
  compatibilityDate: '2024-04-03',
})
