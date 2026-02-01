import http from '../lib/http';
import type { User } from '../types/user';
import type { CreateUserRequest } from '../types/createUser';

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

export const userService = {
  async fetchUsers(params: { page: number; limit: number }): Promise<FetchUsersResponse> {
    const res = await http.get('/auth/users', { params });
    return res.data;
  },

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const res = await http.post('/auth/users', data);
    return res.data;
  },
};