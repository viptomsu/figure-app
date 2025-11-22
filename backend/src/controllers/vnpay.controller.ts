import { Request, Response } from "express";
import { createOrderService, orderReturnService } from "@/config/vnpayService";
import { VNPayPaymentQuery } from "@/types/request.types";

// Controller để tạo URL thanh toán VNPay
export const createOrder = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { amount, orderInfo, returnUrl } =
			req.query as unknown as VNPayPaymentQuery;

		// amount is already coerced to number by Zod schema if using validateRequest
		// But req.query types might still be string | ParsedQs depending on Express types
		// However, validateRequest replaces req.query with validated data
		const paymentUrl: string = await createOrderService(
			req,
			Number(amount),
			orderInfo,
			returnUrl
		);
		res.status(200).send(paymentUrl); // Trả về URL dưới dạng chuỗi
	} catch (error) {
		console.error("Error creating payment URL:", error);
		res.status(500).send("Failed to create payment URL"); // Trả về chuỗi thông báo lỗi
	}
};

// Controller để xử lý phản hồi thanh toán từ VNPay
export const orderReturn = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const result: number = await orderReturnService(req);
		switch (result) {
			case 1:
				res
					.status(200)
					.json({ status: "SUCCESS", message: "Giao dịch thành công!" });
				break;
			case 0:
				res
					.status(400)
					.json({ status: "FAILED", message: "Giao dịch thất bại!" });
				break;
			default:
				res
					.status(400)
					.json({ status: "INVALID", message: "Giao dịch không hợp lệ!" });
				break;
		}
	} catch (error) {
		console.error("Error handling payment return:", error);
		res
			.status(500)
			.json({ status: "ERROR", message: "Failed to handle payment return" });
	}
};
