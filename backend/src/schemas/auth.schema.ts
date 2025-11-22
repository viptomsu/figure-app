import { z } from "zod";

export const registerSchema = z.object({
	body: z.object({
		username: z.string().min(1, "Username là bắt buộc"),
		password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
		email: z.email({ message: "Định dạng email không hợp lệ" }),
		phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
		fullName: z.string().min(1, "Họ tên là bắt buộc"),
		role: z.enum(["ADMIN", "STAFF", "CUSTOMER"]).optional(),
		address: z.string().optional(),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		username: z.string().min(1, "Username là bắt buộc"),
		password: z.string().min(1, "Mật khẩu là bắt buộc"),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z.email({ message: "Định dạng email không hợp lệ" }),
	}),
});

export const resetPasswordSchema = z.object({
	body: z.object({
		token: z.string().min(1, "Token là bắt buộc"),
		newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
	}),
});
