import { z } from "zod";

export const paginationSchema = z.object({
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().optional().default(10),
});

export const idSchema = z.object({
	params: z.object({
		id: z.uuid({ message: "ID không hợp lệ" }),
	}),
});

export const booleanQuery = z
	.enum(["true", "false"])
	.transform((value) => value === "true");
