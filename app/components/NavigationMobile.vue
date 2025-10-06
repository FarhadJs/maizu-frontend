<template>
  <!-- <v-layout class="overflow-visible" style="height: 56px"> -->
  <v-bottom-navigation v-model="value" :bg-color="color" mode="shift" class="lg:hidden">
    <v-btn @click="changeRouter('account-info')">
      <v-icon class="nav-desktop-view"><Icon name="heroicons:user" /></v-icon>

      <span>حساب کاربری</span>
    </v-btn>

    <v-btn @click="changeRouter('cart')">
      <v-icon class="nav-desktop-view"><Icon name="carbon:shopping-cart" /></v-icon>

      <span>سبد خرید</span>
    </v-btn>

    <v-btn @click="changeRouter('categories')">
      <v-icon class="nav-desktop-view"><Icon name="iconamoon:category-light" /></v-icon>

      <span>دسته بندی ها</span>
    </v-btn>

    <v-btn @click="changeRouter('home')">
      <v-icon class="nav-desktop-view"><Icon name="carbon:home" /></v-icon>

      <span>خانه</span>
    </v-btn>
  </v-bottom-navigation>
  <!-- </v-layout> -->
</template>
<script setup>
import { computed, ref } from "vue";
defineEmits(["changeRoute"]);

const value = ref(1);
const color = computed(() => {
  switch (value.value) {
    case 0:
      return "blue-grey";
    case 1:
      return "teal";
    case 2:
      return "brown";
    case 3:
      return "indigo";
    default:
      return "blue-grey";
  }
});

function changeRouter(name) {
  console.log(name);

  defineEmits("changeRoute")({ message: name });
}
</script>

<style scoped>
.nav-desktop-view {
  @apply mb-2;
}
</style>
