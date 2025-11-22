import { Router } from "express";
import {
	createCategory,
	updateCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
} from "@/controllers/category.controller"; // Sử dụng một controller duy nhất
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createCategorySchema,
	updateCategorySchema,
	categoryFilterSchema,
	categoryIdSchema,
} from "@/schemas/category.schema";
import multer, { Multer, StorageEngine } from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const categoryRouter: Router = Router();

// Lấy tất cả danh mục và tạo danh mục mới (có kiểm tra quyền)
categoryRouter
	.route("/")
	.get(validateRequest(categoryFilterSchema), getAllCategories) // Lấy danh sách danh mục
	.post(
		checkAuth,
		upload.single("image"),
		validateRequest(createCategorySchema),
		createCategory
	); // Tạo danh mục mới

// Lấy danh mục theo ID, cập nhật và xóa danh mục (có kiểm tra quyền)
categoryRouter
	.route("/:id")
	.get(validateRequest(categoryIdSchema), getCategoryById) // Lấy thông tin danh mục theo ID
	.put(
		checkAuth,
		upload.single("image"),
		validateRequest(updateCategorySchema),
		updateCategory
	) // Cập nhật danh mục
	.delete(checkAuth, validateRequest(categoryIdSchema), deleteCategory); // Xóa danh mục

export { categoryRouter };
