// product.controller.ts
import { prisma } from "@/db/prisma.client";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import { Request, Response } from "express";
import {
	ProductFilterQuery,
	CreateProductBody,
	UpdateProductBody,
	IdParam,
	PaginatedResponse,
	ProductListItem,
} from "@/types/request.types";

// Define proper types for products with includes
type ProductWithIncludes = any;
type ProductWithIncludesArray = any[];

interface ReviewStats {
	avgRating: number;
	reviewCount: number;
}

// Helper function to convert Decimal fields to numbers
const convertDecimalFields = (product: any) => {
	return {
		...product,
		price:
			product.price instanceof Decimal
				? product.price.toNumber()
				: product.price,
		discount:
			product.discount instanceof Decimal
				? product.discount.toNumber()
				: product.discount,
		variations:
			product.variations?.map((variation: any) => ({
				...variation,
				price:
					variation.price instanceof Decimal
						? variation.price.toNumber()
						: variation.price,
			})) || [],
	};
};

// Lấy danh sách sản phẩm với phân trang và lọc
export const getAllProducts = async (
	req: Request<{}, {}, {}, ProductFilterQuery>,
	res: Response
): Promise<void> => {
	try {
		const {
			search,
			categoryId,
			brandId,
			page = 1,
			limit = 10,
			sortField = "productName",
			sortDirection = "asc",
		} = req.query as any; // Cast to any because validated query has numbers

		const skip: number = (page - 1) * limit;

		const query: any = { isDelete: false };
		if (search) query.productName = { contains: search, mode: "insensitive" };
		if (categoryId) query.categoryId = categoryId;
		if (brandId) query.brandId = brandId;

		const products: ProductWithIncludesArray = await prisma.product.findMany({
			where: query,
			skip,
			take: limit,
			orderBy: { [sortField]: sortDirection },
			include: { category: true, brand: true, images: true, variations: true },
		});
		const totalElements: number = await prisma.product.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		// Convert Decimal fields to numbers
		const productsWithNumbers = products.map(convertDecimalFields);

		const response: PaginatedResponse<ProductWithIncludes> = {
			content: productsWithNumbers,
			page: page,
			limit: limit,
			totalElements,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, response, "Lấy danh sách sản phẩm thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách sản phẩm"));
	}
};

// Lấy chi tiết sản phẩm
export const getProductById = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;

		// Tìm sản phẩm và include các trường liên quan
		const product: ProductWithIncludes | null = await prisma.product.findUnique(
			{
				where: { id },
				include: {
					category: true,
					brand: true,
					images: true,
					variations: true,
				},
			}
		);

		if (!product || product.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Sản phẩm không tồn tại"));
		}

		// Tính toán reviewCount và avgRating
		const reviewStats = await prisma.review.aggregate({
			where: { productId: id },
			_avg: { rating: true },
			_count: true,
		});

		const stats: ReviewStats = {
			avgRating: reviewStats._avg.rating || 0,
			reviewCount: reviewStats._count || 0,
		};

		// Convert Decimal fields to numbers and combine with review stats
		const productWithReviews = {
			...convertDecimalFields(product),
			...stats,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, productWithReviews, "Lấy sản phẩm thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy chi tiết sản phẩm"));
	}
};

// Tạo sản phẩm mới
export const createProduct = async (
	req: Request<{}, {}, CreateProductBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const {
			productName,
			price,
			description,
			discount,
			badge,
			stock,
			isNewProduct,
			isSale,
			isSpecial,
			categoryId,
			brandId,
			variations,
		} = req.body as any; // Cast to any because variations is now an array

		const images: Express.Multer.File[] | undefined =
			req.files as Express.Multer.File[];

		// Upload images first
		const uploadedImages: string[] = [];
		if (images) {
			for (const imageFile of images) {
				const imageUrl: string = await uploadImageToCloudinary(
					imageFile.buffer,
					imageFile.originalname,
					true,
					imageFile.mimetype,
					"figure/products"
				);
				uploadedImages.push(imageUrl);
			}
		}

		// Use transaction for all database operations
		const result = await prisma.$transaction(async (tx) => {
			const product = await tx.product.create({
				data: {
					productName,
					price,
					description,
					discount,
					badge,
					stock,
					isNewProduct,
					isSale,
					isSpecial,
					categoryId,
					brandId,
				},
			});

			// Create product images
			if (uploadedImages.length > 0) {
				for (let i = 0; i < uploadedImages.length; i++) {
					const imageUrl = uploadedImages[i];
					await tx.productImage.create({
						data: {
							productId: product.id,
							imageUrl,
							isDefault: i === 0,
						},
					});
				}
			}

			// Create product variations
			if (variations && Array.isArray(variations)) {
				for (const variationData of variations) {
					await tx.productVariation.create({
						data: {
							...variationData,
							productId: product.id,
						},
					});
				}
			}

			return product;
		});

		res
			.status(201)
			.json(new ApiResponse(201, result, "Tạo sản phẩm thành công"));
	} catch (error) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2003"
		) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "Invalid categoryId or brandId"));
		}
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo sản phẩm"));
	}
};

