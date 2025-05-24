// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Для глобальных стилей
  css: [
    '@/assets/styles/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_variables.scss" as *;'
        }
      }
    }
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
