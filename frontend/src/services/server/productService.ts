import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';
import { Product, PaginatedResponse } from '../types';

export const getProductByIdServer = cache(async (id: string): Promise<Product> => {
  return serverFetch<Product>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
    cache: 'no-store',
  });
});

export const getAllProductsServer = cache(
  async (
    search: string = '',
    categoryId: string | null = null,
    brandId: string | null = null,
    page: number = 1,
    limit: number = 12,
    sortField: string = 'productName',
    sortDirection: string = 'asc'
  ): Promise<PaginatedResponse<Product>> => {
    return serverFetch<PaginatedResponse<Product>>(API_CONFIG.ENDPOINTS.PRODUCTS, {
      params: {
        search,
        categoryId,
        brandId,
        page,
        limit,
        sortField,
        sortDirection,
      },
      cache: 'no-store',
    });
  }
);

export const getFilteredProductsServer = cache(
  async (
    isNewProduct: boolean | null = null,
    isSale: boolean | null = null,
    isSpecial: boolean | null = null,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> => {
    return serverFetch<PaginatedResponse<Product>>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/filtered`, {
      params: {
        isNewProduct,
        isSale,
        isSpecial,
        page,
        limit,
      },
      next: {
        revalidate: 300,
      },
    });
  }
);
