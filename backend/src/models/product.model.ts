// product.model.ts
import mongoose from "mongoose";
import { ProductImageDocument } from "./productImage.model";

export interface IProduct {
  productName: string;
  price: number;
  description?: string;
  discount: number;
  badge?: string;
  stock: number;
  isNewProduct: boolean;
  isSale: boolean;
  isSpecial: boolean;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  isDelete: boolean;
  variations: mongoose.Types.ObjectId[];
  images: mongoose.Types.ObjectId[] | ProductImageDocument[];
}

export interface IProductMethods {
  getDefaultImage(): ProductImageDocument | null;
}

export type ProductDocument = mongoose.Document & IProduct & IProductMethods;

const productSchema = new mongoose.Schema<ProductDocument>({
  productName: { type: String, required: true },
  price: { type: Number, required: true }, // Thay Decimal128 bằng Number
  description: { type: String },
  discount: { type: Number, default: 0 }, // Thay Decimal128 bằng Number
  badge: { type: String },
  stock: { type: Number, default: 0 },
  isNewProduct: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  isDelete: { type: Boolean, default: false },
  variations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariation" },
  ],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductImage" }],
});

// Method to get the default image
productSchema.methods.getDefaultImage = function (): ProductImageDocument | null {
  if (this.images && this.images.length > 0) {
    // Check if images are populated (have ProductImageDocument structure)
    const firstImage = this.images[0];
    if (firstImage && typeof firstImage === 'object' && 'isDefault' in firstImage) {
      // Images are populated as ProductImageDocument[]
      return this.images.find((image: ProductImageDocument) => image.isDefault) || null;
    } else {
      // Images are not populated, return null since we can't access isDefault
      return null;
    }
  }
  return null;
};

// Tạo model từ schema
const Product: mongoose.Model<ProductDocument> = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;