import { useAuthStore } from "../../stores/auth";

export function useCan() {
  const auth = useAuthStore();

  const can = (permission?: string) => {
    if (!permission) return true;
    return auth.permissions.includes(permission);
  };

  return { can };
}
