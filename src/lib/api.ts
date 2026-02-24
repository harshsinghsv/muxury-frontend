/**
 * Axios API client — pre-configured for the Muxury backend.
 *
 * Features:
 *  - Reads base URL from VITE_API_URL env var (falls back to localhost)
 *  - Attaches Authorization header from localStorage on every request
 *  - Automatic token refresh on 401 (single retry with queuing)
 *  - Redirects to /login on refresh failure
 */

import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token storage helpers ─────────────────────────────────────────────────

const ACCESS_KEY = 'muxury_access_token';
const REFRESH_KEY = 'muxury_refresh_token';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setAccess: (t: string) => localStorage.setItem(ACCESS_KEY, t),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Request interceptor: attach access token ──────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: auto-refresh on 401 ────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            if (originalRequest.headers) {
              (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccess: string = data.data.accessToken;
        tokenStorage.setAccess(newAccess);

        refreshQueue.forEach((cb) => cb(newAccess));
        refreshQueue = [];

        if (originalRequest.headers) {
          (originalRequest.headers as any)['Authorization'] = `Bearer ${newAccess}`;
        }
        return api(originalRequest);
      } catch {
        tokenStorage.clear();
        refreshQueue = [];
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
