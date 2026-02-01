import { createApp } from 'vue'
import './assets/main.css'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import "./lib/interceptor"
import { useAuthStore } from './stores/auth'
import { registerDynamicRoutes } from './router/dynamic'
import { setupGlobalErrorHandler } from './lib/errorHandler'

const app = createApp(App);
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
    if (JSON.stringify(freshMenus) !== cachedMenus) {
      // For simplicity, re-register (Vue Router handles duplicates)
      registerDynamicRoutes(router, freshMenus);
    }

    const resolved = router.resolve(router.currentRoute.value.fullPath);
    if (resolved.matched.length > 0) {
      await router.replace(router.currentRoute.value.fullPath);
    } else {
      await router.replace('/');
    }
  }

  await router.isReady();
  app.mount("#app");
}

bootstrap();