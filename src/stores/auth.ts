import { defineStore } from "pinia";
import http from "../lib/http";
import { setTokens, clearTokens, getAccessToken } from "../lib/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    permissions: [] as string[],
    menus: [] as any[],
    ready: false,
    accessToken: getAccessToken(),
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await http.post("/auth/login", { email, password });
      this.accessToken = res.data.data.access_token;
      await setTokens(res.data.data.access_token, res.data.data.refresh_token);
    },

    async bootstrap() {
      try {
        const res = await http.get("/auth/me");
        this.user = res.data.data.user;
        this.permissions = res.data.data.permissions;
        this.menus = res.data.data.menus;
        // Cache menus in localStorage
        localStorage.setItem('menus', JSON.stringify(this.menus));
      } catch (error) {
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
