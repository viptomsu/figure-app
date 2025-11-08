// category.model.ts
import mongoose from "mongoose";

export interface ICategory {
  categoryName: string;
  image?: string;
  description?: string;
  isDelete: boolean;
  createdAt: Date;
}

export type CategoryDocument = mongoose.Document & ICategory;

const categorySchema = new mongoose.Schema<CategoryDocument>({
  categoryName: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, immutable: true }, // Không cho phép cập nhật, chỉ tạo một lần
});

// Tạo model từ schema
const Category: mongoose.Model<CategoryDocument> = mongoose.model<CategoryDocument>("Category", categorySchema);

export default Category;