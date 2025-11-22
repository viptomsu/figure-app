import { z } from "zod";
import { paginationSchema, idSchema } from "./common.schema";

const newBaseSchema = z.object({
	title: z.string().min(1, "Tiêu đề là bắt buộc"),
	content: z.string().min(1, "Nội dung là bắt buộc"),
});

export const createNewSchema = z.object({
	body: newBaseSchema,
});

export const updateNewSchema = z.object({
	params: idSchema.shape.params,
	body: newBaseSchema.partial(),
});

export const newFilterSchema = z.object({
	query: paginationSchema.extend({
		keyword: z.string().optional(),
	}),
});

export const newIdSchema = idSchema;
