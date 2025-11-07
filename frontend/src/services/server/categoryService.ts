import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';
import { Category, PaginatedResponse } from '../types';

export const getAllCategoriesServer = cache(async (
  page: number = 1,
  limit: number = 1000,
  keyword: string = ""
): Promise<PaginatedResponse<Category>> => {
  return serverFetch<PaginatedResponse<Category>>(API_CONFIG.ENDPOINTS.CATEGORIES, {
    params: {
      keyword,
      page,
      limit,
    },
    next: {
      revalidate: 600,
    },
  });
});