import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm xóa voucher theo ID
export const deleteVoucher = async (id: any): Promise<any> => {
	return apiClient.delete(`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}`);
};

// Hàm đánh dấu voucher đã sử dụng
export const markVoucherAsUsed = async (id: any): Promise<any> => {
	return apiClient.put(
		`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}/mark-as-used`,
		null
	);
};

// Hàm kiểm tra voucher
export const checkVoucher = async (code: string): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.VOUCHERS}/check/${code}`);
};

// Hàm thay đổi trạng thái voucher
export const changeVoucherStatus = async (id: any): Promise<any> => {
	return apiClient.patch(
		`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}/change-status`,
		null
	);
};
