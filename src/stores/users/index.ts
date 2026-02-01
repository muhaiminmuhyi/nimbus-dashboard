import { defineStore } from "pinia";
import { userService } from "../../services/userService";
import { config } from "../../config";
import type { User } from "../../types/user";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    loading: true,
    error: null as string | null,
    page: 1,
    totalPages: 1,
  }),

  actions: {
    async fetchUsers() {
      try {
        const response = await userService.fetchUsers({
          page: this.page,
          limit: config.DEFAULT_PAGE_SIZE,
        });
        this.users = response.data.users;
        this.totalPages = Math.ceil(response.data.total / response.data.limit);
      } catch {
        this.error = "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: string) {
      await userService.deleteUser(userId);
      // Remove user from local state
      this.users = this.users.filter(user => user.id !== userId);
      return { success: true };
    },
  },
});