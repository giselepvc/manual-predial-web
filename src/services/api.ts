/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { localStorageKeys } from '@/utils/localStorageKeys';
import axios from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
});

// Função para configurar os interceptores e passar a função de setLoading
export const setupAxiosInterceptors = (
  setIsLoading: (loading: boolean) => void,
) => {
  // Interceptor de requisição
  api.interceptors.request.use(
    async config => {
      setIsLoading(true); // Ativa o loading

      // Token de autenticação
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

      return config; // Garante que a requisição continue
    },
    error => {
      setIsLoading(false); // Desativa o loading em caso de erro de requisição
      return Promise.reject(error); // Garante que o erro continue sendo tratado
    },
  );

  // Interceptor de resposta
  api.interceptors.response.use(
    response => {
      setIsLoading(false); // Desativa o loading ao receber a resposta
      return response; // Retorna a resposta corretamente
    },
    async error => {
      setIsLoading(false); // Desativa o loading em caso de erro de resposta

      const originalRequest = error.config;

      if (error?.response?.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;

        // Tratamento de erro 401 e redirecionamento
        if (window) {
          localStorage.clear();
          window.location.href = '/';
        }

        return api(originalRequest); // Reenvia a requisição original após o token expirar
      }

      return Promise.reject(error); // Retorna o erro para ser tratado
    },
  );
};

export default api;
