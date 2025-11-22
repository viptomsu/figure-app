import { Request, Response } from "express";
import { prisma } from "@/db/prisma.client";
import { AddressBook } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "@/utils/ApiResponse";
import {
	UserIdParam,
	AddressBookIdParam,
	CreateAddressBookBody,
	UpdateAddressBookBody,
} from "@/types/request.types";

// Lấy danh sách AddressBook theo userId
export const getAddressBookByUserId = async (
	req: Request<UserIdParam>,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params;

		const addressBooks: AddressBook[] = await prisma.addressBook.findMany({
			where: { userId },
		});

		res
			.status(200)
			.json(
				new ApiResponse(200, addressBooks, "Lấy danh sách địa chỉ thành công")
			);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy danh sách địa chỉ"));
	}
};

// Tạo mới AddressBook
export const createAddressBook = async (
	req: Request<UserIdParam, any, CreateAddressBookBody>,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params;
		const { recipientName, phoneNumber, address, ward, district, city, email } =
			req.body;

		const createdAddressBook = await prisma.addressBook.create({
			data: {
				userId,
				recipientName,
				phoneNumber,
				address,
				ward,
				district,
				city,
				email,
			},
		});

		res
			.status(201)
			.json(
				new ApiResponse(201, createdAddressBook, "Tạo địa chỉ mới thành công")
			);
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo địa chỉ mới"));
	}
};

// Cập nhật AddressBook
export const updateAddressBook = async (
	req: Request<AddressBookIdParam, any, UpdateAddressBookBody>,
	res: Response
): Promise<void | Response> => {
	try {
		const { addressBookId } = req.params;
		const { recipientName, phoneNumber, address, ward, district, city, email } =
			req.body;

		const updatedAddressBook = await prisma.addressBook.update({
			where: { id: addressBookId },
			data: {
				recipientName,
				phoneNumber,
				address,
				ward,
				district,
				city,
				email,
			},
		});

		res
			.status(200)
			.json(
				new ApiResponse(200, updatedAddressBook, "Cập nhật địa chỉ thành công")
			);
	} catch (error: any) {
		console.error(error);
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return res
				.status(404)
				.json(new ApiResponse(404, null, "Không tìm thấy địa chỉ"));
		} else {
			res
				.status(500)
				.json(new ApiResponse(500, null, "Lỗi khi cập nhật địa chỉ"));
		}
	}
};

// Xóa AddressBook
export const deleteAddressBook = async (
	req: Request<AddressBookIdParam>,
	res: Response
): Promise<void | Response> => {
	try {
		const { addressBookId } = req.params;

		try {
			await prisma.addressBook.delete({ where: { id: addressBookId } });
		} catch (error: any) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				return res
					.status(404)
					.json(new ApiResponse(404, null, "Không tìm thấy địa chỉ"));
			}
			throw error;
		}

		res.status(200).json(new ApiResponse(200, null, "Xóa địa chỉ thành công"));
	} catch (error) {
		console.error(error);
		res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa địa chỉ"));
	}
};
