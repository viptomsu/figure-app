import { RegisterRequest, ApiResponse, User } from '../types';
import apiClient from './apiClient';
import { API_CONFIG } from '../config';

export const fetchSession = async (): Promise<{ authenticated: boolean }> => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { authenticated: false };
    }

    return data;
  } catch (error) {
    return { authenticated: false };
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS.ME);
  return response.payload;
};

export const login = async (username: string, password: string): Promise<ApiResponse<User>> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const signup = async (userInfo: RegisterRequest): Promise<ApiResponse<{ user: User }>> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
};

export const forgotPassword = async (email: string): Promise<any> => {
  return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
};

export const logout = async (): Promise<any> => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed');
  }

  return data;
};