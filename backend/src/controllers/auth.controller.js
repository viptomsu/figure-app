import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "./email.controller.js";

export const register = async (req, res) => {
	try {
		const { username, password, email, phoneNumber, role, address, fullName } =
			req.body;

		if (
			!username ||
			!password ||
			!email ||
			!phoneNumber ||
			!role ||
			!fullName
		) {
			return res
				.status(400)
				.send(new ApiResponse(400, null, "Thiếu các trường bắt buộc"));
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.send(new ApiResponse(400, null, "Định dạng email không hợp lệ"));
		}

		const emailExists = await User.findOne({ email });
		if (emailExists) {
			return res
				.status(409)
				.send(new ApiResponse(409, null, "Người dùng với email đã tồn tại"));
		}

		const phoneExists = await User.findOne({ phoneNumber });
		if (phoneExists) {
			return res
				.status(409)
				.send(
					new ApiResponse(409, null, "Người dùng với số điện thoại đã tồn tại")
				);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const isActive = role === "STAFF" ? false : true;

		const createdUser = await User.create({
			username,
			password: hashedPassword,
			email,
			phoneNumber,
			role,
			address,
			fullName,
			active: isActive,
		});

		const userResponse = await User.findById(createdUser._id).select(
			"-password -__v"
		);

		// Only set auth cookie if account is active (non-STAFF)
		if (createdUser.active && createdUser.role !== "STAFF") {
			const jwtToken = createdUser.generateAccessToken();

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
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send(new ApiResponse(500, error, "Đăng ký người dùng thất bại"));
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.send(new ApiResponse(400, null, "Thiếu các trường bắt buộc"));
		}

		const user = await User.findOne({ username });

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

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res
				.status(401)
				.send(
					new ApiResponse(401, null, "Thông tin đăng nhập không chính xác")
				);
		}

		const jwtToken = user.generateAccessToken();

		// Set HTTP-only cookie
		res.cookie("auth_token", jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			path: "/",
		});

		// Re-query user to exclude sensitive fields
		const userResponse = await User.findById(user._id).select(
			"-password -__v -resetPasswordToken"
		);

		res
			.status(200)
			.send(new ApiResponse(200, userResponse, "Đăng nhập thành công"));
	} catch (error) {
		console.log(error);
		res.status(500).send(new ApiResponse(500, error, "Đăng nhập thất bại"));
	}
};
export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.send(
					new ApiResponse(404, null, "Không tìm thấy người dùng với email này")
				);
		}

		const resetToken = jwt.sign(
			{ userId: user._id },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: "1h", // Token hết hạn sau 1 giờ
			}
		);

		// Lưu token vào user model để xác minh sau này
		user.resetPasswordToken = resetToken;
		await user.save();

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
	} catch (error) {
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

export const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const userId = decoded.userId;

		const user = await User.findById(userId);
		if (!user || user.resetPasswordToken !== token) {
			return res
				.status(400)
				.send(new ApiResponse(400, null, "Token không hợp lệ hoặc đã hết hạn"));
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = null;
		await user.save();

		res
			.status(200)
			.send(
				new ApiResponse(
					200,
					null,
					"Mật khẩu của bạn đã được cập nhật thành công"
				)
			);
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send(new ApiResponse(500, error, "Đặt lại mật khẩu thất bại"));
	}
};
