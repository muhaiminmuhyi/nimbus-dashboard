import { defineStore } from "pinia";
import { roleService } from "../../services/roleService";
import { config } from "../../config";
import type { Role } from "../../types/role";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    roles: [] as Role[],
    loading: false,
    error: null as string | null,
    page: 1,
    totalPages: 1,
    total: 0,
  }),

  actions: {
    async fetchRoles(search?: string) {
      this.loading = true;
      try {
        const response = await roleService.fetchRoles({
          page: this.page,
          limit: config.DEFAULT_PAGE_SIZE,
          search,
        });
        this.roles = response.data.roles;
        this.total = response.data.total;
        this.totalPages = Math.ceil(response.data.total / response.data.limit);
      } catch (err: any) {
        this.error = err?.userFriendlyMessage || "Failed to fetch roles.";
      } finally {
        this.loading = false;
      }
    },

    async deleteRole(roleId: string) {
      try {
        await roleService.deleteRole(roleId);
        this.roles = this.roles.filter(role => role.id !== roleId);
        this.total--;
        return { success: true };
      } catch (err: any) {
        return { success: false, message: err?.userFriendlyMessage || "Failed to delete role." };
      }
    },

    setPage(page: number) {
      this.page = page;
    }
  },
});
