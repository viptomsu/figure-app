import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';

export const getAddressBooksByUserIdServer = cache(async (userId: string): Promise<any> => {
  return serverFetch<any>(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/user/${userId}`, {
    next: {
      tags: ['address-book'],
    },
  });
});
