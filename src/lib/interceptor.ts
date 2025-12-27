import http from "./http";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./token";

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
        const res = await http.post("/auth/refresh", {
          refresh_token: getRefreshToken(),
        });

        setTokens(res.data.access_token, res.data.refresh_token);
        processQueue(res.data.access_token);

        original.headers.Authorization = `Bearer ${res.data.access_token}`;
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
