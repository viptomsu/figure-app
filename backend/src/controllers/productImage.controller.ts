import { Request, Response } from "express";
import { prisma } from "@/db/prisma.client";
import { ProductImage } from "@prisma/client";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { ProductIdParam, ImageIdParam } from "@/types/request.types";

// Lấy tất cả hình ảnh của một sản phẩm
export const getProductImages = async (
	req: Request<ProductIdParam>,
	res: Response
): Promise<void> => {
	try {
		const { productId } = req.params;
		const images: ProductImage[] = await prisma.productImage.findMany({
			where: { productId },
		});

		const imageDTOs = images.map((image: ProductImage) => ({
			imageId: image.id,
			imageUrl: image.imageUrl,
			isDefault: image.isDefault,
		}));

		res
			.status(200)
			.json(
				new ApiResponse(200, imageDTOs, "Lấy hình ảnh sản phẩm thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy hình ảnh sản phẩm"));
	}
};

// Tạo hình ảnh sản phẩm mới và cập nhật Product
export const createProductImage = async (
	req: Request<ProductIdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { productId } = req.params;
		const imageFile = req.file;

		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
		}

		if (!imageFile) {
			return res
				.status(400)
				.json(
					new ApiResponse(400, null, "Không có file hình ảnh được tải lên")
				);
		}

		// Check if product has any existing images
		const existingImages = await prisma.productImage.findMany({
			where: { productId },
			take: 1,
		});

		// Set isDefault to true if this is the first image, otherwise false
		const isDefault = existingImages.length === 0;

		const imageUrl: string = await uploadImageToCloudinary(
			imageFile.buffer,
			imageFile.originalname,
			false,
			imageFile.mimetype,
			"figure/products"
		);

		const createdImage = await prisma.productImage.create({
			data: {
				productId,
				imageUrl,
				isDefault,
			},
		});

		const imageDTO = {
			imageId: createdImage.id,
			imageUrl: createdImage.imageUrl,
			isDefault: createdImage.isDefault,
		};

		res
			.status(201)
			.json(new ApiResponse(201, imageDTO, "Tạo hình ảnh sản phẩm thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi tạo hình ảnh sản phẩm"));
	}
};

// Cập nhật hình ảnh sản phẩm
export const updateProductImage = async (
	req: Request<ImageIdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { imageId } = req.params;
		const imageFile = req.file;

		const productImage = await prisma.productImage.findUnique({
			where: { id: imageId },
		});
		if (!productImage) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
		}

		if (!imageFile) {
			return res
				.status(400)
				.json(
					new ApiResponse(400, null, "Không có file hình ảnh được tải lên")
				);
		}

		const imageUrl: string = await uploadImageToCloudinary(
			imageFile.buffer,
			imageFile.originalname,
			false,
			imageFile.mimetype,
			"figure/products"
		);

		const updatedImage = await prisma.productImage.update({
			where: { id: imageId },
			data: { imageUrl },
		});

		const imageDTO = {
			imageId: updatedImage.id,
			imageUrl: updatedImage.imageUrl,
			isDefault: updatedImage.isDefault,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, imageDTO, "Cập nhật hình ảnh sản phẩm thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi cập nhật hình ảnh sản phẩm"));
	}
};

// Xóa hình ảnh sản phẩm
export const deleteProductImage = async (
	req: Request<ProductIdParam & ImageIdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { imageId } = req.params;

		const productImage = await prisma.productImage.findUnique({
			where: { id: imageId },
		});
		if (!productImage) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
		}

		await prisma.productImage.delete({ where: { id: imageId } });

		res
			.status(200)
			.json(new ApiResponse(200, null, "Xóa hình ảnh sản phẩm thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi xóa hình ảnh sản phẩm"));
	}
};

// Thay đổi trạng thái hình ảnh mặc định cho sản phẩm
export const changeDefaultImage = async (
	req: Request<ImageIdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { imageId } = req.params;
		const isDefault: boolean = req.query.isDefault === "true";

		const selectedImage = await prisma.productImage.findUnique({
			where: { id: imageId },
		});
		if (!selectedImage) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
		}

		// Nếu isDefault được đặt thành true, đặt tất cả các hình ảnh khác của sản phẩm này thành không mặc định
		if (isDefault) {
			await prisma.productImage.updateMany({
				where: { productId: selectedImage.productId, id: { not: imageId } },
				data: { isDefault: false },
			});
		}

		// Cập nhật trạng thái mặc định cho hình ảnh được chọn
		await prisma.productImage.update({
			where: { id: imageId },
			data: { isDefault },
		});

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					null,
					"Cập nhật trạng thái mặc định hình ảnh thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi cập nhật hình ảnh mặc định"));
	}
};
