// voucher.model.ts
import mongoose from "mongoose";

export interface IVoucher {
  code: string;
  discount: number;
  expirationDate: Date;
  isUsed: boolean;
}

export type VoucherDocument = mongoose.Document & IVoucher;

const voucherSchema = new mongoose.Schema<VoucherDocument>({
  code: { type: String, required: true, unique: true }, // Mã giảm giá
  discount: { type: Number, required: true }, // Phần trăm giảm giá hoặc giá trị giảm giá
  expirationDate: { type: Date, required: true }, // Ngày hết hạn
  isUsed: { type: Boolean, default: false }, // Đánh dấu nếu voucher đã được sử dụng
});

// Tạo model từ schema
const Voucher: mongoose.Model<VoucherDocument> = mongoose.model<VoucherDocument>("Voucher", voucherSchema);

export default Voucher;