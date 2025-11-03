import { API_CONFIG } from "./config";
import apiClient from "./apiClient";
import {
	LoginRequest,
	RegisterRequest,
	ForgotPasswordRequest,
	ResetPasswordRequest,
} from "./types";

// Hàm đăng nhập người dùng
export const login = async (
	username: string,
	password: string
): Promise<any> => {
	return apiClient.post(
		API_CONFIG.ENDPOINTS.AUTH.LOGIN,
		{
			username,
			password,
		},
		{ skipAuth: true }
	);
};

// Hàm đăng ký người dùng
export const signup = async (userInfo: RegisterRequest): Promise<any> => {
	return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userInfo, {
		skipAuth: true,
	});
};
export const forgotPassword = async (email: string): Promise<any> => {
	return apiClient.post(
		API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
		{ email }, // Truyền email qua body
		{ skipAuth: true }
	);
};

// API đặt lại mật khẩu
export const resetPassword = async (
	token: string,
	newPassword: string
): Promise<any> => {
	return apiClient.post(
		API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
		{ token, newPassword }, // Truyền token và newPassword vào body của request
		{ skipAuth: true }
	);
};
