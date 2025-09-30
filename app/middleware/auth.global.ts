import { ofetch } from 'ofetch';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // <--- این بخش برای همگام‌سازی وضعیت احراز هویت با Back-end است ---
  // این متد را فقط در سمت کلاینت فراخوانی می‌کنیم تا از مشکلات SSR با کوکی‌ها جلوگیری شود
  // در حالت SSR، Nuxt خودش کوکی‌ها را برای اولین درخواست از Back-end ارسال می‌کند.
  // اما برای اطمینان از صحت وضعیت در Front-end پس از hydration، آن را در کلاینت چک می‌کنیم.
  if (import.meta.client && !authStore.isAuthenticated && !authStore.isLoading) {
    await authStore.fetchUser();
  }
  // <--- پایان بخش همگام‌سازی ---

  // <--- منطق ریدایرکت برای Super-Admin (Middleware setup.global.ts اصلی) ---
  // اگر Super-Admin وجود ندارد، به /setup هدایت شود
  // اگر Super-Admin وجود دارد و کاربر به /setup می‌رود، به / هدایت شود
  // این منطق قبلاً در setup.global.ts بود، اما چون نام آن را auth.global.ts گذاشتیم
  // و authStore را اینجا داریم، می‌توانیم آن را اینجا پیاده‌سازی کنیم.
  // فعلا فرض می‌کنیم که Middleware قبلی (setup.global.ts) حذف شده و منطق آن را اینجا بازسازی می‌کنیم
  const isSetupRoute = to.path === "/setup";
  const isLoginRoute = to.path === "/login";

  try {
    const superAdminStatus = await ofetch<{ exists: boolean }>(
      "http://localhost:3001/auth/super-admin-status",
      { credentials: "include" } // برای ارسال کوکی‌های سشن
    );

    if (superAdminStatus.exists) {
      // Super-Admin وجود دارد
      if (isSetupRoute) {
        // اگر کاربر در حال تلاش برای دسترسی به /setup است، به صفحه اصلی هدایت شود
        return navigateTo("/");
      }
      // اگر کاربر احراز هویت نشده و در صفحه لاگین نیست، اجازه ورود دهد (یا به لاگین هدایت کند)
      if (!authStore.isAuthenticated && !isLoginRoute) {
        // می‌توانید اینجا تصمیم بگیرید که کاربر بدون احراز هویت به چه صفحاتی دسترسی دارد.
        // فعلا اجازه می‌دهیم به صفحات عمومی برود.
      }
    } else {
      // Super-Admin وجود ندارد
      if (!isSetupRoute) {
        // اگر کاربر در صفحه دیگری غیر از /setup است، به /setup هدایت شود
        return navigateTo("/setup");
      }
      // اگر کاربر در حال حاضر در /setup است، اجازه دهد بماند
    }
  } catch (error: any) {
    console.error("Error fetching super-admin status in middleware:", error);
    // اگر خطا در برقراری ارتباط با Back-end رخ داد، به /setup هدایت شود
    // و در آنجا پیام خطای مربوط به عدم اتصال به سرور نمایش داده شود (در setup.vue)
    if (!isSetupRoute) {
      return navigateTo("/setup");
    }
  }

  // <--- منطق محافظت از مسیرها (اختیاری) ---
  // مثال: اگر کاربر احراز هویت نشده و می‌خواهد به یک صفحه محافظت شده برود، به /login هدایت شود.
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   return navigateTo('/login');
  // }

  // مثال: اگر کاربر احراز هویت شده و می‌خواهد به /login یا /register برود، به صفحه اصلی هدایت شود.
  if (authStore.isAuthenticated && isLoginRoute) {
    return navigateTo("/");
  }
});
