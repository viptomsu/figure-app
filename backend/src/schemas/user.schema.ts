import { z } from "zod";
import { idSchema } from "./common.schema";

const userBaseSchema = z.object({
	username: z.string().min(1, "Username là bắt buộc"),
	email: z.email({ message: "Định dạng email không hợp lệ" }),
	phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
	fullName: z.string().min(1, "Họ tên là bắt buộc"),
	role: z.enum(["ADMIN", "STAFF", "CUSTOMER"]).optional(),
	address: z.string().optional(),
});

export const createUserSchema = z.object({
	body: userBaseSchema.extend({
		password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	}),
});

export const updateUserSchema = z.object({
	params: idSchema.shape.params,
	body: userBaseSchema.partial(),
});

export const changePasswordSchema = z.object({
	params: idSchema.shape.params,
	body: z.object({
		currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
		newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
	}),
});

export const userIdSchema = idSchema;
