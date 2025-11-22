// category.controller.ts
import { Category } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import { Request, Response } from "express";
import {
	PaginationQuery,
	CreateCategoryBody,
	UpdateCategoryBody,
	IdParam,
	PaginatedResponse,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

export const getAllCategories = async (
	req: Request<{}, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query as any;
		const skip: number = (page - 1) * limit;

		// Lọc danh mục chưa bị xóa và tìm kiếm theo từ khóa
		const query: any = { isDelete: false };
		if (keyword) {
			query.categoryName = { contains: keyword, mode: "insensitive" };
		}

		const categories: Category[] = await prisma.category.findMany({
			where: query,
			skip,
			take: limit,
		});
		const totalElements: number = await prisma.category.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<Category> = {
			content: categories,
			page,
			limit,
			totalElements,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, paginationResponse, "Lấy danh mục thành công")
			);
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh mục"));
	}
};

export const getCategoryById = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const category: Category | null = await prisma.category.findFirst({
			where: { id, isDelete: false },
		});

		if (!category) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, category, "Lấy danh mục thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh mục theo ID"));
	}
};

export const createCategory = async (
	req: Request<{}, {}, CreateCategoryBody>,
	res: Response
): Promise<void> => {
	try {
		const { categoryName, description } = req.body;
		const imageFile: Express.Multer.File | undefined = req.file;

		let categoryData: any = {
			categoryName,
			description,
			isDelete: false,
		};

		// Kiểm tra nếu có tệp ảnh
		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/categories"
			);
			categoryData.image = imageUrl;
		}

		const savedCategory: Category = await prisma.category.create({
			data: categoryData,
		});
		res
			.status(201)
			.json(new ApiResponse(201, savedCategory, "Tạo danh mục thành công"));
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
			res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo danh mục"));
		}
	}
};

export const updateCategory = async (
	req: Request<IdParam, {}, UpdateCategoryBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const { categoryName, description } = req.body;
		const imageFile: Express.Multer.File | undefined = req.file;

		const category: Category | null = await prisma.category.findUnique({
			where: { id },
		});
		if (!category || category.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
		}

		const updateData: any = {};
		if (categoryName !== undefined) updateData.categoryName = categoryName;
		if (description !== undefined) updateData.description = description;

		// Tải ảnh mới lên Cloudinary nếu có
		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/categories"
			);
			updateData.image = imageUrl;
		}

		const updatedCategory: Category = await prisma.category.update({
			where: { id },
			data: updateData,
		});
		res
			.status(200)
			.json(
				new ApiResponse(200, updatedCategory, "Cập nhật danh mục thành công")
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
				.json(new ApiResponse(500, null, "Lỗi khi cập nhật danh mục"));
		}
	}
};

export const deleteCategory = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		const category: Category | null = await prisma.category.findUnique({
			where: { id },
		});
		if (!category || category.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
		}

		// Đánh dấu danh mục là đã xóa
		await prisma.category.update({ where: { id }, data: { isDelete: true } });

		res.status(200).json(new ApiResponse(200, null, "Xóa danh mục thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa danh mục"));
	}
};
