<template>
  <v-bottom-navigation
    v-model="navIndex"
    :bg-color="color"
    mode="shift"
    class="lg:!hidden"
    grow
  >
    <v-btn
      v-for="(item, index) in menuItems"
      :key="index"
      :value="index"
      @click="changeRoute(item.routeName)"
    >
      <v-icon class="nav-desktop-view">
        <Icon :name="item.icon" />
      </v-icon>
      <span class="text-[10px]">{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// const navIndex = defineModel<number>("navIndex", { default: 3 });

const route = useRoute();
const emits = defineEmits<{
  (e: "changeRoute", routeName: string): void;
}>();

// Dynamic menu items for flexibility
const menuItems = [
  {
    title: "حساب کاربری",
    icon: "heroicons:user",
    routeName: "account-info",
  },
  {
    title: "سبد خرید",
    icon: "carbon:shopping-cart",
    routeName: "cart",
  },
  {
    title: "دسته بندی ها",
    icon: "iconamoon:category-light",
    routeName: "categories",
  },
  {
    title: "خانه",
    icon: "carbon:home",
    routeName: "home",
  },
] as const;

const navIndex = ref(3); // Default to home (index 3)

const color = computed(() => {
  const colors = ["blue-grey", "teal", "brown", "indigo"];
  return colors[navIndex.value] || "blue-grey";
});

// Watch route changes to update active tab (SSR-safe initial load via onMounted if needed)

onMounted(() => {
  switch (route.path) {
    case "/Dashboard/account-info":
      navIndex.value = 0;
      break;
    case "/cart":
      navIndex.value = 1;
      break;
    case "/categories":
      navIndex.value = 2;
      break;
    case "/":
      navIndex.value = 3;
      break;
    default:
      navIndex.value = -1; // No active
      break;
  }
});
// If needed, force re-watch on client if hydration mismatch occurs
// if (import.meta.client && value.value === -1) {
//   value.value = 3;
//   // Re-run the switch logic here if necessary
// }

function changeRoute(routeName: string) {
  emits("changeRoute", routeName);
  // Optionally set value immediately for instant UI feedback
  const index = menuItems.findIndex((item) => item.routeName === routeName);
  if (index !== -1) {
    navIndex.value = index;
  }
}
</script>

<style scoped>
.nav-desktop-view {
  @apply mb-2;
}
</style>
