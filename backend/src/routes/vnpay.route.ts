import { Router } from "express";
import { createOrder, orderReturn } from "@/controllers/vnpay.controller"; // Đảm bảo import controller chính xác
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createVNPayOrderSchema,
	vnpayReturnSchema,
} from "@/schemas/vnpay.schema";

const vnpayRouter: Router = Router();

// Route tạo URL thanh toán VNPay
vnpayRouter.get(
	"/payment",
	validateRequest(createVNPayOrderSchema),
	createOrder
);

// Route xử lý khi VNPay trả về kết quả thanh toán
vnpayRouter.get(
	"/paymentReturn",
	validateRequest(vnpayReturnSchema),
	orderReturn
);

export { vnpayRouter };
