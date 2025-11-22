// voucher.router.ts
import { Router } from "express";
import {
	getAllVouchers,
	createVoucher,
	updateVoucher,
	deleteVoucher,
	markVoucherAsUsed,
	checkVoucherCode,
	changeVoucherStatus,
} from "@/controllers/voucher.controller";
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createVoucherSchema,
	updateVoucherSchema,
	voucherFilterSchema,
	voucherIdSchema,
	voucherCodeSchema,
} from "@/schemas/voucher.schema";

const voucherRouter: Router = Router();

// Lấy tất cả voucher và tạo voucher mới
voucherRouter
	.route("/")
	.get(validateRequest(voucherFilterSchema), getAllVouchers) // Lấy danh sách voucher với phân trang và tìm kiếm
	.post(checkAuth, validateRequest(createVoucherSchema), createVoucher); // Tạo voucher mới (yêu cầu quyền truy cập)

// Lấy, cập nhật, và xóa voucher theo ID
voucherRouter
	.route("/:id")
	.put(checkAuth, validateRequest(updateVoucherSchema), updateVoucher) // Cập nhật voucher
	.delete(checkAuth, validateRequest(voucherIdSchema), deleteVoucher); // Xóa voucher

// Đánh dấu voucher là đã sử dụng
voucherRouter
	.route("/:id/mark-as-used")
	.put(checkAuth, validateRequest(voucherIdSchema), markVoucherAsUsed); // Đánh dấu voucher đã sử dụng (yêu cầu quyền truy cập)

// Kiểm tra mã voucher
voucherRouter
	.route("/check/:code")
	.get(validateRequest(voucherCodeSchema), checkVoucherCode); // Kiểm tra mã voucher có hợp lệ không

// Thay đổi trạng thái sử dụng của voucher (toggle)
voucherRouter
	.route("/:id/change-status")
	.put(checkAuth, validateRequest(voucherIdSchema), changeVoucherStatus); // Thay đổi trạng thái sử dụng của voucher (yêu cầu quyền truy cập)

export { voucherRouter };
