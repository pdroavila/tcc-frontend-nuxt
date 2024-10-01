import { defineNuxtPlugin } from '#app'
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  }

  nuxtApp.vueApp.use(Toast, options)
})
