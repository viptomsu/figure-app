import { API_CONFIG } from '../config';
import apiClient from './apiClient';

export const getAllBrands = async (
  page: number = 1,
  limit: number = 1000,
  keyword: string = ''
): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.BRANDS}`, {
    params: {
      keyword,
      page,
      limit,
    },
  });
};

export const getBrandById = async (id: string): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`);
};

export const createBrand = async (
  brandName: string,
  description: string,
  imageFile?: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('brandName', brandName);
  formData.append('description', description);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiClient.post(`${API_CONFIG.ENDPOINTS.BRANDS}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateBrand = async (
  id: string,
  brandName: string,
  description: string,
  imageFile?: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('brandName', brandName);
  formData.append('description', description);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiClient.put(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteBrand = async (id: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`);
};
