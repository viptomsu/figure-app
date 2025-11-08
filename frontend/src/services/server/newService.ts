import { cache } from 'react';
import { serverFetch } from './serverFetch';

export const getNewsByIdServer = cache(async (id: string | number) => {
  const response = await serverFetch(
    `/news/${id}`,
    { cache: 'no-store' }
  );
  return response;
});

export const getAllNewsServer = cache(async (page: number = 1, limit: number = 10, keyword: string = '') => {
  const response = await serverFetch('/news', {
    next: { revalidate: 300 },
    params: { page, limit, keyword }
  });
  return response;
});