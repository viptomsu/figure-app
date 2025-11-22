import { API_CONFIG } from '../config';
import apiClient from './apiClient';

export const createVNPayPayment = async (
  amount: number,
  orderInfo: string,
  returnUrl: string
): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.VN_PAY}/payment`, {
    params: {
      amount,
      orderInfo,
      returnUrl,
    },
  });
};

export const handleVNPayPaymentReturn = async (requestParams: any): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.VN_PAY}/paymentReturn`, {
    params: requestParams,
  });
};