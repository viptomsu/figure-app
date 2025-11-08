// productVariation.model.ts
import mongoose from "mongoose";

export interface IProductVariation {
  product: mongoose.Types.ObjectId;
  attributeName: string;
  attributeValue: string;
  price: number;
  quantity: number;
  isDelete: boolean;
}

export type ProductVariationDocument = mongoose.Document & IProductVariation;

const productVariationSchema = new mongoose.Schema<ProductVariationDocument>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  attributeName: { type: String, required: true }, // Ví dụ: "Color", "Storage", "RAM"
  attributeValue: { type: String, required: true }, // Ví dụ: "Red", "128GB", "16GB"
  price: { type: Number, required: true }, // Giá cho biến thể sản phẩm
  quantity: { type: Number, required: true }, // Số lượng của biến thể
  isDelete: { type: Boolean, default: false }, // Đánh dấu nếu biến thể bị xóa
});

// Tạo model từ schema
const ProductVariation: mongoose.Model<ProductVariationDocument> = mongoose.model<ProductVariationDocument>(
  "ProductVariation",
  productVariationSchema
);

export default ProductVariation;