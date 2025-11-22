// productImage.routes.ts
import { Router } from "express";
import {
	getProductImages,
	createProductImage,
	updateProductImage,
	deleteProductImage,
	changeDefaultImage,
} from "@/controllers/productImage.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createProductImageSchema,
	updateProductImageSchema,
	changeDefaultImageSchema,
	productImageIdSchema,
	productIdSchema,
} from "@/schemas/productImage.schema";
import multer, { Multer, StorageEngine } from "multer";

// Cấu hình multer để xử lý file upload
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const productImageRouter: Router = Router({ mergeParams: true });

// Route để lấy tất cả hình ảnh của một sản phẩm
productImageRouter.get("/", validateRequest(productIdSchema), getProductImages);

// Route để tạo hình ảnh sản phẩm mới
productImageRouter.post(
	"/",
	upload.single("image"),
	validateRequest(createProductImageSchema),
	createProductImage
);

// Route để cập nhật hình ảnh sản phẩm
productImageRouter.put(
	"/:imageId",
	upload.single("image"),
	validateRequest(updateProductImageSchema),
	updateProductImage
);

// Route để xóa hình ảnh sản phẩm
productImageRouter.delete(
	"/:imageId",
	validateRequest(productImageIdSchema),
	deleteProductImage
);

// Route để thay đổi trạng thái hình ảnh mặc định
productImageRouter.put(
	"/:imageId/default",
	validateRequest(changeDefaultImageSchema),
	changeDefaultImage
);

export { productImageRouter };
