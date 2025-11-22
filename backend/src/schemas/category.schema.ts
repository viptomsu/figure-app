import { z } from "zod";
import { paginationSchema, idSchema } from "./common.schema";

const categoryBaseSchema = z.object({
	categoryName: z.string().min(1, "Tên danh mục là bắt buộc"),
	description: z.string().optional(),
});

export const createCategorySchema = z.object({
	body: categoryBaseSchema,
});

export const updateCategorySchema = z.object({
	params: idSchema.shape.params,
	body: categoryBaseSchema.partial(),
});

export const categoryFilterSchema = z.object({
	query: paginationSchema.extend({
		keyword: z.string().optional(),
	}),
});

export const categoryIdSchema = idSchema;
