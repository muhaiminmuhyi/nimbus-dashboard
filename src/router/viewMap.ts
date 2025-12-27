export const viewMap: Record<string, () => Promise<any>> = {
  "/dashboard": () => import("../pages/dashboard/index.vue"),
  "/users": () => import("../pages/user/index.vue"),
  "/audit-logs": () => import("../pages/audit-log/index.vue"),
};