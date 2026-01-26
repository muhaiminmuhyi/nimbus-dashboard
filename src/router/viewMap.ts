export const viewMap: Record<string, () => Promise<any>> = {
  "/dashboard": () => import("../pages/dashboard/index.vue"),
  "/users": () => import("../pages/user/index.vue"),
  "/create": () => import("../pages/user/create-user/index.vue"),
  "/billing": () => import("../pages/billing/index.vue"),
  "/analytics": () => import("../pages/analytics/index.vue"),
  "/settings": () => import("../pages/setting/index.vue"),
  "/audit-logs": () => import("../pages/audit-log/index.vue"),
};