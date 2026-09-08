<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from "vue";
import { ofetch } from "ofetch";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "empty",
});

const router = useRouter();

const currentStep = ref(1);
const phoneNumber = ref("");
const otpCode = ref("");

const isLoading = ref(false);
const errorMessages = ref<string[]>([]);
const successMessage = ref<string | null>(null);
const status_message = ref<"success" | "info" | "error" | "warning" | undefined>(
  "success"
);

const phoneNumberRules = [
  (v: string) => !!v || "شماره تلفن الزامی است.",
  (v: string) =>
    /^09\d{9}$/.test(v) || "فرمت شماره تلفن نامعتبر است (مثال: 09123456789).",
];
const otpRules = [
  (v: string) => !!v || "کد تأیید الزامی است.",
  (v: string) => /^\d{5}$/.test(v) || "کد تأیید باید 5 رقمی باشد.",
];

async function requestOtp() {
  isLoading.value = true;
  errorMessages.value = [];
  successMessage.value = null;

  try {
    await ofetch("/api/auth/request-otp", {
      method: "POST",
      body: { phoneNumber: phoneNumber.value },
    });
    successMessage.value = "کد تأیید برای شما ارسال شد.";
    status_message.value = "info";
    currentStep.value = 2;
  } catch (error: any) {
    console.error("Error requesting OTP:", error);
    if (error.response && error.response._data && error.response._data.message) {
      errorMessages.value = Array.isArray(error.response._data.message)
        ? error.response._data.message
        : [error.response._data.message];
    } else {
      errorMessages.value = ["خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید."];
    }
  } finally {
    isLoading.value = false;
  }
}

async function verifyOtp() {
  isLoading.value = true;
  errorMessages.value = [];
  successMessage.value = null;

  try {
    const response = await ofetch("/api/auth/verify-otp", {
      method: "POST",
      body: {
        phoneNumber: phoneNumber.value,
        otpCode: otpCode.value,
      },
      credentials: "include",
    });
    status_message.value = "success";
    successMessage.value = response.message || "ورود موفقیت‌آمیز.";

    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    if (error.response && error.response._data && error.response._data.message) {
      errorMessages.value = Array.isArray(error.response._data.message)
        ? error.response._data.message
        : [error.response._data.message];
    } else {
      errorMessages.value = ["خطا در تأیید کد یا ورود به سیستم. لطفاً دوباره تلاش کنید."];
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center mx-4">
      <v-card class="pa-6 border drop-shadow-lg" width="450" flat>
        <v-card-title class="text-h5 text-center mb-4">
          <NuxtLink to="/" class="text-primary">Maizu</NuxtLink>
          <p>ورود / ثبت‌نام</p>
        </v-card-title>
        <v-card-text>
          <v-form v-if="currentStep === 1" @submit.prevent="requestOtp">
            <p class="mb-4 text-center">
              برای ورود یا ثبت‌نام، شماره تلفن خود را وارد کنید.
            </p>
            <v-text-field
              v-model="phoneNumber"
              label="شماره تلفن"
              :rules="phoneNumberRules"
              variant="outlined"
              required
              class="mb-4"
              prepend-inner-icon="mdi-phone"
              persistent-hint
            />
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="isLoading"
              :disabled="isLoading"
              size="large"
              class="mt-4"
            >
              درخواست کد تأیید
            </v-btn>
          </v-form>

          <v-form v-else-if="currentStep === 2" @submit.prevent="verifyOtp">
            <p class="mb-4 text-center">
              کد تأیید 5 رقمی ارسال شده به {{ phoneNumber }} را وارد کنید.
            </p>
            <v-otp-input
              v-model="otpCode"
              :rules="otpRules"
              :length="5"
              variant="solo-filled"
              class="mb-4"
              @keydown.enter="verifyOtp"
            />
            <v-alert
              v-if="otpCode.length > 0 && otpCode.length !== 5"
              type="warning"
              density="compact"
              class="mb-4"
            >
              کد تأیید باید 5 رقمی باشد.
            </v-alert>
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="isLoading"
              :disabled="isLoading || otpCode.length !== 5"
              size="large"
              class="mt-4"
            >
              تأیید و ورود
            </v-btn>
            <v-btn
              variant="text"
              block
              class="mt-2"
              :disabled="isLoading"
              @click="
                currentStep = 1;
                otpCode = '';
                successMessage = null;
                errorMessages = [];
              "
            >
              ویرایش شماره تلفن
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
            dir="rtl"
            :type="status_message"
            class="mt-6"
            density="compact"
            >{{ successMessage }}</v-alert
          >
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>
