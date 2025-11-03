// Centralized API configuration for the frontend application

export const API_CONFIG = {
  // Base URL for the API backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Authentication
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    USERS: '/users',
    VOUCHERS: '/vouchers',
    ADDRESS_BOOK: '/addressbook',
    REVIEWS: '/reviews',
    BRANDS: '/brands',
    VN_PAY: '/vnpay',
  },
  
  // Response status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;

// Helper function to get stored token
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }
  return null;
};

// Helper function to get stored user
export const getStoredUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(API_CONFIG.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Helper function to get user ID
export const getUserId = (): number | null => {
  const user = getStoredUser();
  return user ? user.userId : null;
};
