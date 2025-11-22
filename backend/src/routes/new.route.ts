// new.router.ts
import { Router } from "express";
import {
	getAllNews,
	getNewById,
	createNew,
	updateNew,
	deleteNew,
} from "@/controllers/new.controller";
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createNewSchema,
	updateNewSchema,
	newFilterSchema,
	newIdSchema,
} from "@/schemas/new.schema";
import multer, { Multer, StorageEngine } from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const newRouter: Router = Router();

// Lấy tất cả bản tin và tạo bản tin mới (có kiểm tra quyền)
newRouter
	.route("/")
	.get(validateRequest(newFilterSchema), getAllNews) // Lấy danh sách bản tin
	.post(
		checkAuth,
		upload.single("image"),
		validateRequest(createNewSchema),
		createNew
	); // Tạo bản tin mới

// Lấy bản tin theo ID, cập nhật và xóa bản tin (có kiểm tra quyền)
newRouter
	.route("/:id")
	.get(validateRequest(newIdSchema), getNewById) // Lấy thông tin bản tin theo ID
	.put(
		checkAuth,
		upload.single("image"),
		validateRequest(updateNewSchema),
		updateNew
	) // Cập nhật bản tin
	.delete(checkAuth, validateRequest(newIdSchema), deleteNew); // Xóa bản tin

export { newRouter };
