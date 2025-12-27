import { defineStore } from "pinia";
import http from "../lib/http";
import router from "../router";
import { setTokens, clearTokens } from "../lib/token";
import { registerDynamicRoutes } from "../router/dynamic";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    permissions: [] as string[],
    menus: [] as any[],
    ready: false,
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await http.post("/auth/login", { email, password });
      setTokens(res.data.access_token, res.data.refresh_token);
    },

    async bootstrap() {
      const res = await http.get("/me");
      this.user = res.data.user;
      this.permissions = res.data.permissions;
      this.menus = res.data.menus;

      registerDynamicRoutes(router, this.menus);

      this.ready = true;
    },

    logout() {
      clearTokens();
      this.$reset();
      window.location.href = "/login";
    },
  },
});
