export const viewMap: Record<string, () => Promise<any>> = {
  "/dashboard": () => import("../pages/dashboard/index.vue"),
  "/users": () => import("../pages/user/index.vue"),
  "/users/create": () => import("../pages/user/create-user/index.vue"),
  "/users/update/:id": () => import("../pages/user/modify-user/index.vue"),
  "/billing": () => import("../pages/billing/index.vue"),
  "/analytics": () => import("../pages/analytics/index.vue"),
  "/settings": () => import("../pages/setting/index.vue"),
  "/settings/permissions": () => import("../pages/setting/permissions/index.vue"),
  "/settings/roles": () => import("../pages/setting/roles/index.vue"),
  "/settings/api-keys": () => import("../pages/setting/api-keys/index.vue"),
  "/settings/notifications": () => import("../pages/setting/notifications/index.vue"),
  "/audit-logs": () => import("../pages/audit-log/index.vue"),
};