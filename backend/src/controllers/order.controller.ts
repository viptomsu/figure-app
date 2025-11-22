import { Prisma, OrderStatus, PaymentMethod } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from "express";
import {
	CreateOrderBody,
	OrderFilterQuery,
	UserIdParam,
	OrderIdParam,
	PaginatedResponse,
	PaginationQuery,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

export const createOrder = async (
	req: Request<{}, {}, CreateOrderBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const {
			code,
			date,
			note,
			paymentMethod,
			totalPrice,
			discount,
			user,
			addressBook,
			status,
			orderDetails,
		} = req.body;

		const orderDate = date ? new Date(date) : new Date();

		const createdOrder = await prisma.$transaction(async (tx) => {
			// Create order
			const newOrder = await tx.order.create({
				data: {
					code,
					date: orderDate,
					note,
					paymentMethod,
					totalPrice,
					discount,
					userId: user.userId,
					addressBookId: addressBook.addressBookId,
					status,
				},
			});

			// Process each orderDetail
			for (const detail of orderDetails) {
				// Fetch product to check stock
				const product = await tx.product.findUnique({
					where: { id: detail.product.productId },
				});

				if (!product) {
					throw new Error(
						`Không tìm thấy sản phẩm với ID: ${detail.product.productId}`
					);
				}

				// If a variation is specified, check and decrement variation stock
				if (detail.productVariation?.variationId) {
					// First verify variation exists and get its info for error messages
					const variation = await tx.productVariation.findUnique({
						where: { id: detail.productVariation.variationId },
					});

					if (!variation) {
						throw new Error(
							`Không tìm thấy biến thể sản phẩm với ID: ${detail.productVariation.variationId}`
						);
					}

					// Use conditional update to prevent race condition
					const variationUpdateResult = await tx.productVariation.updateMany({
						where: {
							id: detail.productVariation.variationId,
							quantity: { gte: detail.quantity },
						},
						data: { quantity: { decrement: detail.quantity } },
					});

					if (variationUpdateResult.count === 0) {
						throw new Error(
							`Biến thể sản phẩm ${variation.attributeName}: ${variation.attributeValue} không đủ tồn kho.`
						);
					}
				} else {
					// Use conditional update for product stock to prevent race condition
					const productUpdateResult = await tx.product.updateMany({
						where: {
							id: detail.product.productId,
							stock: { gte: detail.quantity },
						},
						data: { stock: { decrement: detail.quantity } },
					});

					if (productUpdateResult.count === 0) {
						throw new Error(
							`Sản phẩm ${product.productName} không đủ tồn kho.`
						);
					}
				}

				// Create orderDetail
				await tx.orderDetail.create({
					data: {
						orderId: newOrder.id,
						productId: detail.product.productId,
						productVariationId: detail.productVariation?.variationId || null,
						quantity: detail.quantity,
						price: detail.price,
					},
				});
			}

			return await tx.order.findUnique({
				where: { id: newOrder.id },
				include: {
					user: {
						select: {
							id: true,
							fullName: true,
							email: true,
							phoneNumber: true,
						},
					},
					addressBook: true,
					orderDetails: {
						include: {
							product: {
								include: {
									images: {
										where: { isDefault: true },
										select: { imageUrl: true, isDefault: true },
									},
								},
							},
							productVariation: {
								select: {
									attributeName: true,
									attributeValue: true,
									price: true,
								},
							},
						},
					},
				},
			});
		});

		return res
			.status(201)
			.json(new ApiResponse(201, createdOrder, "Tạo đơn hàng thành công"));
	} catch (error) {
		console.error(error);

		// Handle specific Prisma errors
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				return res
					.status(400)
					.json(
						new ApiResponse(
							400,
							null,
							"ID người dùng hoặc địa chỉ không hợp lệ"
						)
					);
			}
			if (error.code === "P2002") {
				return res
					.status(400)
					.json(new ApiResponse(400, null, "Mã đơn hàng đã tồn tại"));
			}
		}

		// Handle stock validation errors
		if (error instanceof Error && error.message.includes("không đủ tồn kho")) {
			return res.status(400).json(new ApiResponse(400, null, error.message));
		}

		return res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi tạo đơn hàng"));
	}
};

