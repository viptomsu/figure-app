import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { serializeParams, handleResponseError, handleNetworkError } from '../../utils';
import { API_CONFIG } from '../config';
import { ApiError } from '../types';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: true,
  paramsSerializer: {
    serialize: serializeParams,
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    let apiError: ApiError;

    if (error.response) {
      // Use our shared error handling utility
      apiError = handleResponseError(
        error.response.status,
        error.response.data,
        error.response.statusText
      );

      // Handle special case for 401 - redirect to login
      if (error.response.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      // Use our shared network error handling
      apiError = handleNetworkError(error);
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;