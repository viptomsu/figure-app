import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { Product, PaginatedResponse } from '../types';

export const getAllProducts = async (
  search: string = '',
  categoryId: string | null = null,
  brandId: string | null = null,
  page: number = 1,
  limit: number = 10,
  sortField: string = 'productName',
  sortDirection: string = 'asc'
): Promise<PaginatedResponse<Product>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}`, {
    params: {
      search,
      categoryId,
      brandId,
      page,
      limit,
      sortField,
      sortDirection,
    },
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  return apiClient.post(`${API_CONFIG.ENDPOINTS.PRODUCTS}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async (id: string, productData: FormData): Promise<Product> => {
  return apiClient.put(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = async (id: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
};

export const getFilteredProducts = async (
  isNewProduct: boolean | null = null,
  isSale: boolean | null = null,
  isSpecial: boolean | null = null,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Product>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/filtered`, {
    params: {
      isNewProduct,
      isSale,
      isSpecial,
      page,
      limit,
    },
  });
};
