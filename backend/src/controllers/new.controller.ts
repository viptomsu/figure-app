import { Request, Response } from "express";
import { New } from "@prisma/client";
import { ApiResponse } from "@/utils/ApiResponse";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import {
	PaginationQuery,
	IdParam,
	CreateNewBody,
	UpdateNewBody,
	PaginatedResponse,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

// Lấy tất cả các bản tin với phân trang, tìm kiếm và lọc bản tin chưa bị xóa
export const getAllNews = async (
	req: Request<{}, any, any, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query as any;
		const skip: number = (page - 1) * limit;

		const query: any = { isDeleted: false };
		if (keyword) {
			query.title = { contains: keyword, mode: "insensitive" };
		}

		const news: New[] = await prisma.new.findMany({
			where: query,
			skip,
			take: limit,
		});
		const totalElements: number = await prisma.new.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<New> = {
			content: news,
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
					"Lấy danh sách bản tin thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách bản tin"));
	}
};

// Lấy bản tin theo ID
export const getNewById = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const newsItem: New | null = await prisma.new.findFirst({
			where: { id, isDeleted: false },
		});

		if (!newsItem) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, newsItem, "Lấy bản tin thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy bản tin theo ID"));
	}
};

// Tạo bản tin mới
export const createNew = async (
	req: Request<{}, any, CreateNewBody>,
	res: Response
): Promise<void> => {
	try {
		const { title, content } = req.body;
		const imageFile = req.file;

		let newsData: any = {
			title,
			content,
			isDeleted: false,
		};

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/news"
			);
			newsData.image = imageUrl;
		}

		const savedNew: New = await prisma.new.create({ data: newsData });
		res
			.status(201)
			.json(new ApiResponse(201, savedNew, "Tạo bản tin thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo bản tin"));
	}
};

// Cập nhật bản tin
export const updateNew = async (
	req: Request<IdParam, any, UpdateNewBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const { title, content } = req.body;
		const imageFile = req.file;

		const newsItem: New | null = await prisma.new.findUnique({ where: { id } });
		if (!newsItem || newsItem.isDeleted) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
		}

		const updateData: any = {};
		if (title !== undefined) updateData.title = title;
		if (content !== undefined) updateData.content = content;

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/news"
			);
			updateData.image = imageUrl;
		}

		const updatedNew: New = await prisma.new.update({
			where: { id },
			data: updateData,
		});
		res
			.status(200)
			.json(new ApiResponse(200, updatedNew, "Cập nhật bản tin thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi cập nhật bản tin"));
	}
};

// Xóa bản tin (đánh dấu isDeleted là true)
export const deleteNew = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		const newsItem: New | null = await prisma.new.findUnique({ where: { id } });
		if (!newsItem || newsItem.isDeleted) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
		}

		await prisma.new.update({ where: { id }, data: { isDeleted: true } });

		res.status(200).json(new ApiResponse(200, null, "Xóa bản tin thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa bản tin"));
	}
};
