import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/dashboard/index.vue'
import { authGuard } from './guard'
import Authentication from '../pages/authentication/index.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Authentication,
    meta: { public: true },
  },
  {
  path: "/403",
  component: () => import("../pages/errors/Forbidden403.vue"),
  meta: { public: true },
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authGuard)

export default router
