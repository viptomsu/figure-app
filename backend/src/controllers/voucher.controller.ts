// voucher.controller.ts
import Voucher, { VoucherDocument } from "../models/voucher.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { PaginationQuery, CreateVoucherBody, UpdateVoucherBody, IdParam, VoucherCodeParam } from "../types/request.types.js";

// Lấy tất cả các voucher
export const getAllVouchers = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;
    const page: number = parseInt(req.query.page || '1') || 1;
    const limit: number = parseInt(req.query.limit || '10') || 10;
    const skip: number = (page - 1) * limit;

    // Tìm kiếm theo từ khóa và lọc kết quả chưa bị xóa
    const query: any = {};
    if (keyword) {
      query.code = { $regex: keyword, $options: "i" };
    }

    const vouchers: VoucherDocument[] = await Voucher.find(query).skip(skip).limit(limit);
    const totalElements: number = await Voucher.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: vouchers,
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
          "Lấy danh sách voucher thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách voucher"));
  }
};

// Tạo voucher mới
export const createVoucher = async (req: Request<{}, {}, CreateVoucherBody>, res: Response): Promise<void> => {
  try {
    const { code, discount, expirationDate } = req.body;

    const newVoucher: VoucherDocument = new Voucher({
      code,
      discount,
      expirationDate: new Date(expirationDate),
      isUsed: false,
    });

    const savedVoucher: VoucherDocument = await newVoucher.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedVoucher, "Tạo voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo voucher"));
  }
};

// Cập nhật voucher
export const updateVoucher = async (req: Request<IdParam, {}, UpdateVoucherBody>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate } = req.body;

    const voucher: VoucherDocument | null = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.code = code || voucher.code;
    voucher.discount = discount !== undefined ? discount : voucher.discount;
    voucher.expirationDate = expirationDate ? new Date(expirationDate) : voucher.expirationDate;

    const updatedVoucher: VoucherDocument = await voucher.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedVoucher, "Cập nhật voucher thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật voucher"));
  }
};

// Xóa voucher (thực hiện xóa thật sự)
export const deleteVoucher = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const voucher: VoucherDocument | null = await Voucher.findByIdAndDelete(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    res.status(200).json(new ApiResponse(200, null, "Xóa voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa voucher"));
  }
};

// Đánh dấu voucher là đã sử dụng
export const markVoucherAsUsed = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const voucher: VoucherDocument | null = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.isUsed = true;
    await voucher.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, voucher, "Voucher đã được đánh dấu là đã sử dụng")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "Lỗi khi đánh dấu voucher là đã sử dụng")
      );
  }
};

// Kiểm tra mã voucher
export const checkVoucherCode = async (req: Request<VoucherCodeParam>, res: Response): Promise<void | Response> => {
  try {
    const { code } = req.params;

    const voucher: VoucherDocument | null = await Voucher.findOne({
      code,
      isUsed: false,
      expirationDate: { $gt: new Date() },
    });
    if (!voucher) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "Voucher không hợp lệ hoặc đã hết hạn")
        );
    }

    res.status(200).json(new ApiResponse(200, voucher, "Voucher hợp lệ"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi kiểm tra voucher"));
  }
};

// Thay đổi trạng thái sử dụng của voucher (toggle)
export const changeVoucherStatus = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const voucher: VoucherDocument | null = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.isUsed = !voucher.isUsed; // Thay đổi trạng thái
    await voucher.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, voucher, "Thay đổi trạng thái voucher thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi thay đổi trạng thái voucher"));
  }
};