export const getAllOrders = async (
	req: Request<{}, {}, {}, OrderFilterQuery>,
	res: Response
): Promise<void> => {
	try {
		const { page = "1", limit = "10", code, status, method } = req.query;
		const pageNumber = parseInt(page as string) || 1;
		const limitNumber = parseInt(limit as string) || 10;
		const skip = (pageNumber - 1) * limitNumber;

		const where: Prisma.OrderWhereInput = {};

		if (code) {
			where.code = { contains: code as string, mode: "insensitive" };
		}
		if (status) {
			where.status = status as OrderStatus;
		}
		if (method) {
			where.paymentMethod = method as PaymentMethod;
		}

		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where,
				skip,
				take: limitNumber,
				orderBy: { createdAt: "desc" },
				include: {
					user: {
						select: {
							id: true,
							fullName: true,
							email: true,
							phoneNumber: true,
						},
					},
					addressBook: true,
					orderDetails: {
						include: {
							product: {
								include: {
									images: {
										where: { isDefault: true },
										select: { imageUrl: true, isDefault: true },
									},
								},
							},
							productVariation: {
								select: {
									attributeName: true,
									attributeValue: true,
									price: true,
								},
							},
						},
					},
				},
			}),
			prisma.order.count({ where }),
		]);

		const totalPages = Math.ceil(total / limitNumber);

		const response: PaginatedResponse<any> = {
			content: orders,
			page: pageNumber,
			limit: limitNumber,
			totalElements: total,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, response, "Lấy danh sách đơn hàng thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đơn hàng"));
	}
};

export const getOrdersByUserId = async (
	req: Request<UserIdParam, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params;
		const { page = "1", limit = "10" } = req.query;
		const pageNumber = parseInt(page as string) || 1;
		const limitNumber = parseInt(limit as string) || 10;
		const skip = (pageNumber - 1) * limitNumber;

		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where: { userId },
				skip,
				take: limitNumber,
				orderBy: { createdAt: "desc" },
				include: {
					user: {
						select: {
							id: true,
							fullName: true,
							email: true,
							phoneNumber: true,
						},
					},
					addressBook: true,
					orderDetails: {
						include: {
							product: {
								include: {
									images: {
										where: { isDefault: true },
										select: { imageUrl: true, isDefault: true },
									},
								},
							},
							productVariation: {
								select: {
									attributeName: true,
									attributeValue: true,
									price: true,
								},
							},
						},
					},
				},
			}),
			prisma.order.count({ where: { userId } }),
		]);

		const totalPages = Math.ceil(total / limitNumber);

		const response: PaginatedResponse<any> = {
			content: orders,
			page: pageNumber,
			limit: limitNumber,
			totalElements: total,
			totalPages,
		};

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					response,
					"Lấy danh sách đơn hàng theo người dùng thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(
				new ApiResponse(
					500,
					null,
					"Lỗi khi lấy danh sách đơn hàng theo người dùng"
				)
			);
	}
};

export const changeOrderStatus = async (
	req: Request<OrderIdParam, {}, { status: OrderStatus }>,
	res: Response
): Promise<void | Response> => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;

		const order = await prisma.order.findUnique({
			where: { id: orderId },
		});

		if (!order) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Đơn hàng không tồn tại"));
		}

		await prisma.order.update({
			where: { id: orderId },
			data: { status },
		});

		return res
			.status(200)
			.json(
				new ApiResponse(200, null, "Thay đổi trạng thái đơn hàng thành công")
			);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi thay đổi trạng thái đơn hàng"));
	}
};
