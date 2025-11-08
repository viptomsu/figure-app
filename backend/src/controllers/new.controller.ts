import { Request, Response } from "express";
import New, { NewDocument } from "../models/new.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import { PaginationQuery, IdParam, CreateNewBody, UpdateNewBody } from "../types/request.types.js";

interface PaginationResponse {
  content: NewDocument[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}

// Lấy tất cả các bản tin với phân trang, tìm kiếm và lọc bản tin chưa bị xóa
export const getAllNews = async (req: Request<{}, any, any, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;
    const page: number = parseInt(req.query.page || "1");
    const limit: number = parseInt(req.query.limit || "10");
    const skip: number = (page - 1) * limit;

    const query: any = { isDeleted: false };
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    const news: NewDocument[] = await New.find(query).skip(skip).limit(limit);
    const totalElements: number = await New.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse: PaginationResponse = {
      content: news,
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
          "Lấy danh sách bản tin thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách bản tin"));
  }
};

// Lấy bản tin theo ID
export const getNewById = async (req: Request<IdParam>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const newsItem: NewDocument | null = await New.findById(id).where("isDeleted").equals(false);

    if (!newsItem) {
      res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, newsItem, "Lấy bản tin thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy bản tin theo ID"));
  }
};

// Tạo bản tin mới
export const createNew = async (req: Request<{}, any, CreateNewBody>, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const imageFile = req.file;

    const newsItem = new New({
      title,
      content,
      isDeleted: false,
    });

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      newsItem.image = imageUrl;
    }

    const savedNew: NewDocument = await newsItem.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedNew, "Tạo bản tin thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo bản tin"));
  }
};

// Cập nhật bản tin
export const updateNew = async (req: Request<IdParam, any, UpdateNewBody>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const imageFile = req.file;

    const newsItem: NewDocument | null = await New.findById(id);
    if (!newsItem || newsItem.isDeleted) {
      res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
      return;
    }

    newsItem.title = title || newsItem.title;
    newsItem.content = content || newsItem.content;

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      newsItem.image = imageUrl;
    }

    const updatedNew: NewDocument = await newsItem.save();
    res
      .status(200)
      .json(new ApiResponse(200, updatedNew, "Cập nhật bản tin thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật bản tin"));
  }
};

// Xóa bản tin (đánh dấu isDeleted là true)
export const deleteNew = async (req: Request<IdParam>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const newsItem: NewDocument | null = await New.findById(id);
    if (!newsItem || newsItem.isDeleted) {
      res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
      return;
    }

    newsItem.isDeleted = true;
    await newsItem.save();

    res.status(200).json(new ApiResponse(200, null, "Xóa bản tin thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa bản tin"));
  }
};