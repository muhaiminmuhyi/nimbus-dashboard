import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/dashboard/index.vue'
import Users from '../pages/user/index.vue'
import Billing from '../pages/billing/index.vue'
import Settings from '../pages/setting/index.vue'
import Analytics from '../pages/analytics/index.vue'
import { authGuard } from './guard'
import Authentication from '../pages/authentication/index.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'login',
    component: Authentication,
    meta: { public: true },
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/billing',
    name: 'billing',
    component: Billing,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: Analytics,
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
