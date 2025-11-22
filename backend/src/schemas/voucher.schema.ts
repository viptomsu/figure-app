import { z } from "zod";
import { paginationSchema } from "./common.schema";

export const createVoucherSchema = z.object({
	body: z.object({
		code: z.string().min(1, "Mã voucher là bắt buộc"),
		discount: z.number().min(0, "Giảm giá phải lớn hơn hoặc bằng 0"),
		expirationDate: z.coerce.date({ message: "Ngày hết hạn không hợp lệ" }),
	}),
});

export const updateVoucherSchema = z.object({
	params: z.object({
		id: z.uuid({ message: "ID voucher không hợp lệ" }),
	}),
	body: z.object({
		code: z.string().optional(),
		discount: z.number().min(0).optional(),
		expirationDate: z.coerce.date().optional(),
	}),
});

export const voucherFilterSchema = z.object({
	query: paginationSchema.extend({
		keyword: z.string().optional(),
	}),
});

export const voucherIdSchema = z.object({
	params: z.object({
		id: z.uuid({ message: "ID voucher không hợp lệ" }),
	}),
});

export const voucherCodeSchema = z.object({
	params: z.object({
		code: z.string().min(1, "Mã voucher là bắt buộc"),
	}),
});
