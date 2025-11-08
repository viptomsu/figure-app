// productImage.model.ts
import mongoose from "mongoose";

export interface IProductImage {
  product: mongoose.Types.ObjectId;
  imageUrl: string;
  isDelete: boolean;
  isDefault: boolean;
}

export type ProductImageDocument = mongoose.Document & IProductImage;

const productImageSchema = new mongoose.Schema<ProductImageDocument>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  imageUrl: { type: String, required: true }, // URL của hình ảnh
  isDelete: { type: Boolean, default: false }, // Đánh dấu nếu hình ảnh bị xóa
  isDefault: { type: Boolean, default: false }, // Đánh dấu nếu đây là hình ảnh mặc định
});

// Tạo model từ schema
const ProductImage: mongoose.Model<ProductImageDocument> = mongoose.model<ProductImageDocument>("ProductImage", productImageSchema);

export default ProductImage;