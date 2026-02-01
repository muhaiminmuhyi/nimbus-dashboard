// Environment variables with defaults
export const config = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Nimbus Dashboard',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Timeouts
  API_TIMEOUT: 15000,

  // Cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes

  // Local storage keys
  STORAGE_KEYS: {
    THEME: 'theme',
    MENUS: 'menus',
  },

  // User roles
  USER_ROLES: {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User',
  } as const,
} as const;

// Type-safe access
export type Config = typeof config;