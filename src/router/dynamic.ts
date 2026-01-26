import type { Router } from "vue-router";
import { viewMap } from "./viewMap";

function addRoutesRecursively(router: Router, menus: any[]) {
  menus.forEach((menu) => {
    const component = viewMap[menu.route];
    
    if (typeof menu.children != "undefined" && menu.children.length > 0) {
      // Add parent route
      if (component) {
        router.addRoute({
          path: menu.route,
          name: menu.route,
          component,
          meta: {
            permission: menu.permission,
          },
        });
      }

      // Add children as top-level routes with full path
      menu.children.forEach((child: any) => {
        const childComponent = viewMap[child.route];
        if (!childComponent) return;
        
        const childPath = menu.route + "/" + child.route.replace("/", "");
        const childName = child.route.replaceAll("/", "_");
        console.log(childComponent, childPath, childName, child.route);

        router.addRoute({
          path: childPath,
          name: childName,
          component: childComponent,
          meta: {
            permission: child.permission,
          },
        });
      });
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
