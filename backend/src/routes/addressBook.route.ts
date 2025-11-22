// addressBook.router.ts
import { Router } from "express";
import {
	getAddressBookByUserId,
	createAddressBook,
	updateAddressBook,
	deleteAddressBook,
} from "@/controllers/addressBook.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createAddressBookSchema,
	updateAddressBookSchema,
	addressBookIdSchema,
	userIdSchema,
} from "@/schemas/addressBook.schema";

const addressBookRouter: Router = Router();

// Lấy danh sách AddressBook theo userId
addressBookRouter.get(
	"/user/:userId",
	validateRequest(userIdSchema),
	getAddressBookByUserId
);

// Tạo mới AddressBook
addressBookRouter.post(
	"/user/:userId",
	validateRequest(createAddressBookSchema),
	createAddressBook
);

// Cập nhật AddressBook theo ID
addressBookRouter.put(
	"/:addressBookId",
	validateRequest(updateAddressBookSchema),
	updateAddressBook
);

// Xóa AddressBook theo ID
addressBookRouter.delete(
	"/:addressBookId",
	validateRequest(addressBookIdSchema),
	deleteAddressBook
);

export { addressBookRouter };
