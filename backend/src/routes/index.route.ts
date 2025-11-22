import express, { Router, Request, Response } from "express";
import { categoryRouter } from "@/routes/category.route";
import { authRouter } from "@/routes/auth.route";
import { userRouter } from "@/routes/user.route";
import { brandRouter } from "@/routes/brand.route";
import { newRouter } from "@/routes/new.route";
import { voucherRouter } from "@/routes/voucher.route";
import { reviewRouter } from "@/routes/review.route";
import { productRouter } from "@/routes/product.route";
import { productImageRouter } from "@/routes/productImage.route";
import { orderRouter } from "@/routes/order.route";
import { addressBookRouter } from "@/routes/addressBook.route";
import { emailRouter } from "@/routes/email.route";
import { vnpayRouter } from "@/routes/vnpay.route";
import { revenueRouter } from "@/routes/revenue.route";

const indexRouter: Router = express.Router();

// Health check route
indexRouter.get("/", (_req: Request, res: Response) => {
	res.json({
		message: "Figure Backend API is running!",
		timestamp: new Date().toISOString(),
		status: "OK",
	});
});

indexRouter.use("/api/categories", categoryRouter);
indexRouter.use("/api/auth", authRouter);
indexRouter.use("/api/users", userRouter);
indexRouter.use("/api/brands", brandRouter);
indexRouter.use("/api/news", newRouter);
indexRouter.use("/api/vouchers", voucherRouter);
indexRouter.use("/api/reviews", reviewRouter);
indexRouter.use("/api/products", productRouter);
indexRouter.use("/api/products/:productId/images", productImageRouter);
indexRouter.use("/api/orders", orderRouter);
indexRouter.use("/api/addressbook", addressBookRouter);
indexRouter.use("/api/email", emailRouter);
indexRouter.use("/api/vnpay", vnpayRouter);
indexRouter.use("/api/revenue", revenueRouter);

export { indexRouter };
