export type OrderStatusVariant =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipping'
  | 'cancelled'
  | 'delivered'
  | 'returned'
  | 'outline'
  | 'unknown';

import { OrderStatus } from '../services/types';

const ORDER_STATUS_VARIANT_MAP: Record<OrderStatus | string, OrderStatusVariant> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

const ORDER_STATUS_LABEL_MAP: Record<OrderStatus | string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PACKED: 'Đã đóng gói',
  SHIPPING: 'Đang vận chuyển',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Đã trả hàng',
};

export function getOrderStatusVariant(status: string): OrderStatusVariant {
  return ORDER_STATUS_VARIANT_MAP[status] || 'unknown';
}

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABEL_MAP[status] || status;
}

export { ORDER_STATUS_VARIANT_MAP, ORDER_STATUS_LABEL_MAP };
