<template>
  <div class="-mt-32 lg:-mt-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4">
          <v-card-title class="text-h5 font-weight-bold text-center">
            سبد خرید
          </v-card-title>

          <!-- Empty Cart State -->
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-cart-outline</v-icon>
            <p class="text-h6 mt-4">سبد خرید شما خالی است</p>
            <v-btn color="primary" to="/" class="mt-2"> بازگشت به فروشگاه </v-btn>
          </div>

          <!-- Cart Items -->
          <div v-else>
            <v-list>
              <v-list-item
                v-for="(item, index) in cartItems"
                :key="index"
                class="border-cart border-gray-100"
              >
                <template v-slot:prepend>
                  <v-avatar size="60">
                    <v-img :src="item.image" alt="Product Image" />
                  </v-avatar>
                </template>

                <div>
                  <v-list-item-title class="text-h6">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 text-gray-600 dark:text-white">
                    {{ item.description }}
                  </v-list-item-subtitle>
                  <div class="d-flex align-center mt-2">
                    <span class="text-body-1 font-weight-bold mr-4">
                      {{ item.price.toLocaleString("fa-IR") }} تومان
                    </span>
                    <v-btn
                      icon
                      size="x-small"
                      @click="updateQuantity(item.id, item.quantity - 1)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <v-text-field
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      max="99"
                      variant="outlined"
                      density="compact"
                      class="mx-2"
                      style="width: 80px"
                      @update:model-value="updateQuantity(item.id, Number($event))"
                    />
                    <v-btn
                      icon
                      size="x-small"
                      @click="updateQuantity(item.id, item.quantity + 1)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn icon color="error" @click="removeItem(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  <div class="text-caption text-gray-500 dark:text-gray-400 mt-1">
                    جمع:
                    {{ (item.price * item.quantity).toLocaleString("fa-IR") }} تومان
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <!-- Cart Summary -->
            <v-card class="mt-6 pa-4">
              <v-card-title class="text-h6">خلاصه سبد خرید</v-card-title>
              <v-card-text>
                <div class="d-flex justify-space-between mb-2">
                  <span>جمع کل:</span>
                  <span class="font-weight-bold"
                    >{{ total.toLocaleString("fa-IR") }} تومان</span
                  >
                </div>
                <v-divider />
                <div class="d-flex justify-space-between mt-2">
                  <span class="text-h6">مبلغ قابل پرداخت:</span>
                  <span class="text-h6 font-weight-bold"
                    >{{ total.toLocaleString("fa-IR") }} تومان</span
                  >
                </div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn color="primary" size="large" block @click="proceedToCheckout">
                  تسویه حساب
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router"; // Auto-imported in Nuxt 4

const router = useRouter();

// Mock cart data (replace with useCart composable or Pinia store in real app)
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: "محصول نمونه 1",
    description: "توضیحات کوتاه محصول",
    price: 150000,
    quantity: 2,
    image: "/images/AD(1024x1024).jpg",
  },
  {
    id: 2,
    name: "محصول نمونه 2",
    description: "توضیحات کوتاه محصول دیگر",
    price: 250000,
    quantity: 1,
    image: "/images/AD(1024x1024).jpg",
  },
]);

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

function updateQuantity(id: number, quantity: number) {
  const item = cartItems.value.find((item) => item.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    if (item.quantity === 0) {
      removeItem(id);
    }
    // Emit or update store here in real app
  }
}

function removeItem(id: number) {
  const index = cartItems.value.findIndex((item) => item.id === id);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
  // Emit or update store here in real app
}

function proceedToCheckout() {
  // Navigate to checkout or handle payment
  router.push("/checkout");
}
</script>

<style scoped>
/* Tailwind integration if needed */
.border-cart {
  @apply !flex !flex-col !py-4 border-b-2 border-gray-100;
}
</style>
