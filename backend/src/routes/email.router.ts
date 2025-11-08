// email.router.ts
import { Router, Request, Response } from "express";
import { sendOrderConfirmationEmail } from "../controllers/email.controller.js";

const emailRouter: Router = Router();

// Định nghĩa route để gửi email xác nhận đơn hàng
emailRouter.post("/sendOrderConfirmation", sendOrderConfirmationEmail);

export { emailRouter };