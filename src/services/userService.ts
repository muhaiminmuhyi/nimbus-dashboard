import http from '../lib/http';
import type { User } from '../types/user';
import type { ModifyUserForm, StoreUserData } from '../types/createUser';

export interface FetchUsersResponse {
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateUserResponse {
  data: {
    id: number;
    message: string;
  };
}

export interface UserDetailResponse {
  data: User;
}

export interface SearchRolesResponse {
  data: {
    id: string;
    name: string;
    description: string;
  }[];
}

export const userService = {
  async fetchUsers(params: { page: number; limit: number }): Promise<FetchUsersResponse> {
    const res = await http.get('/auth/users', { params });
    return res.data;
  },

  async getUserDetail(userId: string): Promise<UserDetailResponse> {
    const res = await http.get('/auth/users/detail', { params: { user_id: userId } });
    return res.data;
  },

  async updateUser(userId: string, data: ModifyUserForm): Promise<CreateUserResponse> {
    const res = await http.put(`/auth/users?user_id=${userId}`, data);
    return res.data;
  },

  async createUser(data: StoreUserData): Promise<CreateUserResponse> {
    const res = await http.post('/auth/users', data);
    return res.data;
  },

  async searchRoles(keyword: string): Promise<SearchRolesResponse> {
    const res = await http.get('/auth/users/components/search-roles', { params: { keyword } });
    return res.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await http.delete(`/auth/users?user_id=${userId}`);
  },
};