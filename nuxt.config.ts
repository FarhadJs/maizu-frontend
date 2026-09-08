// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
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
    "vuetify-nuxt-module",
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#293896",
              secondary: "#5CBBF6",
              accent: "#FF4081",
              background: "#FFFFFF",
              surface: "#FFFFFF",
              error: "#B00020",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
          dark: {
            colors: {
              primary: "#2196F3",
              secondary: "#424242",
              accent: "#FF4081",
              background: "#121212",
              surface: "#1E1E1E",
              error: "#CF6679",
              info: "#BB86FC",
              success: "#03DAC6",
              warning: "#FB8C00",
            },
          },
        },
      },
      locale: {
        rtl: { fa: true },
      },
      icons: {
        defaultSet: "mdi",
      },
    },
    moduleOptions: {
      styles: "sass",
    },
  },

  css: ["./app/assets/css/main.css"],

  image: {
    provider: "ipx",
    domains: ["example.com"],
    presets: {
      thumbnail: {
        modifiers: {
          width: 300,
          height: 300,
        },
      },
    },
  },
});
