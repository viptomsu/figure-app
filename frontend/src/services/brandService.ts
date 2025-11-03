import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy tất cả thương hiệu với phân trang, tìm kiếm
export const getAllBrands = async (
	page: number = 1,
	limit: number = 1000,
	keyword: string = ""
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.BRANDS}`, {
		params: {
			keyword,
			page,
			limit,
		},
	});
};

// Hàm lấy thương hiệu theo ID
export const getBrandById = async (id: number): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`);
};
