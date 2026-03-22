export interface Role {
  id: string;
  name: string;
  description: string;
  permission_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDetail extends Role {
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface FetchRolesResponse {
  data: {
    roles: Role[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface RoleDetailResponse {
  data: RoleDetail;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions_id: string[];
}

export interface UpdateRoleRequest extends CreateRoleRequest {
  role_id: string;
}

export interface SearchPermissionsResponse {
  data: Permission[];
}
