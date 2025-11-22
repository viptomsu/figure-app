import { z } from "zod";
import { paginationSchema, idSchema } from "./common.schema";

const brandBaseSchema = z.object({
	brandName: z.string().min(1, "Tên thương hiệu là bắt buộc"),
	description: z.string().optional(),
});

export const createBrandSchema = z.object({
	body: brandBaseSchema,
});

export const updateBrandSchema = z.object({
	params: idSchema.shape.params,
	body: brandBaseSchema.partial(),
});

export const brandFilterSchema = z.object({
	query: paginationSchema.extend({
		keyword: z.string().optional(),
	}),
});

export const brandIdSchema = idSchema;
