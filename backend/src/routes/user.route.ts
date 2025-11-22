// user.router.ts
import { Router } from "express";
import {
	getAllUsers,
	getUserById,
	getCurrentUser,
	createUser,
	updateUser,
	deleteUser,
	changePassword,
} from "@/controllers/user.controller";
import multer, { Multer, StorageEngine } from "multer";
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createUserSchema,
	updateUserSchema,
	changePasswordSchema,
	userIdSchema,
} from "@/schemas/user.schema";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const userRouter: Router = Router();

userRouter
	.route("/")
	.get(getAllUsers) // Lấy danh sách người dùng
	.post(upload.single("avatar"), validateRequest(createUserSchema), createUser); // Tạo mới người dùng

userRouter.get("/me", checkAuth, getCurrentUser); // Lấy thông tin người dùng hiện tại

userRouter
	.route("/:id")
	.get(validateRequest(userIdSchema), getUserById) // Lấy người dùng theo ID
	.put(upload.single("avatar"), validateRequest(updateUserSchema), updateUser) // Cập nhật người dùng
	.delete(validateRequest(userIdSchema), deleteUser); // Xóa người dùng

userRouter.put(
	"/:id/change-password",
	validateRequest(changePasswordSchema),
	changePassword
); // Đổi mật khẩu

export { userRouter };
