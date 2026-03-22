import http from "../lib/http";
import type {
  FetchRolesResponse,
  RoleDetailResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  SearchPermissionsResponse,
} from "../types/role";

export const roleService = {
  async fetchRoles(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<FetchRolesResponse> {
    const res = await http.get("/auth/roles", { params });
    return res.data;
  },

  async getRoleDetail(roleId: string): Promise<RoleDetailResponse> {
    const res = await http.get("/auth/roles/detail", {
      params: { role_id: roleId },
    });
    return res.data;
  },

  async createRole(data: CreateRoleRequest): Promise<void> {
    await http.post("/auth/roles", data);
  },

  async updateRole(data: UpdateRoleRequest): Promise<void> {
    const { role_id, ...payload } = data;
    await http.put("/auth/roles", payload, { params: { role_id } });
  },

  async deleteRole(roleId: string): Promise<void> {
    await http.delete("/auth/roles", { params: { role_id: roleId } });
  },

  async searchPermissions(keyword: string): Promise<SearchPermissionsResponse> {
    const res = await http.get("/auth/roles/components/search-permissions", {
      params: { keyword },
    });
    return res.data;
  },

  async getRolePermissionMenu(roleId: string) {
    const res = await http.get("/auth/roles/components/role-permission-menu", {
      params: { role_id: roleId },
    });
    return res.data;
  },

  async bulkUpdatePermissions(data: any) {
    const res = await http.post("/auth/roles/bulk-permissions", data);
    return res.data;
  },
};
