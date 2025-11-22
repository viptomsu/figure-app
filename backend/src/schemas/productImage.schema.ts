import { z } from "zod";

export const createProductImageSchema = z.object({
	params: z.object({
		productId: z.uuid({ message: "ID sản phẩm không hợp lệ" }),
	}),
});

export const updateProductImageSchema = z.object({
	params: z.object({
		imageId: z.uuid({ message: "ID hình ảnh không hợp lệ" }),
	}),
});

export const changeDefaultImageSchema = z.object({
	params: z.object({
		imageId: z.uuid({ message: "ID hình ảnh không hợp lệ" }),
	}),
	query: z.object({
		isDefault: z.enum(["true", "false"]),
	}),
});

export const productImageIdSchema = z.object({
	params: z.object({
		imageId: z.uuid({ message: "ID hình ảnh không hợp lệ" }),
	}),
});

export const productIdSchema = z.object({
	params: z.object({
		productId: z.uuid({ message: "ID sản phẩm không hợp lệ" }),
	}),
});
