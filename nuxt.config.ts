// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformAssetUrls } from "vite-plugin-vuetify";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/icon",
    "nuxt-swiper",
  ],
  vite: {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./", import.meta.url)),
      },
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
    "./app/assets/css/main.css", // اضافه کردن فایل CSS Tailwind
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  icon: {
    customCollections: [
      {
        prefix: "maizu-icons",
        dir: "./app/assets/maizu-icons",
      },
    ],
  },

  image: {
    // برای تصاویر محلی، provider پیش‌فرض IPX کافیه
    provider: "ipx", // یا 'static' برای سادگی
    // اگر تصاویر خارجی داری، دامنه‌ها رو whitelist کن
    domains: ["example.com"], // اختیاری
    // preset برای اندازه‌های رایج
    presets: {
      thumbnail: {
        modifiers: {
          width: 300,
          height: 300,
        },
      },
    },
  },
  plugins: ["../app/plugins/vuetify.ts"],
});
