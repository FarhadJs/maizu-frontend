```vue
<template>
  <div>
    <!-- Mobile Drawer with Translate-X Animation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      right
      class="transform transition-transform duration-300 ease-in-out -mt-4 h-screen"
      :class="{ 'translate-x-0 !w-screen md:!w-[30%] lg:!w-[20%] xl:!w-[13%]': drawer, 'translate-x-full': !drawer }"
    >
      <!-- Close Button -->
      <div class="flex justify-end p-4">
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <!-- Drawer Content -->
      <v-list nav>
        <template v-for="(item, index) in menuItems" :key="index">
          <!-- Category with Subs: Expandable -->
          <v-list-group v-if="item.subs && item.subs.length > 0">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title
                  ><Icon name="carbon:category" /> {{ item.title }}</v-list-item-title
                >
              </v-list-item>
            </template>
            <v-list-item
              v-for="(sub, subIndex) in item.subs"
              :key="subIndex"
              density="compact"
            >
              <!-- :to="sub.link" -->
              <NuxtLink to="/" class="text-decoration-none" @click="drawer = false">
                <v-list-item-title>{{ sub.title }}</v-list-item-title>
              </NuxtLink>
            </v-list-item>
          </v-list-group>
          <!-- Category without Subs -->
          <v-list-item v-else-if="item.title == 'Home'">
            <!-- :to="item.link" -->
            <NuxtLink to="/" class="!hidden lg:block" @click="drawer = false">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </NuxtLink>
          </v-list-item>
          <v-list-item v-else>
            <!-- :to="item.link" -->
            <NuxtLink to="/" class="text-decoration-none" @click="drawer = false">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </NuxtLink>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot />
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Use defineModel for two-way binding on 'drawer' prop (Vue 3.4+ / Nuxt 4 compatible)
const drawer = defineModel<boolean>("drawer", { default: false });

// Dynamic menu items (categories and subcategories) - Type-safe
interface MenuItem {
  title: string;
  link?: string;
  subs?: { title: string; link: string }[];
}

const menuItems = ref<MenuItem[]>([
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Category 1",
    subs: [
      { title: "Subcategory 1.1", link: "/cat1/sub1" },
      { title: "Subcategory 1.2", link: "/cat1/sub2" },
    ],
  },
  {
    title: "Category 2",
    subs: [
      { title: "Subcategory 2.1", link: "/cat2/sub1" },
      { title: "Subcategory 2.2", link: "/cat2/sub2" },
      { title: "Subcategory 2.3", link: "/cat2/sub3" },
    ],
  },
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact",
    link: "/contact",
  },
]);
</script>

<style scoped>
/* Tailwind CSS is included in the class attributes above */
</style>
```
