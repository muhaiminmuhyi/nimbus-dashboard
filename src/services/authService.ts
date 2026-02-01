import http from '../lib/http';
import type { BootstrapResponse, LoginRequest, LoginResponse } from '../types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await http.post('/auth/login', data);
    return res.data.data;
  },

  async bootstrap(): Promise<BootstrapResponse> {
    const res = await http.get('/auth/me');
    return res.data;
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const res = await http.post('/auth/refresh', { refresh_token: refreshToken });
    return res.data.data;
  },
};