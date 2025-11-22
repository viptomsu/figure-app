import { z } from "zod";
import { paginationSchema } from "./common.schema";

export const createReviewSchema = z.object({
	body: z.object({
		productId: z.uuid({ message: "ID sản phẩm không hợp lệ" }),
		userId: z.uuid({ message: "ID người dùng không hợp lệ" }),
		reviewText: z.string().min(1, "Nội dung đánh giá là bắt buộc"),
		rating: z
			.number()
			.int()
			.min(1, "Đánh giá tối thiểu là 1 sao")
			.max(5, "Đánh giá tối đa là 5 sao"),
	}),
});

export const reviewFilterSchema = z.object({
	query: paginationSchema.extend({
		searchText: z.string().optional(),
	}),
});

export const productReviewSchema = z.object({
	params: z.object({
		productId: z.uuid({ message: "ID sản phẩm không hợp lệ" }),
	}),
	query: paginationSchema.extend({
		searchText: z.string().optional(),
	}),
});
