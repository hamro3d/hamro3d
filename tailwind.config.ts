import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.{vue,js,ts}',
    './app/pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'h3d': {
          'base': '#1A0E24',
          'surface': '#271540',
          'text': '#F2EDE8',
          'muted': '#A898B8',
          'border': '#3A2450',
          'accent': '#C4907A',
          'accent-hover': '#A07060',
          'success': '#6B8A70',
          'error': '#8B2A3A',
        },
      },
      fontFamily: {
        'h3d-display': ['EB Garamond', 'Georgia', 'serif'],
        'h3d-body': ['Jost', 'system-ui', 'sans-serif'],
        'h3d-devanagari': ['Rozha One', 'serif'],
        'h3d-devanagari-body': ['Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        'h3d-hero': ['clamp(2.4rem, 6vw, 4rem)', { lineHeight: '1.18' }],
        'h3d-h2': ['clamp(1.8rem, 4vw, 2.8rem)', { lineHeight: '1.25' }],
        'h3d-h3': ['clamp(1.2rem, 3vw, 1.8rem)', { lineHeight: '1.4' }],
        'h3d-h4': ['1.25rem', { lineHeight: '1.4' }],
        'h3d-h5': ['0.875rem', { lineHeight: '1.5' }],
        'h3d-lead': ['clamp(1.1rem, 2vw, 1.5rem)', { lineHeight: '1.8' }],
        'h3d-body': ['1rem', { lineHeight: '1.82' }],
        'h3d-body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'h3d-cta': ['0.875rem', { lineHeight: '1.5' }],
        'h3d-nav': ['0.938rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'h3d-xs': '0.5rem',
        'h3d-sm': '1rem',
        'h3d-md': '1.5rem',
        'h3d-lg': '2rem',
        'h3d-xl': '3rem',
        'h3d-gutter': '1.5rem',
        'h3d-section': 'clamp(5rem, 15vw, 13.75rem)',
      },
      maxWidth: {
        'h3d-max': '77.5rem',
        'h3d-text': '41.25rem',
        'h3d-grid': '68.75rem',
      },
      boxShadow: {
        'h3d-card': '0 10px 40px rgba(26, 14, 36, 0.3)',
      },
      aspectRatio: {
        'h3d-product': '4 / 5',
      },
    },
  },
  plugins: [],
} satisfies Config
