import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy tất cả người dùng với phân trang, tìm kiếm và sắp xếp
export const getAllUsers = async (
	page: any = 1,
	limit: any = 1000,
	keyword: any = ""
): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}`, {
		params: {
			keyword,
			page,
			limit,
		},
	});
};

// Hàm lấy người dùng theo ID
export const getUserById = async (id: any): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
};

// Hàm tạo người dùng mới
export const createUser = async (userData: any): Promise<any> => {
	const formData = new FormData();
	formData.append("username", userData.username);
	formData.append("password", userData.password);
	formData.append("email", userData.email);
	formData.append("phoneNumber", userData.phoneNumber);
	formData.append("fullName", userData.fullName);
	formData.append("address", userData.address);
	formData.append("role", userData.role);

	formData.append("avatar", "");

	return apiClient.post(`${API_CONFIG.ENDPOINTS.USERS}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

// Hàm cập nhật người dùng theo ID
export const updateUser = async (
	id: any,
	userData: any,
	imageFile: any
): Promise<any> => {
	const formData = new FormData();
	formData.append("username", userData.username);
	formData.append("email", userData.email);
	formData.append("phoneNumber", userData.phoneNumber);
	formData.append("fullName", userData.fullName);
	formData.append("address", userData.address);
	formData.append("role", userData.role);

	if (imageFile) {
		formData.append("avatar", imageFile); // Upload ảnh đại diện (avatar)
	}

	return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const updateProfile = async (
	id: any,
	userData: any,
	imageFile: any
): Promise<any> => {
	// Lấy user từ localStorage
	const user = localStorage.getItem("user");
	let parsedUser = null;
	if (user) {
		parsedUser = JSON.parse(user);
	}

	const formData = new FormData();
	if (parsedUser) {
		formData.append("username", parsedUser.username); // Lấy username từ localStorage
		formData.append("role", parsedUser.role); // Lấy role từ localStorage
	}
	formData.append("email", userData.email);
	formData.append("phoneNumber", userData.phoneNumber);
	formData.append("fullName", userData.fullName);
	formData.append("address", userData.address);

	if (imageFile) {
		formData.append("avatar", imageFile); // Upload ảnh đại diện nếu có
	}

	return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

// Hàm xóa người dùng theo ID
export const deleteUser = async (id: any): Promise<any> => {
	return apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
};
export const changePassword = async (
	id: any,
	currentPassword: string,
	newPassword: string
): Promise<any> => {
	// Gửi dữ liệu dưới dạng JSON
	return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}/change-password`, {
		currentPassword,
		newPassword,
	});
};
