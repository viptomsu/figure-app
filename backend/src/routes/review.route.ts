// review.router.ts
import { Router } from "express";
import {
	getAllReviews,
	getReviewsByProduct,
	createReview,
} from "@/controllers/review.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createReviewSchema,
	reviewFilterSchema,
	productReviewSchema,
} from "@/schemas/review.schema";

const reviewRouter: Router = Router();

// Định tuyến API lấy tất cả đánh giá với phân trang và tìm kiếm
reviewRouter
	.route("/")
	.get(validateRequest(reviewFilterSchema), getAllReviews)
	.post(validateRequest(createReviewSchema), createReview);

// Định tuyến API lấy các đánh giá của một sản phẩm cụ thể với phân trang và tìm kiếm
reviewRouter
	.route("/product/:productId")
	.get(validateRequest(productReviewSchema), getReviewsByProduct);

export { reviewRouter };
