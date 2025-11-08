// brand.model.ts
import mongoose from "mongoose";

export interface IBrand {
  brandName: string;
  image?: string;
  description?: string;
  isDelete: boolean;
  createdAt: Date;
}

export type BrandDocument = mongoose.Document & IBrand;

const brandSchema = new mongoose.Schema<BrandDocument>({
  brandName: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, immutable: true }, // Không cho phép cập nhật, chỉ tạo một lần
});

// Tạo model từ schema
const Brand: mongoose.Model<BrandDocument> = mongoose.model<BrandDocument>("Brand", brandSchema);

export default Brand;