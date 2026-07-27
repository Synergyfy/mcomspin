import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token-store';
import { isMockEnabled, handleMockRequest, getMockToken } from './mock-data';

const MOCK = typeof window !== 'undefined' && isMockEnabled();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

if (MOCK) {
  api.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    const method = (config.method || 'get').toUpperCase();
    const mockResponse = handleMockRequest(method, url, config.data);

    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
    };
  };
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = getRefreshToken();
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          token ? { refreshToken: token } : {},
          { withCredentials: true },
        );
        const newToken = data.data?.accessToken ?? data.accessToken;
        const newRefresh = data.data?.refreshToken ?? data.refreshToken;

        if (newToken) setTokens(newToken, newRefresh);

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          const publicPaths = ['/', '/auth', '/acquire', '/play'];
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export async function initAuth(): Promise<boolean> {
  if (MOCK) {
    setTokens(getMockToken(), 'mock-refresh-token');
    return true;
  }
  try {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = data.data?.accessToken ?? data.accessToken;
    const newRefresh = data.data?.refreshToken ?? data.refreshToken;
    if (newToken) {
      setTokens(newToken, newRefresh);
      return true;
    }
  } catch {
    // No valid session exists
  }
  return false;
}

export default api;
