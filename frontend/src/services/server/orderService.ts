import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';
import { Order, PaginatedResponse } from '../types';

export const getOrdersForCurrentUserServer = cache(async (
  page: number = 1,
  limit: number = 5
): Promise<PaginatedResponse<Order>> => {
  return serverFetch<PaginatedResponse<Order>>(`${API_CONFIG.ENDPOINTS.ORDERS}/me`, {
    params: {
      page,
      limit,
    },
    cache: 'no-store',
  });
});