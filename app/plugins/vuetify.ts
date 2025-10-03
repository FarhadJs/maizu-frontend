import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi"; // برای استفاده از Material Design Icons
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true, // این برای SSR در Nuxt 3 حیاتی است.
    // Vuetify باید بداند که در محیط SSR در حال اجرا است.
    components: {
      ...components,
    },
    directives,
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
    icons: {
      defaultSet: "mdi",
      sets: { mdi },
    },
  });

  // استفاده از Vuetify با Vue App
  nuxtApp.vueApp.use(vuetify);
});
