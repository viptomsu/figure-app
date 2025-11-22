import { z } from "zod";
import { paginationSchema, idSchema, booleanQuery } from "./common.schema";

const productVariationSchema = z
	.object({
		attributeName: z.string(),
		attributeValue: z.string(),
		price: z.coerce.number().min(0),
		quantity: z.coerce.number().int().min(0),
	})
	.passthrough();

const variationsStringSchema = z
	.string()
	.optional()
	.transform((str, ctx) => {
		if (!str) return undefined;
		try {
			const parsed = JSON.parse(str);
			if (!Array.isArray(parsed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Variations must be an array",
				});
				return z.NEVER;
			}
			const result = z.array(productVariationSchema).safeParse(parsed);
			if (!result.success) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Invalid variation data",
				});
				return z.NEVER;
			}
			return result.data;
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Invalid JSON for variations",
			});
			return z.NEVER;
		}
	});

const productBaseSchema = z.object({
	productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
	price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
	description: z.string().optional(),
	discount: z.coerce.number().min(0).max(100).optional().default(0),
	badge: z.string().optional(),
	stock: z.coerce.number().int().min(0, "Tồn kho phải lớn hơn hoặc bằng 0"),
	isNewProduct: z.coerce.boolean().optional().default(false),
	isSale: z.coerce.boolean().optional().default(false),
	isSpecial: z.coerce.boolean().optional().default(false),
	categoryId: z.uuid({ message: "ID danh mục không hợp lệ" }),
	brandId: z.uuid({ message: "ID thương hiệu không hợp lệ" }),
});

export const createProductSchema = z.object({
	body: productBaseSchema.extend({
		variations: variationsStringSchema.transform((val) => val || []), // Default to empty array for create
	}),
});

export const updateProductSchema = z.object({
	params: idSchema.shape.params,
	body: productBaseSchema.partial().extend({
		variations: variationsStringSchema,
	}),
});

export const productFilterSchema = z.object({
	query: paginationSchema.extend({
		search: z.string().optional(),
		categoryId: z.string().optional(),
		brandId: z.string().optional(),
		sortField: z
			.enum(["productName", "price", "stock", "createdAt", "updatedAt"])
			.optional()
			.default("productName"),
		sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
		isNewProduct: booleanQuery.optional(),
		isSale: booleanQuery.optional(),
		isSpecial: booleanQuery.optional(),
	}),
});

export const productIdSchema = idSchema;
