import { ofetch } from "ofetch";

export default defineNuxtRouteMiddleware(async (to) => {
  // اگر کاربر در حال حاضر در حال ورود یا ثبت نام است، نیازی به چک کردن Super-Admin نیست
  // می توانید مسیرهای لاگین/ثبت نام را در اینجا مستثنی کنید اگر قصد دارید صفحه ورود مجزا داشته باشید.
  // مثلا: if (to.path === "/login" || to.path === "/register") return;

  const isSetupRoute = to.path === "/setup";

  try {
    const response = await ofetch<{ exists: boolean }>(
      "http://localhost:3001/auth/super-admin-status"
    );

    if (response.exists) {
      // Super-Admin وجود دارد
      if (isSetupRoute) {
        // اگر کاربر در حال تلاش برای دسترسی به /setup است، به صفحه اصلی هدایت شود
        return navigateTo("/");
      }
    } else {
      // Super-Admin وجود ندارد
      if (!isSetupRoute) {
        // اگر کاربر در صفحه دیگری غیر از /setup است، به /setup هدایت شود
        return navigateTo("/setup");
      }
      // اگر کاربر در حال حاضر در /setup است، اجازه دهد بماند
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching super-admin status in middleware:", error);
    // در اینجا، اگر Back-end در دسترس نیست یا خطای شبکه داریم، باید کاربر را به /setup هدایت کنیم
    // و در آنجا پیام خطای مناسب نمایش دهیم (که به دلیل عدم وجود Super-Admin نیست بلکه خطای سرور است).
    if (!isSetupRoute) {
      return navigateTo("/setup");
    }
    // اگر در خود /setup خطا خوردیم، اجازه می‌دهیم صفحه لود شود تا error messages نمایش داده شوند.
  }
});
