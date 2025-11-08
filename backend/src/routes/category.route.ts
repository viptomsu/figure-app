import { Router, Request, Response } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/category.controller.js"; // Sử dụng một controller duy nhất
import { checkAuth } from "../middlewares/auth.middleware.js";
import multer, { Multer, StorageEngine } from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const categoryRouter: Router = Router();

// Lấy tất cả danh mục và tạo danh mục mới (có kiểm tra quyền)
categoryRouter
  .route("/")
  .get(getAllCategories) // Lấy danh sách danh mục
  .post(checkAuth, upload.single("image"), createCategory); // Tạo danh mục mới

// Lấy danh mục theo ID, cập nhật và xóa danh mục (có kiểm tra quyền)
categoryRouter
  .route("/:id")
  .get(getCategoryById) // Lấy thông tin danh mục theo ID
  .put(checkAuth, upload.single("image"), updateCategory) // Cập nhật danh mục
  .delete(checkAuth, deleteCategory); // Xóa danh mục

export { categoryRouter };