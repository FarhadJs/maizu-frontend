<template>
  <div>
    
      <v-app-bar app>
        <v-app-bar-title>Maizu E-commerce</v-app-bar-title>
        <v-spacer />
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';
defineOptions({ name: 'AppHeader' });

const vuetifyTheme = useTheme();
const isDark = ref(false);

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
    vuetifyTheme.global.name.value = 'dark';
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
    vuetifyTheme.global.name.value = 'light';
  }
});

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    vuetifyTheme.global.name.value = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    vuetifyTheme.global.name.value = 'light';
  }
}
</script>

<style></style>