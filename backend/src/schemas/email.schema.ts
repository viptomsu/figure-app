import { z } from "zod";

export const sendOrderConfirmationSchema = z.object({
	query: z.object({
		orderCode: z.string().min(1, "Mã đơn hàng là bắt buộc"),
	}),
});
