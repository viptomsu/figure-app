import { Router, Request, Response } from "express";
import multer, { Multer, StorageEngine } from "multer";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts, // Thêm hàm controller cho route mới
} from "../controllers/product.controller.js";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const productRouter: Router = Router();

productRouter
  .route("/")
  .get(getAllProducts) // Lấy danh sách sản phẩm
  .post(upload.array("images"), createProduct); // Tạo sản phẩm mới

productRouter.route("/filtered").get(getFilteredProducts); // Lấy danh sách sản phẩm với bộ lọc

productRouter
  .route("/:id")
  .get(getProductById) // Lấy chi tiết sản phẩm
  .put(upload.array("images"), updateProduct) // Cập nhật sản phẩm
  .delete(deleteProduct); // Xóa sản phẩm

export { productRouter };