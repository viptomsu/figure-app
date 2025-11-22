import { z } from "zod";

export const dailyRevenueQuerySchema = z.object({
	query: z.object({
		startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
			message: "Ngày bắt đầu không hợp lệ",
		}),
		endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
			message: "Ngày kết thúc không hợp lệ",
		}),
	}),
});
