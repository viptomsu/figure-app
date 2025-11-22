import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { User, PaginatedResponse } from '../types';

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = ''
): Promise<PaginatedResponse<User>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.USERS.BASE}`, {
    params: {
      page,
      limit,
      keyword,
    },
  });
};

export const updateProfile = async (
  id: any,
  userData: any,
  imageFile: any,
  username: string,
  role: string
): Promise<any> => {
  if (!username || !role) {
    throw new Error('Username and role are required');
  }

  const formData = new FormData();
  formData.append('username', username); // Username from parameter
  formData.append('role', role); // Role from parameter
  formData.append('email', userData.email);
  formData.append('phoneNumber', userData.phoneNumber);
  formData.append('fullName', userData.fullName);
  formData.append('address', userData.address);

  if (imageFile) {
    formData.append('avatar', imageFile); // Upload ảnh đại diện nếu có
  }

  return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  if (!userId || !currentPassword || !newPassword) {
    throw new Error('User ID, current password, and new password are required');
  }

  return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}/change-password`, {
    currentPassword,
    newPassword,
  });
};
