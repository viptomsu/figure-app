// email.router.ts
import { Router } from "express";
import { sendOrderConfirmationEmail } from "@/controllers/email.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import { sendOrderConfirmationSchema } from "@/schemas/email.schema";

const emailRouter: Router = Router();

// Định nghĩa route để gửi email xác nhận đơn hàng
emailRouter.post(
	"/sendOrderConfirmation",
	validateRequest(sendOrderConfirmationSchema),
	sendOrderConfirmationEmail
);

export { emailRouter };
