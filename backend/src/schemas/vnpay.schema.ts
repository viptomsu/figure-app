import { z } from "zod";

export const createVNPayOrderSchema = z.object({
	query: z.object({
		amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
		orderInfo: z.string().min(1, "Thông tin đơn hàng là bắt buộc"),
		returnUrl: z.url({ message: "URL trả về không hợp lệ" }),
	}),
});

export const vnpayReturnSchema = z.object({
	query: z
		.object({
			vnp_Amount: z.string().optional(),
			vnp_BankCode: z.string().optional(),
			vnp_BankTranNo: z.string().optional(),
			vnp_CardType: z.string().optional(),
			vnp_OrderInfo: z.string().optional(),
			vnp_PayDate: z.string().optional(),
			vnp_ResponseCode: z.string().optional(),
			vnp_TmnCode: z.string().optional(),
			vnp_TransactionNo: z.string().optional(),
			vnp_TransactionStatus: z.string().optional(),
			vnp_TxnRef: z.string().optional(),
			vnp_SecureHash: z.string().optional(),
		})
		.passthrough(), // Allow other params if VNPay adds more
});
