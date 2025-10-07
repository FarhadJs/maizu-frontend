import type { User } from "../types/User.type";
import { ofetch } from "ofetch";

export default defineNuxtRouteMiddleware(async (to) => {
  // Shared state برای جلوگیری از flash در hydration (SSR/CSR consistency)
  const authUser = useState<User | null>("auth_user", () => null);

  try {
    // API call to check user authorization (sends cookies automatically for session)
    const userInfo: User = await ofetch("/api/auth/me", {
      credentials: "include",
    });
    console.log(userInfo);

    if (userInfo && userInfo.id) {
      authUser.value = userInfo;
      return;
    }
  } catch (error) {
    // If 401 Unauthorized, API error, or no user data - clear state
    authUser.value = null;
    console.error("Auth check failed:", error);
  }

  if (import.meta.client) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
