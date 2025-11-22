import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { PaginatedResponse } from '../types';

export interface Review {
  id: string;
  reviewId: string; // Legacy might use reviewId
  product: {
    id: string;
    productName: string;
    image?: string;
  };
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    avatar?: string;
  };
  reviewText: string;
  rating: number;
  reviewDate: string;
}

export const getAllReviews = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = ''
): Promise<PaginatedResponse<Review>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.REVIEWS}`, {
    params: {
      page,
      limit,
      keyword,
    },
  });
};

export const deleteReview = async (id: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`);
};
