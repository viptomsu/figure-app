import { z } from "zod";

const addressBookBaseSchema = z.object({
	recipientName: z.string().min(1, "Tên người nhận là bắt buộc"),
	phoneNumber: z.string().min(1, "Số điện thoại là bắt buộc"),
	address: z.string().min(1, "Địa chỉ là bắt buộc"),
	ward: z.string().min(1, "Phường/Xã là bắt buộc"),
	district: z.string().min(1, "Quận/Huyện là bắt buộc"),
	city: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
	email: z.email({ message: "Email không hợp lệ" }),
});

export const createAddressBookSchema = z.object({
	params: z.object({
		userId: z.uuid({ message: "ID người dùng không hợp lệ" }),
	}),
	body: addressBookBaseSchema,
});

export const updateAddressBookSchema = z.object({
	params: z.object({
		addressBookId: z.uuid({ message: "ID địa chỉ không hợp lệ" }),
	}),
	body: addressBookBaseSchema.partial(),
});

export const addressBookIdSchema = z.object({
	params: z.object({
		addressBookId: z.uuid({ message: "ID địa chỉ không hợp lệ" }),
	}),
});

export const userIdSchema = z.object({
	params: z.object({
		userId: z.uuid({ message: "ID người dùng không hợp lệ" }),
	}),
});
