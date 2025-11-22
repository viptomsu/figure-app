import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "./email.controller.js";
import { Request, Response } from "express";
import {
	RegisterBody,
	LoginBody,
	ForgotPasswordBody,
	ResetPasswordBody,
} from "@/types/request.types";
import { generateAccessToken } from "@/utils/jwt.utils";
import { prisma } from "@/db/prisma.client";

interface JWTPayload {
	userId: string;
}

export const register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { username, password, email, phoneNumber, role, address, fullName } =
			req.body;

		const emailExists = await prisma.user.findUnique({ where: { email } });
		if (emailExists) {
			return res
				.status(409)
				.send(new ApiResponse(409, null, "Người dùng với email đã tồn tại"));
		}

		const phoneExists = await prisma.user.findFirst({ where: { phoneNumber } });
		if (phoneExists) {
			return res
				.status(409)
				.send(
					new ApiResponse(409, null, "Người dùng với số điện thoại đã tồn tại")
				);
		}

		const hashedPassword: string = await bcrypt.hash(password, 10);

		const isActive: boolean = role === "STAFF" ? false : true;

		const createdUser: User = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
				email,
				phoneNumber,
				role,
				address,
				fullName,
				active: isActive,
				isDelete: false,
			},
		});

		const userResponse = await prisma.user.findUnique({
			where: { id: createdUser.id },
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

		// Only set auth cookie if account is active (non-STAFF)
		if (createdUser.active && createdUser.role !== "STAFF") {
			const jwtToken: string = await generateAccessToken(
				createdUser.id,
				createdUser.role
			);

			// Set HTTP-only cookie
			res.cookie("auth_token", jwtToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 60 * 1000,
				path: "/",
			});
		}

		res
			.status(201)
			.send(
				new ApiResponse(
					201,
					{ user: userResponse },
					"Đăng ký người dùng thành công. Vui lòng chờ quản trị viên phê duyệt nếu bạn là nhân viên."
				)
			);
	} catch (error: any) {
		console.log(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res
				.status(409)
				.send(
					new ApiResponse(
						409,
						null,
						"Dữ liệu đã tồn tại, vui lòng kiểm tra các trường duy nhất"
					)
				);
		} else {
			res
				.status(500)
				.send(new ApiResponse(500, error, "Đăng ký người dùng thất bại"));
		}
	}
};

export const login = async (
	req: Request<{}, {}, LoginBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { username, password } = req.body;

		const user: User | null = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res
				.status(404)
				.send(
					new ApiResponse(
						404,
						null,
						"Không tồn tại người dùng với username này, vui lòng đăng ký trước!"
					)
				);
		}

		if (user.isDelete) {
			return res
				.status(404)
				.send(
					new ApiResponse(
						404,
						null,
						"Không tồn tại người dùng với username này, vui lòng đăng ký trước!"
					)
				);
		}

		if (!user.active) {
			return res
				.status(403)
				.send(
					new ApiResponse(
						403,
						null,
						"Tài khoản chưa được kích hoạt. Vui lòng chờ quản trị viên phê duyệt."
					)
				);
		}

		const isPasswordValid: boolean = await bcrypt.compare(
			password,
			user.password
		);

		if (!isPasswordValid) {
			return res
				.status(401)
				.send(
					new ApiResponse(401, null, "Thông tin đăng nhập không chính xác")
				);
		}

		const jwtToken: string = await generateAccessToken(user.id, user.role);

		// Set HTTP-only cookie
		res.cookie("auth_token", jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			path: "/",
		});

		// Re-query user to exclude sensitive fields
		const userResponse = await prisma.user.findUnique({
			where: { id: user.id },
			select: {
				password: false,
				resetPasswordToken: false,
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

		res
			.status(200)
			.send(new ApiResponse(200, userResponse, "Đăng nhập thành công"));
	} catch (error: unknown) {
		console.log(error);
		res.status(500).send(new ApiResponse(500, error, "Đăng nhập thất bại"));
	}
};

export const forgotPassword = async (
	req: Request<{}, {}, ForgotPasswordBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { email } = req.body;

		const user: User | null = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return res
				.status(404)
				.send(
					new ApiResponse(404, null, "Không tìm thấy người dùng với email này")
				);
		}

		const resetToken: string = jwt.sign(
			{ userId: user.id },
			process.env.RESET_PASSWORD_SECRET!,
			{
				expiresIn: "1h", // Token hết hạn sau 1 giờ
			}
		);

		// Lưu token vào user model để xác minh sau này
		await prisma.user.update({
			where: { id: user.id },
			data: { resetPasswordToken: resetToken },
		});

		await sendResetPasswordEmail(user.email, resetToken);

		res
			.status(200)
			.send(
				new ApiResponse(
					200,
					null,
					"Token đặt lại mật khẩu đã được gửi tới email của bạn"
				)
			);
	} catch (error: unknown) {
		console.log(error);
		res
			.status(500)
			.send(
				new ApiResponse(
					500,
					error,
					"Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu"
				)
			);
	}
};

export const resetPassword = async (
	req: Request<{}, {}, ResetPasswordBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { token, newPassword } = req.body;

		const decoded: JWTPayload = jwt.verify(
			token,
			process.env.RESET_PASSWORD_SECRET!
		) as JWTPayload;
		const userId: string = decoded.userId;

		const user: User | null = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user || user.resetPasswordToken !== token) {
			return res
				.status(400)
				.send(new ApiResponse(400, null, "Token không hợp lệ hoặc đã hết hạn"));
		}

		const hashedPassword: string = await bcrypt.hash(newPassword, 10);

		await prisma.user.update({
			where: { id: userId },
			data: {
				password: hashedPassword,
				resetPasswordToken: null,
			},
		});

		res
			.status(200)
			.send(
				new ApiResponse(
					200,
					null,
					"Mật khẩu của bạn đã được cập nhật thành công"
				)
			);
	} catch (error: unknown) {
		console.log(error);
		res
			.status(500)
			.send(new ApiResponse(500, error, "Đặt lại mật khẩu thất bại"));
	}
};
