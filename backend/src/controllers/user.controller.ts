// user.controller.ts
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { ApiResponse } from "@/utils/ApiResponse";
import { uploadImageToCloudinary } from "@/services/cloudinary.service";
import { Request, Response } from "express";
import {
	PaginationQuery,
	CreateUserBody,
	UpdateUserBody,
	ChangePasswordBody,
	IdParam,
	PaginatedResponse,
} from "@/types/request.types";
import { prisma } from "@/db/prisma.client";

// Lấy tất cả người dùng với phân trang và tìm kiếm
export const getAllUsers = async (
	req: Request<{}, {}, {}, PaginationQuery>,
	res: Response
): Promise<void> => {
	try {
		const { searchText } = req.query;
		const page: number = parseInt(req.query.page || "1") || 1;
		const limit: number = parseInt(req.query.limit || "10") || 10;
		const skip: number = (page - 1) * limit;

		const query: any = { isDelete: false };
		if (searchText) {
			query.username = { contains: searchText, mode: "insensitive" };
		}

		const users = await prisma.user.findMany({
			where: query,
			skip,
			take: limit,
			select: {
				password: false,
				id: true,
				username: true,
				email: true,
				phoneNumber: true,
				fullName: true,
				avatar: true,
				role: true,
				address: true,
				isDelete: true,
				active: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		const totalElements: number = await prisma.user.count({ where: query });
		const totalPages: number = Math.ceil(totalElements / limit);

		const paginationResponse: PaginatedResponse<
			Omit<User, "password" | "resetPasswordToken">
		> = {
			content: users,
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
					"Lấy danh sách người dùng thành công"
				)
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách người dùng"));
	}
};

// Lấy người dùng theo ID
export const getUserById = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const user = await prisma.user.findFirst({
			where: { id, isDelete: false },
			select: {
				password: false,
				id: true,
				username: true,
				email: true,
				phoneNumber: true,
				fullName: true,
				avatar: true,
				role: true,
				address: true,
				isDelete: true,
				active: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, user, "Lấy người dùng thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy người dùng theo ID"));
	}
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (
	req: Request,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.user!;
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				password: false,
				id: true,
				username: true,
				email: true,
				phoneNumber: true,
				fullName: true,
				avatar: true,
				role: true,
				address: true,
				isDelete: true,
				active: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
		}

		res
			.status(200)
			.json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy thông tin người dùng"));
	}
};

// Tạo mới người dùng
export const createUser = async (
	req: Request<{}, {}, CreateUserBody>,
	res: Response
): Promise<void> => {
	try {
		const { username, password, email, phoneNumber, fullName, role, address } =
			req.body;
		const imageFile: Express.Multer.File | undefined = req.file;

		const hashedPassword: string = await bcrypt.hash(password, 10);

		let userData: any = {
			username,
			password: hashedPassword,
			email,
			phoneNumber,
			fullName,
			role,
			address,
			isDelete: false,
		};

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/users"
			);
			userData.avatar = imageUrl;
		}

		const savedUser: User = await prisma.user.create({ data: userData });
		res
			.status(201)
			.json(new ApiResponse(201, savedUser, "Tạo người dùng thành công"));
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
				.json(new ApiResponse(500, null, "Lỗi khi tạo người dùng"));
		}
	}
};

// Cập nhật người dùng
export const updateUser = async (
	req: Request<IdParam, {}, UpdateUserBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const { username, email, phoneNumber, fullName, role, address } = req.body;
		const imageFile: Express.Multer.File | undefined = req.file;

		const user: User | null = await prisma.user.findUnique({ where: { id } });
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
		}

		const updateData: any = {};
		if (username !== undefined) updateData.username = username;
		if (email !== undefined) updateData.email = email;
		if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
		if (fullName !== undefined) updateData.fullName = fullName;
		if (role !== undefined) updateData.role = role;
		if (address !== undefined) updateData.address = address;

		if (imageFile) {
			const imageUrl: string = await uploadImageToCloudinary(
				imageFile.buffer,
				imageFile.originalname,
				false,
				imageFile.mimetype,
				"figure/users"
			);
			updateData.avatar = imageUrl;
		}

		const updatedUser: User = await prisma.user.update({
			where: { id },
			data: updateData,
		});
		res
			.status(200)
			.json(
				new ApiResponse(200, updatedUser, "Cập nhật người dùng thành công")
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
				.json(new ApiResponse(500, null, "Lỗi khi cập nhật người dùng"));
		}
	}
};

// Xóa người dùng
export const deleteUser = async (
	req: Request<IdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const user: User | null = await prisma.user.findUnique({ where: { id } });
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
		}

		await prisma.user.update({ where: { id }, data: { isDelete: true } });

		res
			.status(200)
			.json(new ApiResponse(200, null, "Xóa người dùng thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa người dùng"));
	}
};

export const changePassword = async (
	req: Request<IdParam, {}, ChangePasswordBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { id } = req.params;
		const { currentPassword, newPassword } = req.body;

		// Tìm người dùng theo `id`
		const user: User | null = await prisma.user.findUnique({ where: { id } });
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
		}

		// Kiểm tra mật khẩu hiện tại
		const isPasswordValid: boolean = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (!isPasswordValid) {
			return res
				.status(400)
				.json(new ApiResponse(400, null, "Mật khẩu hiện tại không chính xác"));
		}

		// Băm và lưu mật khẩu mới
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
		});

		res.status(200).json(new ApiResponse(200, null, "Đổi mật khẩu thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi đổi mật khẩu"));
	}
};
