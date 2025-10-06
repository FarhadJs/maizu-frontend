<!-- eslint-disable nuxt/prefer-import-meta -->
<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import MenuProfileVue from "../components/MenuProfile.vue";

const vuetifyTheme = useTheme();
const isDark = ref(false);
const authStore = useAuthStore();
const loaded = ref(false);
const loading = ref(false);
const drawer = ref(false);

const productCategories = [
  {
    title: "محصولات الکترونیکی",
    link: "/",
    subCategories: [
      { title: "موبایل", link: "/" },
      { title: "لپ‌تاپ", link: "/" },
      { title: "لوازم جانبی", link: "/" },
    ],
  },
  {
    title: "لباس و مد",
    link: "/",
    subCategories: [
      { title: "مردانه", link: "/" },
      { title: "زنانه", link: "/" },
    ],
  },
  {
    title: "کتاب‌ها",
    link: "/",
    subCategories: [
      { title: "رمان", link: "/" },
      { title: "علمی", link: "/" },
    ],
  },
];

onMounted(() => {
  if (import.meta.client) {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDark.value = true;
      document.documentElement.classList.add("dark");
      vuetifyTheme.change("dark"); // فیکس deprecation
    } else {
      isDark.value = false;
      document.documentElement.classList.remove("dark");
      vuetifyTheme.change("light");
    }
  }
});

function toggleTheme() {
  if (import.meta.client) {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      vuetifyTheme.change("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      vuetifyTheme.change("light");
    }
  }
}

function onSearch() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    loaded.value = true;
  }, 2000);
}

function updateRoute(name: string) {
  console.log(name);

  switch (name) {
    case "home":
      useRouter().push("/");
      break;
    case "categories":
      drawer.value = true;
      break;
    case "account-info'":
      useRouter().push("/Dashboard/account-info");
      break;
    case "cart":
      useRouter().push("/cart");
      break;

    default:
      break;
  }
}
</script>

