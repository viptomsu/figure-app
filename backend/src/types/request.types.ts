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
  role: string;
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
  role: string;
  address?: string;
}

export interface UpdateUserBody {
  username?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  role?: string;
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
  paymentMethod?: string;
  totalPrice: number;
  discount: number;
  user: {
    userId: string;
  };
  addressBook: {
    addressBookId: string;
  };
  status: string;
  orderDetails: OrderDetailItem[];
}

export interface OrderFilterQuery extends PaginationQuery {
  code?: string;
  status?: string;
  method?: string;
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

// Param Interfaces
export interface IdParam {
  id: string;
}

export interface UserIdParam {
  userId: string;
}

export interface ProductIdParam {
  productId: string;
}

export interface OrderIdParam {
  orderId: string;
}

export interface AddressBookIdParam {
  addressBookId: string;
}

export interface ImageIdParam {
  imageId: string;
}

export interface VoucherCodeParam {
  code: string;
}

export interface ProductVariationInput {
  [key: string]: any; // Allow any variation properties like color, size, etc.
}