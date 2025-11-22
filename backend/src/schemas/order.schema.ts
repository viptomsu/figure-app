import { z } from "zod";
import { paginationSchema } from "./common.schema";

export const createOrderSchema = z.object({
	body: z.object({
		code: z.string().min(1, "Mã đơn hàng là bắt buộc"),
		date: z.string().optional(), // Will be parsed in controller or here if we want to coerce
		note: z.string().optional(),
		paymentMethod: z.enum(["COD", "VNPAY", "BANK_TRANSFER"]).optional(),
		totalPrice: z.number().min(0, "Tổng tiền phải lớn hơn hoặc bằng 0"),
		discount: z.number().min(0, "Giảm giá phải lớn hơn hoặc bằng 0").default(0),
		user: z.object({
			userId: z.uuid({ message: "ID người dùng không hợp lệ" }),
		}),
		addressBook: z.object({
			addressBookId: z.uuid({ message: "ID địa chỉ không hợp lệ" }),
		}),
		status: z
			.enum([
				"PENDING",
				"CONFIRMED",
				"PACKED",
				"SHIPPING",
				"DELIVERED",
				"CANCELLED",
				"RETURNED",
			])
			.optional()
			.default("PENDING"),
		orderDetails: z
			.array(
				z.object({
					product: z.object({
						productId: z.uuid({ message: "ID sản phẩm không hợp lệ" }),
					}),
					productVariation: z
						.object({
							variationId: z.uuid({ message: "ID biến thể không hợp lệ" }),
						})
						.optional()
						.nullable(),
					quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0"),
					price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
				})
			)
			.min(1, "Đơn hàng phải có ít nhất một sản phẩm"),
	}),
});

export const orderFilterSchema = z.object({
	query: paginationSchema.extend({
		code: z.string().optional(),
		status: z.string().optional(),
		method: z.string().optional(),
	}),
});

export const userOrderFilterSchema = z.object({
	params: z.object({
		userId: z.uuid({ message: "ID người dùng không hợp lệ" }),
	}),
	query: paginationSchema,
});

export const changeOrderStatusSchema = z.object({
	params: z.object({
		orderId: z.uuid({ message: "ID đơn hàng không hợp lệ" }),
	}),
	body: z.object({
		status: z.enum([
			"PENDING",
			"CONFIRMED",
			"PACKED",
			"SHIPPING",
			"DELIVERED",
			"CANCELLED",
			"RETURNED",
		]),
	}),
});
