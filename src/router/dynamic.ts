import type { Router } from "vue-router";
import { viewMap } from "./viewMap";

function addRoutesRecursively(router: Router, menus: any[]) {
  menus.forEach((menu) => {
    const component = viewMap[menu.route];
    if (typeof menu.children != "undefined" && menu.children.length > 0) {
      if (component) {
        // Add parent route
        router.addRoute({
          path: menu.route,
          name: menu.route,
          component,
          meta: {
            permission: menu.permission,
          },
        });

        // Add children
        menu.children.forEach((child: any) => {
          const childComponent = viewMap[child.route];
          if (!childComponent) return;

          const childName = child.route.replaceAll("/", "_");

          // Only nest if it's a settings route (tabbed layout)
          // This avoids breaking other modules where children should be top-level
          if (menu.route.startsWith("/settings")) {
            router.addRoute(menu.route, {
              path: child.route,
              name: childName,
              component: childComponent,
              meta: {
                permission: child.permission,
              },
            });
          } else {
            const childPath = "/" + child.route.replace("/", "");
            router.addRoute({
              path: childPath,
              name: childName,
              component: childComponent,
              meta: {
                permission: child.permission,
              },
            });
          }
        });
      } else {
        // Parent has no component, add children as top-level
        menu.children.forEach((child: any) => {
          const childComponent = viewMap[child.route];
          if (!childComponent) return;

          const childPath = "/" + child.route.replace("/", "");
          const childName = child.route.replaceAll("/", "_");

          router.addRoute({
            path: childPath,
            name: childName,
            component: childComponent,
            meta: {
              permission: child.permission,
            },
          });
        });
      }
    } else {
      // No children, add as top-level
      if (menu.route && component) {
        router.addRoute({
          path: menu.route,
          name: menu.route,
          component,
          meta: {
            permission: menu.permission,
          },
        });
      }
    }
  });
}

export function registerDynamicRoutes(router: Router, menus: any[]) {
  addRoutesRecursively(router, menus);
}
