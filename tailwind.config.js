/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.ts", // برای اطمینان از اسکن Nuxt config
  ],
  darkMode: "class", // برای فعال‌سازی تم دارک/روشن با کلاس 'dark' در تگ html
  theme: {
    extend: {},
  },
  plugins: [],
};
