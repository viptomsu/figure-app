import { Router, Request, Response } from "express";
import multer, { Multer, StorageEngine } from "multer";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const authRouter: Router = Router();

// Cấu hình multer trực tiếp
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({
  storage: storage, // Sử dụng bộ nhớ trong RAM để lưu file tạm thời
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
});

// Route đăng ký người dùng mới
authRouter.post("/register", register);

// Route đăng nhập người dùng
authRouter.post("/login", login);

// Route yêu cầu đặt lại mật khẩu
authRouter.post("/forgot-password", forgotPassword);

// Route đặt lại mật khẩu
authRouter.post("/reset-password", resetPassword);

export { authRouter };