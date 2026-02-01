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

// Parse validation error messages into user-friendly format
function parseValidationError(message: string): string {
  // Handle the specific format: "Invalid request body: Key: 'DeleteUserRequest.UserID' Error:Field validation for 'UserID' failed on the 'required' tag"
  const validationRegex = /Key: '[^.]+\.([^']+)' Error:Field validation for '[^']+' failed on the '([^']+)' tag/;
  const match = message.match(validationRegex);

  if (match && match[1] && match[2]) {
    const fieldName = match[1];
    const errorType = match[2];

    // Convert field names to more readable format
    const readableField = fieldName.replace(/ID$/, '').replace(/([A-Z])/g, ' $1').trim();

    // Convert error types to user-friendly messages
    switch (errorType) {
      case 'required':
        return `${readableField} is required`;
      case 'email':
        return `${readableField} must be a valid email address`;
      case 'min':
        return `${readableField} is too short`;
      case 'max':
        return `${readableField} is too long`;
      default:
        return `${readableField} is invalid`;
    }
  }

  // If we can't parse it, return the original message
  return message;
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

    // Handle 400 validation errors
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message;
      if (errorMessage && typeof errorMessage === 'string') {
        // Parse validation error messages
        const parsedMessage = parseValidationError(errorMessage);
        error.userFriendlyMessage = parsedMessage;
      }
    }

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
