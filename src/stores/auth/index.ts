import { defineStore } from "pinia";
import { clearTokens, getAccessToken, setTokens } from "../../lib/token";
import { authService } from "../../services/authService";
import type { AuthState, BootstrapResponse, LoginRequest } from "../../types/auth";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    permissions: [],
    menus: [],
    ready: false,
    accessToken: getAccessToken(),
  }),

  actions: {
    async login(data: LoginRequest) {
      const response = await authService.login(data);
      this.accessToken = response.access_token;
      await setTokens(response.access_token, response.refresh_token);
    },

    async bootstrap() {
      try {
        const response: BootstrapResponse = await authService.bootstrap();
        this.user = response.data.user;
        this.permissions = response.data.permissions;
        this.menus = response.data.menus;
        // Cache menus in localStorage
        localStorage.setItem('menus', JSON.stringify(this.menus));
      } catch {
        // On error, try to load from cache
        const cachedMenus = localStorage.getItem('menus');
        if (cachedMenus) {
          this.menus = JSON.parse(cachedMenus);
        }
      } finally {
        this.ready = true;
      }
    },

    logout() {
      clearTokens();
      this.$reset();
      window.location.href = "/login";
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    hasPermission: (state) => {
      return (permission?: string) => {
        if (!permission) return true; // route tanpa permission → allowed
        return state.permissions.includes(permission);
      };
    },
  }
});