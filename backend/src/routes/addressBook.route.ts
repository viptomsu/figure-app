// addressBook.router.ts
import { Router, Request, Response } from "express";
import {
  getAddressBookByUserId,
  createAddressBook,
  updateAddressBook,
  deleteAddressBook,
} from "../controllers/addressBook.controller.js";

const addressBookRouter: Router = Router();

// Lấy danh sách AddressBook theo userId
addressBookRouter.get("/user/:userId", getAddressBookByUserId);

// Tạo mới AddressBook
addressBookRouter.post("/user/:userId", createAddressBook);

// Cập nhật AddressBook theo ID
addressBookRouter.put("/:addressBookId", updateAddressBook);

// Xóa AddressBook theo ID
addressBookRouter.delete("/:addressBookId", deleteAddressBook);

export { addressBookRouter };