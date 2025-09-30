<script setup lang="ts">
import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; // <--- ایمپورت Auth Store
import { useRouter } from 'vue-router'; // <--- ایمپورت useRouter برای هدایت پس از خروج

const vuetifyTheme = useTheme();
const isDark = ref(false);
const authStore = useAuthStore(); // <--- استفاده از Auth Store
const router = useRouter();

onMounted(() => { /* ... (منطق تغییر تم بدون تغییر) ... */
        if (import.meta.client) {
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

function toggleTheme() { /* ... (منطق تغییر تم بدون تغییر) ... */
        if (import.meta.client) {
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

// متد برای مدیریت خروج
async function handleLogout() {
        const loggedOut = await authStore.logout();
        if (loggedOut) {
                router.push('/login'); // هدایت به صفحه ورود پس از خروج موفق
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
                        <!-- <--- نمایش دکمه خروج اگر کاربر لاگین است --- > -->
                        <v-btn v-if="authStore.isAuthenticated" class="ml-2" @click="handleLogout">
                                خروج
                        </v-btn>
                </v-app-bar>
                <v-main>
                        <v-container>
                                <slot />
                        </v-container>
                </v-main>
        </v-app>
</template>