<script setup lang="ts">
import { ref } from 'vue';
import { ofetch } from 'ofetch';
import { useRouter } from 'vue-router';

// مشخص کردن Layout برای این صفحه. false به معنای عدم استفاده از Layoutهای پروژه است.
// این صفحه خودش کامپوننت ریشه Vuetify (v-app) را ارائه می‌دهد.
definePageMeta({
  layout: "empty",
});

const router = useRouter(); // برای هدایت کاربر پس از موفقیت

// وضعیت فرم
const phoneNumber = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');

// وضعیت UI (بارگذاری، خطا، موفقیت)
const isLoading = ref(false);
const errorMessages = ref<string[]>([]); // برای نمایش چندین پیام خطا
const successMessage = ref<string | null>(null);

// قوانین اعتبارسنجی ساده برای Vue (اعتبارسنجی اصلی در Back-end انجام می‌شود)
const phoneNumberRules = [
  (v: string) => !!v || 'شماره تلفن الزامی است.',
  (v: string) => /^09\d{9}$/.test(v) || 'فرمت شماره تلفن نامعتبر است (مثال: 09123456789).',
];
const nameRules = [
  (v: string) => !!v || 'این فیلد الزامی است.',
];
const emailRules = [
  (v: string) => !!v || 'ایمیل الزامی است.',
  (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'فرمت ایمیل نامعتبر است.',
];

// متد ارسال فرم
async function submitSetupForm() {
  isLoading.value = true;
  errorMessages.value = []; // پاک کردن خطاهای قبلی
  successMessage.value = null;

  try {
    const response = await ofetch('http://localhost:3001/auth/setup-super-admin', {
      method: 'POST',
      body: {
        phoneNumber: phoneNumber.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      },
    });

    successMessage.value = response.message || 'Super-Admin با موفقیت ثبت شد.';
    // پس از ثبت موفقیت‌آمیز، به صفحه اصلی هدایت می‌شویم
    setTimeout(() => {
      router.push('/');
    }, 2000); // 2 ثانیه تأخیر برای نمایش پیام موفقیت
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error setting up Super-Admin:', error);
    // مدیریت خطاهای دریافتی از Back-end
    if (error.response && error.response._data && error.response._data.message) {
      if (Array.isArray(error.response._data.message)) {
        errorMessages.value = error.response._data.message; // اگر چند پیام خطا از class-validator بود
      } else {
        errorMessages.value = [error.response._data.message];
      }
    } else {
      errorMessages.value = ['خطا در ثبت Super-Admin. لطفاً دوباره تلاش کنید.'];
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <!-- v-app به عنوان کامپوننت ریشه Vuetify در این صفحه مستقل -->
  <v-locale-provider rtl>
    <v-app class="bg-grey-lighten-3">
      <v-main dir="rtl" class="d-flex align-center justify-center">
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
              v-model="phoneNumber" label="شماره تلفن" :rules="phoneNumberRules" variant="outlined"
                required class="mb-4" prepend-inner-icon="mdi-phone" hint="مثال: 09123456789" persistent-hint />
              <v-text-field 
              v-model="firstName" label="نام" :rules="nameRules" variant="outlined" required class="mb-4"
                prepend-inner-icon="mdi-account" />
              <v-text-field 
              v-model="lastName" label="نام خانوادگی" :rules="nameRules" variant="outlined" required
                class="mb-4" prepend-inner-icon="mdi-account" />
              <v-text-field 
              v-model="email" label="ایمیل" :rules="emailRules" variant="outlined" required type="email"
                class="mb-4" prepend-inner-icon="mdi-email" />

              <v-btn 
              type="submit" color="primary" block :loading="isLoading" :disabled="isLoading" size="large"
                class="mt-4 font-['Vazirmatn']">
                ثبت Super-Admin
              </v-btn>
            </v-form>

            <!-- نمایش پیام‌های خطا -->
            <v-alert v-if="errorMessages.length > 0" type="error" class="mt-6" density="compact">
              <li v-for="(msg, i) in errorMessages" :key="i">{{ msg }}</li>
            </v-alert>
            <!-- نمایش پیام موفقیت -->
            <v-alert v-if="successMessage" type="success" class="mt-6" density="compact">{{ successMessage }}</v-alert>
          </v-card-text>
        </v-card>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<style scoped>
/* می‌توانید استایل‌های سفارشی برای این صفحه اضافه کنید */
</style>