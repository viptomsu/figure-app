// Axios type declarations for our API client

import 'axios';

// Enhanced request config with custom options
declare module 'axios' {
  export interface AxiosRequestConfig<D = any> {
    skipAuth?: boolean;
    skipDataExtraction?: boolean;
  }

  // Enhance the return types of Axios methods while preserving the original type parameters
  export interface AxiosInstance {
    get<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    post<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    put<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    patch<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    delete<T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
  }
}
