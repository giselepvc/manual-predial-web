/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { localStorageKeys } from '@/utils/localStorageKeys';
import axios from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  async config => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem(localStorageKeys.accessToken);
      if (
        accessToken &&
        !config.url?.includes('auth/local') &&
        !config.url?.includes('auth/forgot-password')
      ) {
        config.headers!.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

export default api;

/* export async function refreshAccessToken() {
  try {
    const credentials = localStorage.getItem(localStorageKeys.refreshToken);

    if (typeof credentials === 'string') {
      const { data } = await api.put('/users/session', {
        refresh_token: credentials,
      });
      localStorage.setItem(localStorageKeys.accessToken, data.access_token);
      localStorage.setItem(localStorageKeys.refreshToken, data.refresh_token);
      return data?.access_token;
    }
  } catch (error) {
    localStorage.clear();
    window.location.href = '/';
  }

  localStorage.clear();
  window.location.href = '/';
} */

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      if (window) {
        localStorage.clear();
        window.location.href = '/';
      }

      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);
