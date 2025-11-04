import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenService } from '../auth/tokenService';
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies
});

// attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenService.getToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (err?: any) => void; config: InternalAxiosRequestConfig }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token && p.config.headers) p.config.headers['Authorization'] = `Bearer ${token}`;
      p.resolve(p.config);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = (originalRequest && originalRequest.url) || '';

    // Do NOT attempt refresh for auth endpoints to avoid deadlocks
    if (url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/user/register')) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        }).then((cfg) => api(cfg as InternalAxiosRequestConfig));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const resp = await api.post('/auth/refresh');
        const newAccess = resp.data?.accessToken;
        tokenService.setToken(newAccess);
        processQueue(null, newAccess);
        isRefreshing = false;
        if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        isRefreshing = false;
        // Clear access token from memory and broadcast logout to other tabs
        tokenService.setToken(null);
        try {
          localStorage.setItem('auth_event', `logout:${Date.now()}`);
        } catch (err) {
          // ignore
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
