import { createApp } from 'vue'
import './assets/main.css'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import "./lib/interceptor"
import { useAuthStore } from './stores/auth'
import { registerDynamicRoutes } from './router/dynamic'
import { setupGlobalErrorHandler } from './lib/errorHandler'
import { Toaster } from 'vue-sonner'
import "vue-sonner/style.css";

const app = createApp(App).component("Toaster", Toaster);
const pinia = createPinia();

app.use(pinia);

// Setup global error handling
setupGlobalErrorHandler(app);

// Load cached menus and register routes before app.use(router)
const cachedMenus = localStorage.getItem('menus');
if (cachedMenus) {
  const menus = JSON.parse(cachedMenus);
  registerDynamicRoutes(router, menus);
}

app.use(router);

async function bootstrap() {
  const auth = useAuthStore();

  if (auth.accessToken) {
    await auth.bootstrap();

    // Re-register routes with fresh menus if different
    const freshMenus = auth.menus;
    const cachedMenus = localStorage.getItem('menus');

    if (JSON.stringify(freshMenus) !== cachedMenus) {
      // Clear existing dynamic routes and re-register
      // Note: Vue Router doesn't have a built-in way to remove routes,
      // but re-adding should work for our use case
      registerDynamicRoutes(router, freshMenus);
      localStorage.setItem('menus', JSON.stringify(freshMenus));
    }

    // Wait for router to be ready before resolving routes
    await router.isReady();

    // Try to stay on current route, but fallback gracefully
    const currentPath = router.currentRoute.value.fullPath;
    const resolved = router.resolve(currentPath);

    if (resolved.matched.length > 0 && currentPath !== '/') {
      // Stay on current route if it exists
      await router.replace(currentPath);
    } else {
      // Fallback to dashboard
      await router.replace('/');
    }
  } else {
    await router.isReady();
  }
}

app.mount("#app");

bootstrap();