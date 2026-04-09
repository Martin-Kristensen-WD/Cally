export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],

  components: [{ path: '~/components', pathPrefix: false }],

  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/recipes/*'],
    },
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    },
  },

  runtimeConfig: {
    public: {
      adminEmail: process.env.NUXT_PUBLIC_ADMIN_EMAIL,
    },
  },

  nitro: {
    preset: 'vercel',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Cally — Food Inspiration & Recipes',
      meta: [
        { name: 'description', content: 'A curated collection of food inspiration and recipes with calorie estimates.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
