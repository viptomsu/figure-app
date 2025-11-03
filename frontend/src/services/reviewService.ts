import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy review theo product ID với phân trang và tìm kiếm
export const getReviewsByProduct = async (
	productId: any,
	page: number = 1,
	size: number = 10,
	searchText: string = ""
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/product/${productId}`, {
		params: {
			searchText,
			page,
			size,
		},
	});
};

// Hàm tạo review mới
export const createReview = async (
	productId: any,
	userId: any,
	reviewText: string,
	rating: number
): Promise<any> => {
	const reviewData = {
		productId,
		userId,
		reviewText,
		rating,
	};

	return apiClient.post(`${API_CONFIG.ENDPOINTS.REVIEWS}`, reviewData);
};
