import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "@/utils/ApiResponse";

export const validateRequest =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = (await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			})) as any;

			req.body = validatedData.body;
			req.query = validatedData.query;
			req.params = validatedData.params;

			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = (error as any).issues.map((err: any) => ({
					field: err.path.join("."),
					message: err.message,
				}));
				return res
					.status(400)
					.json(new ApiResponse(400, errorMessages, "Dữ liệu không hợp lệ"));
			}
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Lỗi xác thực dữ liệu"));
		}
	};
