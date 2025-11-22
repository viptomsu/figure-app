// brand.router.ts
import { Router } from "express";
import {
	createBrand,
	updateBrand,
	deleteBrand,
	getAllBrands,
	getBrandById,
} from "@/controllers/brand.controller";
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createBrandSchema,
	updateBrandSchema,
	brandFilterSchema,
	brandIdSchema,
} from "@/schemas/brand.schema";
import multer, { Multer, StorageEngine } from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const brandRouter: Router = Router();

// Lấy tất cả thương hiệu và tạo thương hiệu mới (có kiểm tra quyền)
brandRouter
	.route("/")
	.get(validateRequest(brandFilterSchema), getAllBrands) // Lấy danh sách thương hiệu
	.post(
		checkAuth,
		upload.single("image"),
		validateRequest(createBrandSchema),
		createBrand
	); // Tạo thương hiệu mới

// Lấy thương hiệu theo ID, cập nhật và xóa thương hiệu (có kiểm tra quyền)
brandRouter
	.route("/:id")
	.get(validateRequest(brandIdSchema), getBrandById) // Lấy thông tin thương hiệu theo ID
	.put(
		checkAuth,
		upload.single("image"),
		validateRequest(updateBrandSchema),
		updateBrand
	) // Cập nhật thương hiệu
	.delete(checkAuth, validateRequest(brandIdSchema), deleteBrand); // Xóa thương hiệu

export { brandRouter };
