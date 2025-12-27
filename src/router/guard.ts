import { useAuthStore } from "../stores/auth";

export async function authGuard(to, from, next) {
  const auth = useAuthStore();

  if (to.meta.public) return next();

  try {
    if (!auth.ready) {
      await auth.bootstrap();
    }
  } catch {
    return next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  
  if (to.meta.permission && !auth.permissions.includes(to.meta.permission)) {
    return next("/403");
  }

  return next();
}

