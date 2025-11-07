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

	constructor(
		message: string,
		status: number = 500,
		code?: string,
		details?: any
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}

	// Static factory methods for common error types
	static unauthorized(message: string = "Unauthorized") {
		return new ApiError(message, 401, "UNAUTHORIZED");
	}

	static forbidden(message: string = "Forbidden") {
		return new ApiError(message, 403, "FORBIDDEN");
	}

	static notFound(message: string = "Not Found") {
		return new ApiError(message, 404, "NOT_FOUND");
	}

	static serverError(message: string = "Internal Server Error") {
		return new ApiError(message, 500, "SERVER_ERROR");
	}

	static badRequest(message: string = "Bad Request", details?: any) {
		return new ApiError(message, 400, "BAD_REQUEST", details);
	}

	static networkError(message: string = "Network Error") {
		return new ApiError(message, 0, "NETWORK_ERROR");
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
	userId: number;
	username: string;
	email: string;
	fullName: string;
	phoneNumber?: string;
	address?: string;
	role: string;
	avatar?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Product types
export interface Product {
	_id: string;
	productName: string;
	description?: string;
	price: number;
	discount?: number;
	stock: number;
	categoryId: number;
	brandId: number;
	images?: string[];
	variations?: ProductVariation[];
	isNewProduct?: boolean;
	isSale?: boolean;
	isSpecial?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ProductVariation {
	_id: string;
	name: string;
	value: string;
	price?: number;
	stock?: number;
}

// Order types
export interface Order {
	_id: string;
	code: string;
	date: string;
	note?: string;
	paymentMethod: string;
	totalPrice: number;
	discount: number;
	status: string;
	user: {
		userId: number;
	};
	addressBook: {
		addressBookId: string;
	};
	orderDetails: OrderDetail[];
	createdAt?: string;
	updatedAt?: string;
}

export interface OrderDetail {
	product: {
		productId: string;
	};
	productVariation?: {
		variationId: string;
	};
	quantity: number;
	price: number;
}

// Category types
export interface Category {
	categoryId: number;
	categoryName: string;
	description?: string;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Brand types
export interface Brand {
	brandId: number;
	brandName: string;
	description?: string;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Voucher types
export interface Voucher {
	voucherId: number;
	code: string;
	discount: number;
	description?: string;
	expiryDate?: string;
	isUsed?: boolean;
	userId?: number;
	createdAt?: string;
	updatedAt?: string;
}

// Address Book types
export interface AddressBook {
	addressBookId: string;
	recipientName: string;
	recipientPhone: string;
	address: string;
	city: string;
	district: string;
	ward: string;
	isDefault: boolean;
	userId: number;
	createdAt?: string;
	updatedAt?: string;
}

// Review types
export interface Review {
	reviewId: number;
	userId: number;
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
