import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm tạo thanh toán VNPay
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

// Hàm xử lý trả về từ VNPay sau khi thanh toán
export const handleVNPayPaymentReturn = async (
	requestParams: any
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.VN_PAY}/paymentReturn`, {
		params: requestParams,
	});
};
