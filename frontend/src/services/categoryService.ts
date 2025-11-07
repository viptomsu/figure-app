import { API_CONFIG } from "./config";
import apiClient from "./apiClient";
import { cache } from 'react';
import { serverFetch } from './serverFetch';
import { Category, PaginatedResponse } from './types';

// Hàm lấy tất cả danh mục với phân trang, tìm kiếm và sắp xếp
export const getAllCategories = async (
	page: number = 1,
	limit: number = 1000,
	keyword: string = ""
): Promise<PaginatedResponse<Category>> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
		params: {
			keyword,
			page,
			limit,
		},
	});
};

// Server-side cached version
export const getAllCategoriesServer = cache(async (
	page: number = 1,
	limit: number = 1000,
	keyword: string = ""
): Promise<PaginatedResponse<Category>> => {
	return serverFetch<PaginatedResponse<Category>>(API_CONFIG.ENDPOINTS.CATEGORIES, {
		params: {
			keyword,
			page,
			limit,
		},
		next: {
			revalidate: 600,
		},
	});
});

// Hàm lấy danh mục theo ID
export const getCategoryById = async (id: number): Promise<Category> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
};

// Hàm tạo danh mục mới
export const createCategory = async (
	categoryName: any,
	description: any,
	imageFile: any
): Promise<any> => {
	const formData = new FormData();
	formData.append("categoryName", categoryName);
	formData.append("description", description);
	formData.append("image", imageFile);

	return apiClient.post(`${API_CONFIG.ENDPOINTS.CATEGORIES}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

// Hàm cập nhật danh mục theo ID
export const updateCategory = async (
	id: any,
	categoryName: any,
	description: any,
	imageFile?: any
): Promise<any> => {
	const formData = new FormData();
	formData.append("categoryName", categoryName);
	formData.append("description", description);
	if (imageFile) {
		formData.append("image", imageFile);
	}

	return apiClient.put(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

// Hàm xóa danh mục theo ID
export const deleteCategory = async (id: any): Promise<any> => {
	return apiClient.delete(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
};
