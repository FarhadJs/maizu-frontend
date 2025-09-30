/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import { ofetch } from "ofetch";

interface User {
  id: string;
  phoneNumber: string;
  role: string;
  isProfileCompleted: boolean;
  firstName?: string; // اضافه کردن فیلدهای پروفایل
  lastName?: string;
  email?: string;
  // ... سایر ویژگی‌های کاربر
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),
  getters: {
    isAdmin: (state) =>
      state.user?.role === "admin" || state.user?.role === "super_admin",
    isSuperAdmin: (state) => state.user?.role === "super_admin",
    isCustomer: (state) => state.user?.role === "customer",
  },
  actions: {
    // این متد وضعیت کاربر فعلی را از Back-end دریافت می‌کند
    async fetchUser() {
      this.isLoading = true;
      this.error = null;
      try {
        const user = await ofetch<User>("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include", // برای ارسال کوکی‌های سشن
        });
        this.user = user;
        this.isAuthenticated = true;
        return user;
      } catch (e: any) {
        this.user = null;
        this.isAuthenticated = false;
        // اگر خطا 401 یا 403 باشد (عدم احراز هویت)، آن را به عنوان یک خطای لاگین معمولی در نظر می‌گیریم
        if (e.response?.status !== 401 && e.response?.status !== 403) {
          console.error("Error fetching user session:", e);
          this.error = "Failed to fetch user session.";
        }
      } finally {
        this.isLoading = false;
      }
    },

    // برای لاگین کردن کاربر در Front-end (پس از تأیید در Back-end)
    async login(userData: User) {
      this.user = userData;
      this.isAuthenticated = true;
      this.error = null;
    },

    // برای خروج کاربر
    async logout() {
      this.isLoading = true;
      this.error = null;
      try {
        await ofetch("http://localhost:3001/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        this.user = null;
        this.isAuthenticated = false;
        return true;
      } catch (e: any) {
        console.error("Error logging out:", e);
        this.error = "Failed to logout.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // متدی برای مقداردهی اولیه وضعیت احراز هویت در زمان بارگذاری صفحه
    async initializeAuth() {
      if (!this.isAuthenticated && !this.isLoading) {
        await this.fetchUser();
      }
    },
  },
});
