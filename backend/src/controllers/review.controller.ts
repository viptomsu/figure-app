// review.controller.ts
import Review, { ReviewDocument } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { PaginationQuery, CreateReviewBody, ProductIdParam } from "../types/request.types.js";
import mongoose from "mongoose";

// Lấy tất cả các đánh giá với phân trang và tìm kiếm
export const getAllReviews = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { searchText } = req.query;
    const page: number = parseInt(req.query.page || '1') || 1;
    const limit: number = parseInt(req.query.limit || '10') || 10;
    const skip: number = (page - 1) * limit;

    // Tìm kiếm theo từ khóa nếu có
    const query: any = {};
    if (searchText) {
      query.reviewText = { $regex: searchText, $options: "i" };
    }

    const reviews: ReviewDocument[] = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product"); // Lấy đầy đủ thông tin product
    const totalElements: number = await Review.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: reviews,
      page,
      limit,
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, paginationResponse, "Lấy đánh giá thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đánh giá"));
  }
};

// Lấy các đánh giá của một sản phẩm cụ thể với phân trang và tìm kiếm
export const getReviewsByProduct = async (req: Request<ProductIdParam, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { searchText } = req.query;
    const page: number = parseInt(req.query.page || '1') || 1;
    const limit: number = parseInt(req.query.limit || '10') || 10;
    const skip: number = (page - 1) * limit;

    const query: any = { product: productId };
    if (searchText) {
      query.reviewText = { $regex: searchText, $options: "i" };
    }

    const reviews: ReviewDocument[] = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product"); // Lấy đầy đủ thông tin product
    const totalElements: number = await Review.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: reviews,
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
          "Lấy đánh giá của sản phẩm thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy đánh giá cho sản phẩm"));
  }
};

// Tạo mới đánh giá
export const createReview = async (req: Request<{}, {}, CreateReviewBody>, res: Response): Promise<void> => {
  try {
    const { productId, userId, reviewText, rating } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID không hợp lệ"));
    }

    // Tạo mới review
    const review: ReviewDocument = new Review({
      product: new mongoose.Types.ObjectId(productId),
      user: new mongoose.Types.ObjectId(userId),
      reviewText,
      rating,
      reviewDate: new Date(),
    });

    // Lưu review và populate dữ liệu user và product
    const savedReview: ReviewDocument = await review.save();
    const populatedReview: ReviewDocument | null = await Review.findById(savedReview._id)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product") // Lấy đầy đủ thông tin product
      .exec();

    res
      .status(201)
      .json(new ApiResponse(201, populatedReview, "Tạo đánh giá thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo đánh giá"));
  }
};