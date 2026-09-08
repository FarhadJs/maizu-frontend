/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/setup") {
    return navigateTo("/");
  }

  const authStore = useAuthStore();

  if (
    import.meta.client &&
    !authStore.isAuthenticated &&
    !authStore.isLoading
  ) {
    await authStore.fetchUser();
  }

  const isLoginRoute = to.path === "/login";

  if (authStore.isAuthenticated && isLoginRoute) {
    return navigateTo("/");
  }
});