<template>
  <v-app :theme="vuetifyTheme.global.name.value">
    <v-app-bar class="custom-app-bar">
      <div class="flex flex-column w-full lg:mt-1">
        <div class="flex items-center">
          <v-btn
            style="background-color: #293896"
            class="desktop-view mx-4 text-white"
            size="3rem"
          >
            <Icon name="carbon:shopping-cart" class="text-2xl" />
          </v-btn>

          <client-only>
            <template v-if="!authStore.isAuthenticated">
              <v-btn
                v-if="!authStore.isAuthenticated"
                style="background-color: #293896; color: white; height: 3rem"
                class="desktop-view"
                ><NuxtLink to="/login"> ورود | ثبت نام</NuxtLink></v-btn
              >
            </template>
            <MenuProfileVue v-if="authStore.isAuthenticated" class="desktop-view" />
          </client-only>

          <client-only>
            <div
              
              class="hidden lg:!flex items-center gap-3 ml-5"
            >
              <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" />
              <v-switch
                v-model="isDark"
                color="primary"
                hide-details
                @click="toggleTheme"
              />
            </div>
          </client-only>
          <button
            style="background-color: #293896; color: white"
            class="mobile-view ml-4 !w-10 p-2 rounded flex items-center justify-center"
          >
            <Icon name="heroicons:magnifying-glass-16-solid" class="text-lg" />
          </button>

          <v-spacer />

          <client-only>
            <div class="hidden lg:block lg:w-[40%] relative mr-5">
              <v-locale-provider :rtl="true">
                <v-card-text>
                  <v-text-field
                    :loading="loading"
                    append-inner-icon="mdi-magnify"
                    density="compact"
                    label="جست و جو کنید"
                    variant="solo"
                    hide-details
                    single-line
                    dir="rtl"
                    bg-color="#293896"
                    class="h-12"
                    @click:append-inner="onSearch"
                  />
                </v-card-text>
              </v-locale-provider>
            </div>
          </client-only>
          <NuxtLink to="/">
            <NuxtImg
              src="/images/brand-2.png"
              loading="lazy"
              quality="80"
              class="h-7 lg:h-12 mr-5 dark:bg-white dark:bg-opacity-80 dark:rounded-md"
              draggable="false"
            />
          </NuxtLink>
        </div>

        <div
          class="hidden lg:flex flex-row-reverse items-center justify-between mr-4 mt-2"
        >
          <div class="flex flex-row-reverse">
            <v-btn class="flex items-center" @click="drawer = !drawer">
              <p>دسته بندی محصولات</p>
              <Icon name="heroicons:bars-3-16-solid" class="text-2xl ml-3" />
            </v-btn>
            <v-spacer class="mx-3" />
            <v-btn
              ><p class="mr-2">کامپیوتر</p>
              <Icon name="carbon:screen" />
            </v-btn>
            <v-btn
              ><p class="mr-2">لپ تاپ</p>
              <Icon name="carbon:laptop" />
            </v-btn>
            <v-btn
              ><p class="mr-2">موبایل</p>
              <Icon name="heroicons:device-phone-mobile" />
            </v-btn>
            <v-btn
              ><p class="mr-2">کنسول</p>
              <Icon name="carbon:game-console" />
            </v-btn>
            <v-btn
              ><p class="mr-2">خدمات و تعمیرات کامپیوتر</p>
              <Icon name="carbon:cloud-monitoring" />
            </v-btn>
          </div>
          <v-btn dir="rtl" class="ml-4">
            <span dir="ltr">035 372* ****</span>
            <p class="mr-2">: پشتیبانی</p>
            <Icon name="streamline:customer-support-1" class="mr-3" />
          </v-btn>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <client-only>
        <v-container>
          <v-locale-provider class="desktop-view" :rtl="true">
            <v-navigation-drawer
              v-model="drawer"
              location="right"
              temporary
              class="lg:mt-10"
            >
              <v-btn v-if="drawer" icon class="close-btn" @click="drawer = false">
                <Icon name="heroicons:x-mark-20-solid" class="text-2xl" />
              </v-btn>
              <div class="sidebar-content">
                <v-list nav class="category-list">
                  <v-list-item
                    v-for="(category, index) in productCategories"
                    :key="index"
                    class="category-item"
                  >
                    <v-menu
                      open-on-hover
                      location="start"
                      :close-on-content-click="false"
                    >
                      <template #activator="{ props }">
                        <v-list-item-title
                          v-bind="props"
                          style="
                            padding: 10px;
                            font-size: large;
                            font-weight: 500;
                            width: 14rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                          class="hover:bg-[#00b9ec2a] focus-within:bg-[#00b9ec2a] dark:hover:bg-[#00b9ec9f] dark:focus-within:bg-[#00b9ec9f] rounded"
                        >
                          <NuxtLink
                            :to="category.link"
                            class="p-2 w-full"
                            @click="navigateTo(category.link)"
                          >
                            <p>{{ category.title }}</p>
                          </NuxtLink>
                          <v-icon><Icon name="heroicons:chevron-left-16-solid" /></v-icon>
                        </v-list-item-title>
                      </template>
                      <v-list class="submenu">
                        <v-list-item
                          v-for="(subItem, subIndex) in category.subCategories"
                          :key="subIndex"
                          @click="navigateTo(subItem.link)"
                        >
                          <v-list-item-title class="submenu-title">
                            {{ subItem.title }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item>
                </v-list>
              </div>
            </v-navigation-drawer>
          </v-locale-provider>
          <slot />
          <NavigationMobile @change-route="updateRoute" />
        </v-container>
      </client-only>
    </v-main>
  </v-app>
</template>

<style scoped>
ul {
  @apply flex flex-row-reverse;
}
.v-card-text {
  @apply py-0 !important;
}

.custom-app-bar :deep(.v-toolbar__content) {
  @apply h-12 lg:h-28 !important; /* :deep برای penetration به child elements Vuetify */
}

/* استایل‌های منوی کناری */

/* نوار باریک برای دسته‌بندی‌ها */
.sidebar-content {
  display: flex;
  justify-content: flex-end;
  height: 100%;
  position: relative;
}

.category-list {
  width: 300px; /* عرض نوار باریک */
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.category-item {
  @apply flex;
  padding: 8px 0;
}

.category-title {
  cursor: pointer;
  font-weight: 500;
  font-size: 1.1rem;
}

.submenu-icon {
  margin-left: 8px;
}

/* استایل منوی زیرمجموعه‌ها */
.submenu {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  border-radius: 4px;
}

/* دکمه بستن منوی کناری */
.close-btn {
  @apply bg-transparent absolute top-3 -left-16 z-50;
}
</style>
