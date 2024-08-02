// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from "@nuxtjs/tailwindcss"

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    config: {
      plugins: [tailwindTypography]
    }
  }
})
