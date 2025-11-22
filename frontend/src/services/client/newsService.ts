import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { PaginatedResponse } from '../types';

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  publishDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllNews = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = ''
): Promise<PaginatedResponse<News>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.NEWS}`, {
    params: {
      page,
      limit,
      keyword,
    },
  });
};

export const getNewsById = async (id: string): Promise<News> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.NEWS}/${id}`);
};

export const createNews = async (formData: FormData): Promise<News> => {
  return apiClient.post(`${API_CONFIG.ENDPOINTS.NEWS}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateNews = async (id: string, formData: FormData): Promise<News> => {
  return apiClient.put(`${API_CONFIG.ENDPOINTS.NEWS}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteNews = async (id: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.NEWS}/${id}`);
};
