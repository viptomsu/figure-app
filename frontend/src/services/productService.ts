import { API_CONFIG } from './config';
import apiClient from './apiClient';

export const getAllProducts = async (
  search: string = '',
  categoryId: number | null = null,
  brandId: number | null = null,
  page: number = 1,
  limit: number = 10,
  sortField: string = 'productName',
  sortDirection: string = 'asc'
): Promise<any> => {
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

export const getProductById = async (id: number): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
};

export const getFilteredProducts = async (
  isNewProduct: boolean | null = null,
  isSale: boolean | null = null,
  isSpecial: boolean | null = null,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/filtered`, {
    params: {
      isSpecial,
      page,
      limit,
    },
  });
};
