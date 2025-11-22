import { Router } from "express";
import {
	register,
	login,
	forgotPassword,
	resetPassword,
} from "@/controllers/auth.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	registerSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} from "@/schemas/auth.schema";

const authRouter: Router = Router();

// Route đăng ký người dùng mới
authRouter.post("/register", validateRequest(registerSchema), register);

// Route đăng nhập người dùng
authRouter.post("/login", validateRequest(loginSchema), login);

// Route yêu cầu đặt lại mật khẩu
authRouter.post(
	"/forgot-password",
	validateRequest(forgotPasswordSchema),
	forgotPassword
);

// Route đặt lại mật khẩu
authRouter.post(
	"/reset-password",
	validateRequest(resetPasswordSchema),
	resetPassword
);

export { authRouter };
