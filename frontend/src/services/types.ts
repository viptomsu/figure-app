// Common types for API responses and requests

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  payload?: T;
  message?: string;
  status?: number;
  success?: boolean;
  error?: string;
}

// Custom API Error class
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Static factory methods for common error types
  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  static notFound(message: string = 'Not Found') {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static serverError(message: string = 'Internal Server Error') {
    return new ApiError(message, 500, 'SERVER_ERROR');
  }

  static badRequest(message: string = 'Bad Request', details?: any) {
    return new ApiError(message, 400, 'BAD_REQUEST', details);
  }

  static networkError(message: string = 'Network Error') {
    return new ApiError(message, 0, 'NETWORK_ERROR');
  }
}

// Paginated response
export interface PaginatedResponse<T = any> {
  content: T[];
  payload?: T[];
  data?: T[];
  page: number;
  currentPage?: number;
  totalPages: number;
  totalElements: number;
  totalItems?: number;
  pageSize: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API error response interface
export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Request configuration options
export interface RequestConfig {
  skipAuth?: boolean;
  skipDataExtraction?: boolean;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  avatar?: string;
  isDelete?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Product {
  id: string;
  productName: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images?: { imageUrl: string; isDefault: boolean }[];
  variations?: ProductVariation[];
  isNewProduct?: boolean;
  isSale?: boolean;
  isSpecial?: boolean;
  avgRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  id: string;
  attributeName: string;
  attributeValue: string;
  price: number;
  quantity: number;
  // Legacy fields (optional)
  name?: string;
  value?: string;
  stock?: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentMethod = 'COD' | 'VNPAY' | 'BANK_TRANSFER';

// Order types
export interface Order {
  id: string;
  code: string;
  date: string;
  note?: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  discount: number;
  status: OrderStatus;
  user: {
    id: string;
  };
  addressBook: {
    id: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    email: string;
  };
  orderDetails: OrderDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderDetail {
  product: {
    id: string;
    productName: string;
    price: number;
    image?: string;
  };
  productVariation?: {
    id: string;
    name: string;
    value: string;
  };
  quantity: number;
  price: number;
}

// Category types
export interface Category {
  id: string;
  categoryId?: string;
  categoryName: string;
  description?: string;
  image?: string;
  submenu?: {
    categoryId: string;
    categoryName: string;
    image?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

// Brand types
export interface Brand {
  id: string;
  brandName: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Voucher types
export interface Voucher {
  id: string;
  code: string;
  discount: number;
  description?: string;
  expiryDate?: string;
  isUsed?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Address Book types
export interface AddressBook {
  id: string;
  recipientName: string;
  recipientPhone: string;
  phoneNumber?: string; // Added for compatibility
  email?: string; // Added for compatibility
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Login/Register request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
