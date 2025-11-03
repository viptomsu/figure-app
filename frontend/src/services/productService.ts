import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy tất cả sản phẩm với phân trang, tìm kiếm và lọc
export const getAllProducts = async (
	search: string = "",
	categoryId: number | null = null,
	brandId: number | null = null,
	page: number = 1,
	limit: number = 10,
	sortField: string = "productName", // Thêm tham số sortField
	sortDirection: string = "asc" // Thêm tham số sortDirection
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}`, {
		params: {
			search,
			categoryId,
			brandId,
			page,
			limit,
			sortField, // Truyền sortField vào params
			sortDirection, // Truyền sortDirection vào params
		},
	});
};

// Hàm lấy sản phẩm theo ID
export const getProductById = async (id: number): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
};

// Hàm lấy sản phẩm theo các điều kiện lọc
export const getFilteredProducts = async (
	isNewProduct: boolean | null = null,
	isSale: boolean | null = null,
	isSpecial: boolean | null = null,
	page: number = 1,
	limit: number = 10
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/filtered`, {
		params: {
			isSpecial,
			page,
			limit,
		},
	});
};
