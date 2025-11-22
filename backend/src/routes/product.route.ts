import { Router } from "express";
import multer, { Multer, StorageEngine } from "multer";
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getFilteredProducts,
} from "@/controllers/product.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createProductSchema,
	updateProductSchema,
	productFilterSchema,
	productIdSchema,
} from "@/schemas/product.schema";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const productRouter: Router = Router();

productRouter
	.route("/")
	.get(validateRequest(productFilterSchema), getAllProducts) // Lấy danh sách sản phẩm
	.post(
		upload.array("images"),
		validateRequest(createProductSchema),
		createProduct
	); // Tạo sản phẩm mới

productRouter
	.route("/filtered")
	.get(validateRequest(productFilterSchema), getFilteredProducts); // Lấy danh sách sản phẩm với bộ lọc

productRouter
	.route("/:id")
	.get(validateRequest(productIdSchema), getProductById) // Lấy chi tiết sản phẩm
	.put(
		upload.array("images"),
		validateRequest(updateProductSchema),
		updateProduct
	) // Cập nhật sản phẩm
	.delete(validateRequest(productIdSchema), deleteProduct); // Xóa sản phẩm

export { productRouter };
