import { API_CONFIG } from './config';
import apiClient from './apiClient';

// Hàm gửi email xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (orderCode: string): Promise<any> => {
  return apiClient.post(`/email/sendOrderConfirmation`, null, {
    params: { orderCode },
  });
};
