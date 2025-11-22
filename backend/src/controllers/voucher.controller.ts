// voucher.controller.ts
import { Voucher } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from "express";
import {
	PaginationQuery,
	CreateVoucherBody,
	UpdateVoucherBody,
	IdParam,
	VoucherCodeParam,
	PaginatedResponse,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

// Lấy tất cả các voucher
export const getAllVouchers = async (
	req: Request<{}, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query as any;
		const skip: number = (page - 1) * limit;

		// Tìm kiếm theo từ khóa
		const query: any = {};
		if (keyword) {
			query.code = { contains: keyword, mode: "insensitive" };
		}

		const vouchers: Voucher[] = await prisma.voucher.findMany({
			where: query,
			skip,
			take: limit,
		});
		const totalElements: number = await prisma.voucher.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<Voucher> = {
			content: vouchers,
			page,
			limit,
			totalElements,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					paginationResponse,
					"Lấy danh sách voucher thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách voucher"));
	}
};

// Tạo voucher mới
export const createVoucher = async (
	req: Request<{}, {}, CreateVoucherBody>,
	res: Response
): Promise<void> => {
	try {
		const { code, discount, expirationDate } = req.body;

		const savedVoucher: Voucher = await prisma.voucher.create({
			data: {
				code,
				discount,
				expirationDate: new Date(expirationDate),
				isUsed: false,
			},
		});
		res
			.status(201)
			.json(new ApiResponse(201, savedVoucher, "Tạo voucher thành công"));
	} catch (error: any) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res
				.status(409)
				.json(
					new ApiResponse(
						409,
						null,
						"Dữ liệu đã tồn tại, vui lòng kiểm tra các trường duy nhất"
					)
				);
		} else {
			res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo voucher"));
		}
	}
};

// Cập nhật voucher
export const updateVoucher = async (
	req: Request<IdParam, {}, UpdateVoucherBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const { code, discount, expirationDate } = req.body;

		const voucher: Voucher | null = await prisma.voucher.findUnique({
			where: { id },
		});
		if (!voucher) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy voucher"));
		}

		const updateData: any = {};
		if (code !== undefined) updateData.code = code;
		if (discount !== undefined) updateData.discount = discount;
		if (expirationDate !== undefined)
			updateData.expirationDate = new Date(expirationDate);

		const updatedVoucher: Voucher = await prisma.voucher.update({
			where: { id },
			data: updateData,
		});
		res
			.status(200)
			.json(
				new ApiResponse(200, updatedVoucher, "Cập nhật voucher thành công")
			);
	} catch (error: any) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res
				.status(409)
				.json(
					new ApiResponse(
						409,
						null,
						"Dữ liệu đã tồn tại, vui lòng kiểm tra các trường duy nhất"
					)
				);
		} else {
			res
				.status(500)
				.json(new ApiResponse(500, null, "Lỗi khi cập nhật voucher"));
		}
	}
};

// Xóa voucher (thực hiện xóa thật sự)
export const deleteVoucher = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		try {
			await prisma.voucher.delete({ where: { id } });
		} catch (error: any) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				return res
					.status(404)
					.json(new ApiResponse(404, null, "Không tìm thấy voucher"));
			}
			throw error;
		}

		res.status(200).json(new ApiResponse(200, null, "Xóa voucher thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa voucher"));
	}
};

// Đánh dấu voucher là đã sử dụng
export const markVoucherAsUsed = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		const voucher: Voucher | null = await prisma.voucher.findUnique({
			where: { id },
		});
		if (!voucher) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy voucher"));
		}

		const updatedVoucher: Voucher = await prisma.voucher.update({
			where: { id },
			data: { isUsed: true },
		});

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedVoucher,
					"Voucher đã được đánh dấu là đã sử dụng"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(
				new ApiResponse(500, null, "Lỗi khi đánh dấu voucher là đã sử dụng")
			);
	}
};

// Kiểm tra mã voucher
export const checkVoucherCode = async (
	req: Request<VoucherCodeParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { code } = req.params;

		const voucher: Voucher | null = await prisma.voucher.findFirst({
			where: {
				code,
				isUsed: false,
				expirationDate: { gt: new Date() },
			},
		});
		if (!voucher) {
			return res
				.status(404)
				.json(
					new ApiResponse(404, null, "Voucher không hợp lệ hoặc đã hết hạn")
				);
		}

		res.status(200).json(new ApiResponse(200, voucher, "Voucher hợp lệ"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi kiểm tra voucher"));
	}
};

// Thay đổi trạng thái sử dụng của voucher (toggle)
export const changeVoucherStatus = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		const voucher: Voucher | null = await prisma.voucher.findUnique({
			where: { id },
		});
		if (!voucher) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy voucher"));
		}

		const updatedVoucher: Voucher = await prisma.voucher.update({
			where: { id },
			data: { isUsed: !voucher.isUsed },
		});

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedVoucher,
					"Thay đổi trạng thái voucher thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi thay đổi trạng thái voucher"));
	}
};
