import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf5',
          100: '#faf3e7',
          200: '#f5e6cc',
        },
        spice: {
          50: '#fef9f0',
          400: '#d97706',
          500: '#b45309',
          600: '#92400e',
        },
        herb: {
          400: '#65a30d',
          500: '#4d7c0f',
        },
        charcoal: {
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
} satisfies Config
