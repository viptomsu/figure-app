// brand.controller.ts
import { Brand } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import { Request, Response } from "express";
import {
	PaginationQuery,
	CreateBrandBody,
	UpdateBrandBody,
	IdParam,
	PaginatedResponse,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

// Lấy tất cả các thương hiệu
export const getAllBrands = async (
	req: Request<{}, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query as any; // Assuming validation middleware has parsed page and limit to numbers and applied defaults
		const skip: number = (page - 1) * limit;

		const query: any = { isDelete: false };
		if (keyword) {
			query.brandName = { contains: keyword, mode: "insensitive" };
		}

		const brands: Brand[] = await prisma.brand.findMany({
			where: query,
			skip,
			take: limit,
		});
		const totalElements: number = await prisma.brand.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<Brand> = {
			content: brands,
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
					"Lấy danh sách thương hiệu thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách thương hiệu"));
	}
};

// Lấy thương hiệu theo ID
export const getBrandById = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params; // id is assumed to be validated by middleware
		const brand: Brand | null = await prisma.brand.findFirst({
			where: { id, isDelete: false },
		});

		if (!brand) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, brand, "Lấy thương hiệu thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy thương hiệu theo ID"));
	}
};

// Tạo thương hiệu mới
export const createBrand = async (
	req: Request<{}, {}, CreateBrandBody>,
	res: Response
): Promise<void> => {
	try {
		const { brandName, description } = req.body; // brandName and description are assumed to be validated by middleware
		const imageFile: Express.Multer.File | undefined = req.file;

		let brandData: any = {
			brandName,
			description,
			isDelete: false,
		};

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				true,
				imageFile.mimetype,
				"figure/brands"
			);
			brandData.image = imageUrl;
		}

		const savedBrand: Brand = await prisma.brand.create({ data: brandData });
		res
			.status(201)
			.json(new ApiResponse(201, savedBrand, "Tạo thương hiệu thành công"));
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
				.json(new ApiResponse(500, null, "Lỗi khi tạo thương hiệu"));
		}
	}
};

// Cập nhật thương hiệu
export const updateBrand = async (
	req: Request<IdParam, {}, UpdateBrandBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params; // id is assumed to be validated by middleware
		const { brandName, description } = req.body; // brandName and description are assumed to be validated by middleware
		const imageFile: Express.Multer.File | undefined = req.file;

		// The check for brand existence and isDelete status is still necessary as validation middleware
		// typically only validates the *format* of the input, not the *existence* or *state* of the resource.
		const brand: Brand | null = await prisma.brand.findUnique({
			where: { id },
		});
		if (!brand || brand.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
		}

		const updateData: any = {};
		// These checks are still needed because the body might not contain all fields,
		// and we only want to update what's provided. Validation middleware would ensure
		// that if a field *is* provided, it's in the correct format.
		if (brandName !== undefined) updateData.brandName = brandName;
		if (description !== undefined) updateData.description = description;

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				true,
				imageFile.mimetype,
				"figure/brands"
			);
			updateData.image = imageUrl;
		}

		const updatedBrand: Brand = await prisma.brand.update({
			where: { id },
			data: updateData,
		});
		res
			.status(200)
			.json(
				new ApiResponse(200, updatedBrand, "Cập nhật thương hiệu thành công")
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
				.json(new ApiResponse(500, null, "Lỗi khi cập nhật thương hiệu"));
		}
	}
};

// Xóa thương hiệu (đánh dấu isDelete là true)
export const deleteBrand = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params; // id is assumed to be validated by middleware

		// The check for brand existence and isDelete status is still necessary.
		const brand: Brand | null = await prisma.brand.findUnique({
			where: { id },
		});
		if (!brand || brand.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
		}

		await prisma.brand.update({ where: { id }, data: { isDelete: true } });

		res
			.status(200)
			.json(new ApiResponse(200, null, "Xóa thương hiệu thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa thương hiệu"));
	}
};
