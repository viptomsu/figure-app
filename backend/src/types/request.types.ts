// Request type definitions for the Figure E-Commerce API
// These types are framework-agnostic and work with both Express and Prisma
// Last updated: 2025-11-09 - Prisma migration complete

import { UserRole, OrderStatus, PaymentMethod } from "@prisma/client";

/**
 * Standardized paginated response interface for all API endpoints
 * Provides consistent structure for paginated data across the application
 */
export interface PaginatedResponse<T> {
	content: T[];
	page: number;
	limit: number;
	totalElements: number;
	totalPages: number;
}

/**
 * Generic utility type for creating route parameter interfaces
 * Eliminates duplication of single-property param interfaces
 * Example: RouteParams<"id"> creates { id: string }
 */
export type RouteParams<K extends string> = {
	[P in K]: string;
};

/**
 * Note on import extensions and aliases:
 * Uses TypeScript 5.0+ baseUrl + paths allowing @/ map to ./src/ for shorter imports.
 * Runtime supported via package.json imports field and tsconfig-paths dev dependency.
 * .js extensions required for NodeNext module resolution.
 */

// Pagination Interfaces
export interface PaginationQuery {
	page?: string;
	limit?: string;
	searchText?: string;
	keyword?: string;
}

// Auth Request Bodies
export interface RegisterBody {
	username: string;
	password: string;
	email: string;
	phoneNumber: string;
	role: UserRole;
	address?: string;
	fullName: string;
}

export interface LoginBody {
	username: string;
	password: string;
}

export interface ForgotPasswordBody {
	email: string;
}

export interface ResetPasswordBody {
	token: string;
	newPassword: string;
}

// User Request Bodies
export interface CreateUserBody {
	username: string;
	password: string;
	email: string;
	phoneNumber: string;
	fullName: string;
	role: UserRole;
	address?: string;
}

export interface UpdateUserBody {
	username?: string;
	password?: string;
	email?: string;
	phoneNumber?: string;
	fullName?: string;
	role?: UserRole;
	address?: string;
}

export interface ChangePasswordBody {
	currentPassword: string;
	newPassword: string;
}

// Product Request Bodies
export interface CreateProductBody {
	productName: string;
	price: number;
	description?: string;
	discount: number;
	badge?: string;
	stock: number;
	isNewProduct: boolean;
	isSale: boolean;
	isSpecial: boolean;
	categoryId: string;
	brandId: string;
	variations: string; // JSON string of ProductVariationInput[]
}

export interface UpdateProductBody {
	productName?: string;
	price?: number;
	description?: string;
	discount?: number;
	badge?: string;
	stock?: number;
	isNewProduct?: boolean;
	isSale?: boolean;
	isSpecial?: boolean;
	categoryId?: string;
	brandId?: string;
	variations?: string; // JSON string of ProductVariationInput[]
}

export interface ProductFilterQuery extends PaginationQuery {
	search?: string;
	categoryId?: string;
	brandId?: string;
	sortField?: string;
	sortDirection?: string;
	isNewProduct?: string;
	isSale?: string;
	isSpecial?: string;
}

// Order Request Bodies
export interface OrderDetailItem {
	product: {
		productId: string;
	};
	productVariation?: {
		variationId: string;
	};
	quantity: number;
	price: number;
}

export interface CreateOrderBody {
	code: string;
	date: string;
	note?: string;
	paymentMethod?: PaymentMethod;
	totalPrice: number;
	discount: number;
	user: {
		userId: string;
	};
	addressBook: {
		addressBookId: string;
	};
	status: OrderStatus;
	orderDetails: OrderDetailItem[];
}

export interface OrderFilterQuery extends PaginationQuery {
	code?: string;
	status?: OrderStatus;
	method?: PaymentMethod;
}

// Category/Brand/New Request Bodies
export interface CreateCategoryBody {
	categoryName: string;
	description?: string;
}

export interface UpdateCategoryBody {
	categoryName?: string;
	description?: string;
}

export interface CreateBrandBody {
	brandName: string;
	description?: string;
}

export interface UpdateBrandBody {
	brandName?: string;
	description?: string;
}

export interface CreateNewBody {
	title: string;
	content: string;
}

export interface UpdateNewBody {
	title?: string;
	content?: string;
}

// Review Request Bodies
export interface CreateReviewBody {
	productId: string;
	userId: string;
	reviewText: string;
	rating: number;
}

// Voucher Request Bodies
export interface CreateVoucherBody {
	code: string;
	discount: number;
	expirationDate: string;
}

export interface UpdateVoucherBody {
	code?: string;
	discount?: number;
	expirationDate?: string;
}

// AddressBook Request Bodies
export interface CreateAddressBookBody {
	recipientName: string;
	phoneNumber: string;
	address: string;
	ward: string;
	district: string;
	city: string;
	email: string;
}

export interface UpdateAddressBookBody {
	recipientName?: string;
	phoneNumber?: string;
	address?: string;
	ward?: string;
	district?: string;
	city?: string;
	email?: string;
}

// VNPay Request Query
export interface VNPayPaymentQuery {
	amount: string;
	orderInfo: string;
	returnUrl: string;
}

// Revenue Request Query
export interface DailyRevenueQuery {
	startDate?: string;
	endDate?: string;
}

// Response DTOs
export interface ProductVariationDTO {
	id: string;
	attributeName: string;
	attributeValue: string;
	price: number;
	quantity: number;
}

export interface ProductImageDTO {
	id: string;
	imageUrl: string;
	isDefault: boolean;
}

export interface ProductCategoryDTO {
	id: string;
	categoryName: string;
	image: string;
}

export interface ProductBrandDTO {
	id: string;
	brandName: string;
	image: string;
}

export interface ProductListItem {
	id: string;
	productName: string;
	price: number;
	description: string;
	discount: number;
	badge: string;
	stock: number;
	isNewProduct: boolean;
	isSale: boolean;
	isSpecial: boolean;
	category: ProductCategoryDTO | null;
	brand: ProductBrandDTO | null;
	variations: ProductVariationDTO[];
	images: ProductImageDTO[];
	avgRating: number;
	reviewCount: number;
	isDelete: boolean;
}

// Param Interfaces - using RouteParams utility to eliminate duplication
export type IdParam = RouteParams<"id">;
export type UserIdParam = RouteParams<"userId">;
export type ProductIdParam = RouteParams<"productId">;
export type OrderIdParam = RouteParams<"orderId">;
export type AddressBookIdParam = RouteParams<"addressBookId">;
export type ImageIdParam = RouteParams<"imageId">;
export type VoucherCodeParam = RouteParams<"code">;

export interface ProductVariationInput {
	[key: string]: any; // Allow any variation properties like color, size, etc.
}
