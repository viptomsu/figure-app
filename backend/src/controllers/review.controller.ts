// review.controller.ts
import { prisma } from "@/db/prisma.client";
import { Review } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from "express";
import {
	PaginationQuery,
	CreateReviewBody,
	ProductIdParam,
	PaginatedResponse,
} from "@/types/request.types";

// Lấy tất cả các đánh giá với phân trang và tìm kiếm
export const getAllReviews = async (
	req: Request<{}, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { searchText, page = 1, limit = 10 } = req.query as any;
		const skip: number = (page - 1) * limit;

		// Tìm kiếm theo từ khóa nếu có
		const query: any = {};
		if (searchText) {
			query.reviewText = { contains: searchText, mode: "insensitive" };
		}

		const reviews: Review[] = await prisma.review.findMany({
			where: query,
			skip,
			take: limit,
			include: { user: true, product: true },
		});
		const totalElements: number = await prisma.review.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<Review> = {
			content: reviews,
			page,
			limit,
			totalElements,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, paginationResponse, "Lấy đánh giá thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đánh giá"));
	}
};

// Lấy các đánh giá của một sản phẩm cụ thể với phân trang và tìm kiếm
export const getReviewsByProduct = async (
	req: Request<ProductIdParam, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { productId } = req.params;
		const { searchText, page = 1, limit = 10 } = req.query as any;
		const skip: number = (page - 1) * limit;

		const query: any = { productId };
		if (searchText) {
			query.reviewText = { contains: searchText, mode: "insensitive" };
		}

		const reviews: Review[] = await prisma.review.findMany({
			where: query,
			skip,
			take: limit,
			include: { user: true, product: true },
		});
		const totalElements: number = await prisma.review.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<Review> = {
			content: reviews,
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
					"Lấy đánh giá của sản phẩm thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy đánh giá của sản phẩm"));
	}
};

// Tạo đánh giá mới
export const createReview = async (
	req: Request<ProductIdParam, {}, CreateReviewBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { productId } = req.params;
		const { userId, reviewText, rating } = req.body;

		const review = await prisma.review.create({
			data: {
				productId,
				userId,
				reviewText,
				rating,
				reviewDate: new Date(),
			},
			include: { user: true, product: true },
		});

		res
			.status(201)
			.json(new ApiResponse(201, review, "Tạo đánh giá thành công"));
	} catch (error: any) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2003"
		) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "Invalid product ID or user ID"));
		}
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo đánh giá"));
	}
};
