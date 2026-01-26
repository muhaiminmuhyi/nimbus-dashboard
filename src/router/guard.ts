import { useAuthStore } from "../stores/auth";

export function authGuard(to: any) {
  const auth = useAuthStore();

  // ⏳ tunggu bootstrap
  if (auth.accessToken && !auth.ready) {
    return true;
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.permission && !auth.hasPermission(to.meta.permission)) {
    return "/403";
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return "/";
  }

  return true;
}

