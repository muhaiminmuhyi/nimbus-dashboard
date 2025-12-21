import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/Dashboard.vue'
import Users from '../pages/Users.vue'
import Billing from '../pages/Billing.vue'
import Settings from '../pages/Settings.vue'
import Analytics from '../pages/Analytics.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
