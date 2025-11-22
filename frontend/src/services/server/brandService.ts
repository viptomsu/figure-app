import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';

export const getAllBrandsServer = cache(
  async (page: number = 1, limit: number = 1000, keyword: string = ''): Promise<any> => {
    return serverFetch<any>(API_CONFIG.ENDPOINTS.BRANDS, {
      params: {
        keyword,
        page,
        limit,
      },
      next: {
        revalidate: 600,
      },
    });
  }
);
