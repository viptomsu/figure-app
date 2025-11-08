// new.model.ts
import mongoose from "mongoose";

export interface INew {
  title: string;
  content: string;
  publishDate: Date;
  isDeleted: boolean;
  image?: string;
}

export type NewDocument = mongoose.Document & INew;

const newSchema = new mongoose.Schema<NewDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Có thể chứa HTML
  publishDate: { type: Date, default: Date.now, immutable: true }, // Ngày xuất bản, không cho phép cập nhật
  isDeleted: { type: Boolean, default: false },
  image: { type: String }, // Đường dẫn hoặc tên tệp hình ảnh
});

// Tạo model từ schema
const New: mongoose.Model<NewDocument> = mongoose.model<NewDocument>("New", newSchema);

export default New;