export const updateProduct = async (
	req: Request<IdParam, {}, UpdateProductBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const {
			productName,
			price,
			description,
			discount,
			badge,
			stock,
			isNewProduct,
			isSale,
			isSpecial,
			categoryId,
			brandId,
			variations,
		} = req.body as any;

		const images: Express.Multer.File[] | undefined =
			req.files as Express.Multer.File[];

		const product = await prisma.product.findUnique({ where: { id } });
		if (!product || product.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
		}

		// Xây dựng đối tượng dữ liệu cập nhật
		const updateData: any = {};
		if (productName !== undefined) updateData.productName = productName;
		if (price !== undefined) updateData.price = price;
		if (description !== undefined) updateData.description = description;
		if (discount !== undefined) updateData.discount = discount;
		if (badge !== undefined) updateData.badge = badge;
		if (stock !== undefined) updateData.stock = stock;
		if (isNewProduct !== undefined) updateData.isNewProduct = isNewProduct;
		if (isSale !== undefined) updateData.isSale = isSale;
		if (isSpecial !== undefined) updateData.isSpecial = isSpecial;
		if (categoryId !== undefined) updateData.categoryId = categoryId;
		if (brandId !== undefined) updateData.brandId = brandId;

		// Upload new images if provided
		const uploadedImages: string[] = [];
		if (images && images.length > 0) {
			for (const imageFile of images) {
				const imageUrl: string = await uploadImageToCloudinary(
					imageFile.buffer,
					imageFile.originalname,
					true,
					imageFile.mimetype,
					"figure/products"
				);
				uploadedImages.push(imageUrl);
			}
		}

		// Use transaction for all database operations
		const result = await prisma.$transaction(async (tx) => {
			// Update product
			const updatedProduct = await tx.product.update({
				where: { id },
				data: updateData,
			});

			// Update images if new images provided
			if (uploadedImages.length > 0) {
				await tx.productImage.deleteMany({ where: { productId: id } });

				for (let i = 0; i < uploadedImages.length; i++) {
					const imageUrl = uploadedImages[i];
					await tx.productImage.create({
						data: {
							productId: id,
							imageUrl,
							isDefault: i === 0,
						},
					});
				}
			}

			// Only handle variations if explicitly provided in request (and validated)
			if (variations !== undefined && Array.isArray(variations)) {
				// Delete old variations and create new ones
				await tx.productVariation.deleteMany({ where: { productId: id } });

				for (const variationData of variations) {
					await tx.productVariation.create({
						data: {
							...variationData,
							productId: id,
						},
					});
				}
			}

			return updatedProduct;
		});

		res
			.status(200)
			.json(new ApiResponse(200, result, "Cập nhật sản phẩm thành công"));
	} catch (error) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2003"
		) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "Invalid categoryId or brandId"));
		}
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi cập nhật sản phẩm"));
	}
};

// Xóa sản phẩm (đánh dấu là đã xóa)
export const deleteProduct = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const product = await prisma.product.findUnique({ where: { id } });
		if (!product || product.isDelete) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
		}

		await prisma.product.update({
			where: { id },
			data: { isDelete: true },
		});

		res.status(200).json(new ApiResponse(200, null, "Xóa sản phẩm thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa sản phẩm"));
	}
};

export const getFilteredProducts = async (
	req: Request<{}, {}, {}, ProductFilterQuery>,
	res: Response
): Promise<void> => {
	try {
		const {
			isNewProduct,
			isSale,
			isSpecial,
			page = 1,
			limit = 10,
		} = req.query as any;
		const skip: number = (page - 1) * limit;

		// Xây dựng query dựa trên các bộ lọc
		const query: any = { isDelete: false };
		if (isNewProduct !== undefined) query.isNewProduct = isNewProduct;
		if (isSale !== undefined) query.isSale = isSale;
		if (isSpecial !== undefined) query.isSpecial = isSpecial;

		const products: ProductWithIncludesArray = await prisma.product.findMany({
			where: query,
			skip,
			take: limit,
			include: { category: true, brand: true, images: true, variations: true },
		});

		const totalElements: number = await prisma.product.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		// Convert Decimal fields to numbers and create DTOs
		const productDTOs: ProductListItem[] = products.map((product) => {
			const convertedProduct = convertDecimalFields(product);
			return {
				id: convertedProduct.id,
				productName: convertedProduct.productName,
				price: convertedProduct.price,
				description: convertedProduct.description,
				discount: convertedProduct.discount,
				badge: convertedProduct.badge,
				stock: convertedProduct.stock,
				isNewProduct: convertedProduct.isNewProduct,
				isSale: convertedProduct.isSale,
				isSpecial: convertedProduct.isSpecial,
				category: product.category
					? {
							id: product.category.id,
							categoryName: product.category.categoryName,
							image: product.category.image,
					  }
					: null,
				brand: product.brand
					? {
							id: product.brand.id,
							brandName: product.brand.brandName,
							image: product.brand.image,
					  }
					: null,
				variations: convertedProduct.variations.map((variation: any) => ({
					id: variation.id,
					attributeName: variation.attributeName,
					attributeValue: variation.attributeValue,
					price: variation.price,
					quantity: variation.quantity,
				})),
				images: product.images.map((image: any) => ({
					id: image.id,
					imageUrl: image.imageUrl,
					isDefault: image.isDefault,
				})),
				avgRating: 0, // Placeholder for average rating
				reviewCount: 0, // Placeholder for review count
				isDelete: product.isDelete,
			};
		});

		const response: PaginatedResponse<ProductListItem> = {
			content: productDTOs,
			page: page,
			limit: limit,
			totalElements,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, response, "Lấy danh sách sản phẩm thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách sản phẩm"));
	}
};
