// Centralized API configuration for the frontend application

export const API_CONFIG = {
  // Base URL for the API backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Authentication
  // Cookie names (no longer used for localStorage)
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
      SESSION: '/auth/session',
    },
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    NEWS: '/news',
    USERS: {
      BASE: '/users',
      ME: '/users/me',
    },
    VOUCHERS: '/vouchers',
    ADDRESS_BOOK: '/addressbook',
    REVIEWS: '/reviews',
    BRANDS: '/brands',
    VN_PAY: '/vnpay',
    CHATROOMS: '/chatrooms',
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
