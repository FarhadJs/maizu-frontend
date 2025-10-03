<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from "vue";
import { ofetch } from "ofetch";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth"; // <--- ایمپورت Auth Store

definePageMeta({
  layout: "empty",
});

const router = useRouter();
const authStore = useAuthStore(); // <--- استفاده از Auth Store

// ... (سایر stateها و rules بدون تغییر)
const phoneNumber = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const isLoading = ref(false);
const errorMessages = ref<string[]>([]);
const successMessage = ref<string | null>(null);
const phoneNumberRules = [
  (v: string) => !!v || "شماره تلفن الزامی است.",
  (v: string) =>
    /^09\d{9}$/.test(v) || "فرمت شماره تلفن نامعتبر است (مثال: 09123456789).",
];
const nameRules = [(v: string) => !!v || "این فیلد الزامی است."];
const emailRules = [
  (v: string) => !!v || "ایمیل الزامی است.",
  (v: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    "فرمت ایمیل نامعتبر است.",
];

// متد ارسال فرم
async function submitSetupForm() {
  isLoading.value = true;
  errorMessages.value = [];
  successMessage.value = null;

  try {
    const response = await ofetch("http://localhost:3001/auth/setup-super-admin", {
      method: "POST",
      body: {
        phoneNumber: phoneNumber.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      },
      credentials: "include", // <--- این برای ارسال کوکی‌های سشن Back-end حیاتی است
    });

    successMessage.value = response.message || "Super-Admin با موفقیت ثبت شد.";

    // <--- لاگین کردن کاربر در Front-end بلافاصله پس از ثبت موفقیت‌آمیز
    await authStore.login(response.user); // `response.user` باید شامل id, phoneNumber, role و غیره باشد

    // هدایت به صفحه اصلی
    setTimeout(() => {
      router.push("/");
    }, 1500); // تأخیر کمتر، چون کاربر قبلاً در Front-end لاگین شده است
  } catch (error: any) {
    // ... (مدیریت خطا بدون تغییر)
    console.error("Error setting up Super-Admin:", error);
    if (error.response && error.response._data && error.response._data.message) {
      if (Array.isArray(error.response._data.message)) {
        errorMessages.value = error.response._data.message;
      } else {
        errorMessages.value = [error.response._data.message];
      }
    } else {
      errorMessages.value = ["خطا در ثبت Super-Admin. لطفاً دوباره تلاش کنید."];
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <!-- ... (Template بدون تغییر، مطمئن شوید تگ‌های v-text-field self-closing هستند) -->
  <v-locale-provider rtl>
    <v-app>
      <v-main class="d-flex align-center justify-center">
        <v-card class="pa-6" width="450" flat>
          <v-card-title class="text-h5 text-center mb-4">
            راه‌اندازی <span class="text-primary">Maizu</span>
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            لطفاً اطلاعات اولین Super-Admin را وارد کنید.
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="submitSetupForm">
              <v-text-field
                v-model="phoneNumber"
                label="شماره تلفن"
                :rules="phoneNumberRules"
                variant="outlined"
                required
                class="mb-4"
                prepend-inner-icon="mdi-phone"
                hint="مثال: 09123456789"
                persistent-hint
              />
              <!-- self-closing tag -->
              <v-text-field
                v-model="firstName"
                label="نام"
                :rules="nameRules"
                variant="outlined"
                required
                class="mb-4"
                prepend-inner-icon="mdi-account"
              />
              <!-- self-closing tag -->
              <v-text-field
                v-model="lastName"
                label="نام خانوادگی"
                :rules="nameRules"
                variant="outlined"
                required
                class="mb-4"
                prepend-inner-icon="mdi-account"
              />
              <!-- self-closing tag -->
              <v-text-field
                v-model="email"
                label="ایمیل"
                :rules="emailRules"
                variant="outlined"
                required
                type="email"
                class="mb-4"
                prepend-inner-icon="mdi-email"
              />
              <!-- self-closing tag -->

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="isLoading"
                size="large"
                class="mt-4"
              >
                ثبت Super-Admin
              </v-btn>
            </v-form>

            <v-alert
              v-if="errorMessages.length > 0"
              type="error"
              class="mt-6"
              density="compact"
            >
              <li v-for="(msg, i) in errorMessages" :key="i">{{ msg }}</li>
            </v-alert>
            <v-alert
              v-if="successMessage"
              type="success"
              class="mt-6"
              density="compact"
              >{{ successMessage }}</v-alert
            >
          </v-card-text>
        </v-card>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
