// user.router.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/user.controller.js";
import multer from "multer";
import { checkAuth } from "../middlewares/auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers) // Lấy danh sách người dùng
  .post(upload.single("avatar"), createUser); // Tạo mới người dùng

userRouter.get('/me', checkAuth, getCurrentUser); // Lấy thông tin người dùng hiện tại

userRouter
  .route("/:id")
  .get(getUserById) // Lấy người dùng theo ID
  .put(upload.single("avatar"), updateUser) // Cập nhật người dùng
  .delete(deleteUser); // Xóa người dùng

userRouter.put("/:id/change-password", changePassword); // Đổi mật khẩu

export { userRouter };
