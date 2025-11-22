import { API_CONFIG } from "../config";
import apiClient from "./apiClient";
import { Category } from '../types';

export const getAllCategories = async (
	page: number = 1,
	limit: number = 1000,
	keyword: string = ""
) => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
		params: {
			keyword,
			page,
			limit,
		},
	});
};

export const getCategoryById = async (id: number): Promise<Category> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
};

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

export const deleteCategory = async (id: any): Promise<any> => {
	return apiClient.delete(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
};