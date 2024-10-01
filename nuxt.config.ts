// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from "@nuxtjs/tailwindcss"

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  components: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,  // Variável exposta no lado do cliente
    }
  },
  plugins: [
    '~/plugins/toast.ts', // Registrar o plugin toast
  ],
  tailwindcss: {
    config: {
      plugins: [tailwindTypography]
    }
  }
})
