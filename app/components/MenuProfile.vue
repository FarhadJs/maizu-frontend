<template>
  <v-locale-provider rtl>
    <div class="text-center">
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
        <template #activator="{ props }">
          <v-btn
            size="50"
            v-bind="props"
            style="background-color: #293896; color: white; height: 3rem; width: 3rem"
            ><Icon name="heroicons:user" class="text-2xl"
          /></v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
              :subtitle="
                user_info!.role == 'super_admin'
                  ? 'مالک'
                    : user_info!.role == 'admin'
                      ? 'ادمین'
                      : 'مشتری'
              "
              :title="user_info!.firstName + ' ' + user_info!.lastName"
            />
          </v-list>

          <v-divider />

          <v-list>
            <v-list-item>
              <v-btn>
                <NuxtLink @click="menu = false" to="/Dashboard">داشبورد</NuxtLink>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-card-actions class="flex justify-between border-t">
            <div class="flex items-center gap-3">
              <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" />
              <v-switch
                v-model="isDark"
                color="primary"
                hide-details
                @click="toggleTheme"
              />
            </div>
            <v-btn v-if="authStore.isAuthenticated" class="" @click="handleLogout">
              خروج
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </v-locale-provider>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "../stores/auth";
import type { User } from "../types/User.type";
// import { useRouter } from "vue-router";

// const router = useRouter();
const menu = ref(false);
const vuetifyTheme = useTheme();
const authStore = useAuthStore();
const isDark = ref(false);
const user_info = ref<User | undefined>(undefined);

// {
//     "id": "68db9de82fdd10c41a6454fe",
//     "phoneNumber": "09233304531",
//     "role": "super_admin",
//     "isProfileCompleted": true,
//     "firstName": "فرهاد",
//     "lastName": "فلاحی",
//     "email": "farhadfallahi2004@gmail.com"
// }

onMounted(() => {
  /* ... (منطق تغییر تم بدون تغییر) ... */
  if (import.meta.client) {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDark.value = true;
      document.documentElement.classList.add("dark");
      vuetifyTheme.change("dark");
      // vuetifyTheme.global.name.value = "dark";
    } else {
      isDark.value = false;
      document.documentElement.classList.remove("dark");
      vuetifyTheme.change("light");
      // vuetifyTheme.global.name.value = "light";
    }
  }

  authStore.fetchUser().then((res: User) => {
    user_info.value = res;
  });
});

function toggleTheme() {
  if (import.meta.client) {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      vuetifyTheme.change("dark");
      // vuetifyTheme.global.name.value = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      vuetifyTheme.change("light");
      // vuetifyTheme.global.name.value = "light";
    }
  }
}

async function handleLogout() {
  const loggedOut = await authStore.logout();
  if (loggedOut) {
    location.pathname = "/login"; // هدایت به صفحه ورود پس از خروج موفق
  }
}
</script>
