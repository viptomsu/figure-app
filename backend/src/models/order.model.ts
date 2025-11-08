// order.model.ts
import mongoose from "mongoose";

export interface IOrder {
  code: string;
  date: Date;
  note?: string;
  paymentMethod?: string;
  totalPrice: number;
  discount: number;
  user: mongoose.Types.ObjectId;
  addressBook: mongoose.Types.ObjectId;
  status: string;
  orderDetails: mongoose.Types.ObjectId[];
}

export type OrderDocument = mongoose.Document & IOrder;

const orderSchema = new mongoose.Schema<OrderDocument>({
  code: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Ngày đặt hàng, mặc định là thời điểm hiện tại
  note: { type: String },
  paymentMethod: { type: String },
  totalPrice: { type: Number, required: true }, // Tổng giá trị đơn hàng
  discount: { type: Number, default: 0 }, // Giảm giá, mặc định là 0
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến User
  addressBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddressBook",
    required: true,
  }, // Địa chỉ giao hàng
  status: { type: String, required: true },
  orderDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderDetail" }], // Danh sách chi tiết đơn hàng
});

// Tạo model từ schema
const Order: mongoose.Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;