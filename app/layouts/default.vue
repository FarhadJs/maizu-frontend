<script setup lang="ts">
import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';

const vuetifyTheme = useTheme();
const isDark = ref(false);

onMounted(() => {
        if (import.meta.client) { // اطمینان حاصل شود که این کد فقط در کلاینت اجرا می‌شود
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        isDark.value = true;
                        document.documentElement.classList.add('dark');
                        vuetifyTheme.global.name.value = 'dark';
                } else {
                        isDark.value = false;
                        document.documentElement.classList.remove('dark');
                        vuetifyTheme.global.name.value = 'light';
                }
        }
});

function toggleTheme() {
        if (import.meta.client) { // اطمینان حاصل شود که این کد فقط در کلاینت اجرا می‌شود
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
}
</script>

<template>
        <v-app :theme="vuetifyTheme.global.name.value">
                <v-app-bar app>
                        <v-app-bar-title>Maizu E-commerce</v-app-bar-title>
                        <v-spacer />
                        <v-btn icon @click="toggleTheme">
                                <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
                        </v-btn>
                </v-app-bar>
                <v-main>
                        <v-container>
                                <!-- NuxtPage اینجا قرار می‌گیرد تا محتوای صفحات را در داخل Layout رندر کند -->
                                <slot />
                               
                        </v-container>
                </v-main>
        </v-app>
</template>