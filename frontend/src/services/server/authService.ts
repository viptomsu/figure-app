import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { API_CONFIG } from '../config';
import { User } from '../types';

// Server-side cached version
export const getCurrentUserServer = cache(async (): Promise<User | null> => {
  try {
    const user = await serverFetch<User>(API_CONFIG.ENDPOINTS.USERS.ME, {
      cache: 'no-store',
    });
    return user;
  } catch (error: any) {
    // Return null for 401 errors (user not logged in)
    if (error?.status === 401) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
});