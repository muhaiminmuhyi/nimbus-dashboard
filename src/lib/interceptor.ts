import http from "./http";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token";
import { authService } from "../services/authService";

let isRefreshing = false;
let queue: any[] = [];

function processQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(http(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await authService.refreshToken(getRefreshToken()!);

        setTokens(response.access_token, response.refresh_token);
        processQueue(response.access_token);

        original.headers.Authorization = `Bearer ${response.access_token}`;
        return http(original);
      } catch {
        clearTokens();
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
