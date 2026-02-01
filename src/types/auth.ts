import type { Menu, User } from './user';

export interface AuthState {
  user: User | null;
  permissions: string[];
  menus: Menu[];
  ready: boolean;
  accessToken: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface BootstrapResponse {
  data: {
    user: User;
    permissions: string[];
    menus: Menu[];
  };
}