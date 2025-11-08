// orderDetail.model.ts
import mongoose from "mongoose";

export interface IOrderDetail {
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  productVariation: mongoose.Types.ObjectId | null;
  quantity: number;
  price: number;
}

export type OrderDetailDocument = mongoose.Document & IOrderDetail;

const orderDetailSchema = new mongoose.Schema<OrderDetailDocument>({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Tham chiếu đến Order
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  productVariation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariation",
    default: null,
  }, // Có thể không có productVariation
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Giá sản phẩm, sử dụng Decimal128 cho độ chính xác cao
});

// Tạo model từ schema
const OrderDetail: mongoose.Model<OrderDetailDocument> = mongoose.model<OrderDetailDocument>("OrderDetail", orderDetailSchema);

export default OrderDetail;