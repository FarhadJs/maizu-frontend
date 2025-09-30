// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths'
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  vite: {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url)),
      }
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: [
    "vuetify/lib/styles/main.sass", // اضافه کردن استایل‌های اصلی Vuetify
    "@mdi/font/css/materialdesignicons.min.css", // اضافه کردن آیکون‌ها
    "../assets/css/main.css", // اضافه کردن فایل CSS Tailwind
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
  "../app/plugins/vuetify.ts"
  ]
});