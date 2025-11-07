import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { Product, PaginatedResponse } from '../types';

export const getAllProducts = async (
  search: string = '',
  categoryId: number | null = null,
  brandId: number | null = null,
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

export const getProductById = async (id: number): Promise<Product> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
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