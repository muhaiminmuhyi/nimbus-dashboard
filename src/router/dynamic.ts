import type { Router } from "vue-router";
import { viewMap } from "./viewMap";

export function registerDynamicRoutes(
  router: Router,
  menus: any[]
) {
  menus.forEach((menu) => {
    if (!menu.route) return;

    router.addRoute({
      path: menu.route,
      name: menu.route,
      component: () => viewMap[menu.route],
      meta: {
        permission: menu.permission,
      },
    });
  });
}
