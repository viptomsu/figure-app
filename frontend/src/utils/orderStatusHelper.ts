export type OrderStatusVariant =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipping"
  | "cancelled"
  | "delivered"
  | "outline"
  | "unknown";

const ORDER_STATUS_VARIANT_MAP: Record<string, OrderStatusVariant> = {
  "Chờ xác nhận": "pending",
  "Đã xác nhận": "confirmed",
  "Đã đóng gói": "packed",
  "Đang vận chuyển": "shipping",
  "Đã hủy": "cancelled",
  "Đã giao hàng": "delivered",
};

export function getOrderStatusVariant(status: string): OrderStatusVariant {
  return ORDER_STATUS_VARIANT_MAP[status] || "unknown";
}

export { ORDER_STATUS_VARIANT_MAP };
