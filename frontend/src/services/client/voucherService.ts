import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { PaginatedResponse } from '../types';

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  expirationDate: string;
  isUsed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllVouchers = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = ''
): Promise<PaginatedResponse<Voucher>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.VOUCHERS}`, {
    params: {
      page,
      limit,
      keyword,
    },
  });
};

export const createVoucher = async (data: Partial<Voucher>): Promise<Voucher> => {
  return apiClient.post(`${API_CONFIG.ENDPOINTS.VOUCHERS}`, data);
};

export const updateVoucher = async (id: string, data: Partial<Voucher>): Promise<Voucher> => {
  return apiClient.put(`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}`, data);
};

export const deleteVoucher = async (id: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}`);
};

export const changeVoucherStatus = async (id: string): Promise<any> => {
  return apiClient.put(`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}/change-status`);
};
