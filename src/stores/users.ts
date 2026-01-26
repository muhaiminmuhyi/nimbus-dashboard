import { defineStore } from "pinia";
import http from "../lib/http";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as any[],
    loading: true,
    error: null as string | null,
    page: 1,
    totalPages: 1,
  }),

  actions: {
    async fetchUsers() {
      try {
        const res = await http.get("/auth/users", {
          params: {
            page: this.page,
            limit: 10,
          }
        });
        this.users = res.data.data.users;
        this.totalPages = Math.ceil(res.data.data.total / res.data.data.limit);
        this.page = res.data.data.page;
      } catch (error) {
        this.error = "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },
  },
});