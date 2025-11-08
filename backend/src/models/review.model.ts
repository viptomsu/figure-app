// review.model.ts
import mongoose from "mongoose";

export interface IReview {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  reviewText: string;
  rating: number;
  reviewDate: Date;
}

export type ReviewDocument = mongoose.Document & IReview;

const reviewSchema = new mongoose.Schema<ReviewDocument>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến User
  reviewText: { type: String, required: true }, // Nội dung đánh giá
  rating: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá sao, từ 1 đến 5
  reviewDate: { type: Date, default: Date.now }, // Ngày đánh giá, mặc định là thời điểm hiện tại
});

// Tạo model từ schema
const Review: mongoose.Model<ReviewDocument> = mongoose.model<ReviewDocument>("Review", reviewSchema);

export default Review;