import { API_CONFIG } from '../config';
import apiClient from './apiClient';
import { Order, PaginatedResponse, ApiResponse } from '../types';

const getVietnamTimeISO = () => {
  const date = new Date();

  // Thêm 7 giờ để chuyển sang múi giờ UTC+7 (Giờ Việt Nam)
  const vietnamOffset = 7 * 60 * 60 * 1000;
  const vietnamTime = new Date(date.getTime() + vietnamOffset);

  // Chuyển sang định dạng ISO 8601
  const newDate = vietnamTime.toISOString().slice(0, 19); // Cắt bỏ phần mili giây và Z
  return newDate; // Thêm phần chênh lệch múi giờ +07:00
};

export const createOrder = async (
  cart: any[],
  paymentMethod: string,
  orderCode: string,
  addressBookId: string,
  discount: number,
  userId: string
): Promise<any> => {
  if (!userId) {
    throw new Error('User ID is required to create an order');
  }

  const newDate = getVietnamTimeISO(); // Chuyển sang định dạng ISO 8601

  // Tính tổng giá trước khi áp dụng giảm giá tổng thể
  const totalPriceBeforeDiscount = cart.reduce((total: number, product: any) => {
    const originalPrice = product.selectedPrice || product.price; // Lấy selectedPrice nếu có, nếu không thì lấy price
    const discountedPrice = product.discount
      ? originalPrice - (originalPrice * product.discount) / 100
      : originalPrice; // Áp dụng giảm giá cho từng sản phẩm nếu có

    return total + discountedPrice * product.count; // Tính tổng giá sau khi giảm cho mỗi sản phẩm
  }, 0);

  // Áp dụng giảm giá tổng thể vào tổng giá trước khi giảm
  const totalPrice = totalPriceBeforeDiscount - (totalPriceBeforeDiscount * discount) / 100;

  const orderData = {
    code: orderCode,
    date: newDate,
    note: 'Không có', // Đây là ghi chú ví dụ, bạn có thể thay đổi
    paymentMethod: paymentMethod, // Nhận từ hàm gọi
    totalPrice: totalPrice, // Tổng giá sau khi áp dụng giảm giá tổng thể
    discount: discount, // Giảm giá tổng thể
    user: {
      id: userId, // Lấy từ localStorage
    },
    addressBook: {
      id: addressBookId, // Nhận từ hàm gọi
    },
    status: 'PENDING', // Trạng thái mặc định là pending
    orderDetails: cart.map((product: any) => {
      const originalPrice = product.selectedPrice || product.price;
      const discountedPrice = product.discount
        ? originalPrice - (originalPrice * product.discount) / 100
        : originalPrice;

      // Tạo đối tượng orderDetail
      const orderDetail: any = {
        product: {
          id: product.id || product._id,
        },
        quantity: product.count,
        price: discountedPrice, // Áp dụng giá sau khi giảm cho từng sản phẩm
      };

      // Kiểm tra nếu có biến thể thì thêm trường productVariation
      if (product.variations && product.variations.length > 0) {
        orderDetail.productVariation = {
          id: product.variations[0].id || product.variations[0]._id, // Giả định chỉ lấy biến thể đầu tiên
        };
      }

      return orderDetail;
    }),
  };

  return apiClient.post(`${API_CONFIG.ENDPOINTS.ORDERS}/create`, orderData);
};

export const getAllOrders = async (
  page: number = 1,
  limit: number = 10,
  code?: string, // Thêm code làm tùy chọn
  status?: string, // Thêm status làm tùy chọn
  method?: string // Thêm method làm tùy chọn
): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  const params: any = { page, limit };

  // Kiểm tra xem các tham số lọc có tồn tại không, nếu có thì thêm vào params
  if (code) {
    params.code = code;
  }
  if (status) {
    params.status = status;
  }
  if (method) {
    params.method = method;
  }

  return apiClient.get(`${API_CONFIG.ENDPOINTS.ORDERS}/all`, {
    params,
  });
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  return apiClient.put(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}/status`, null, {
    params: { status },
  });
};

export const getOrdersByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.ORDERS}/user/${userId}`, {
    params: {
      page,
      limit,
    },
  });
};

export const getOrdersForCurrentUser = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.ORDERS}/me`, {
    params: {
      page,
      limit,
    },
  });
};
