// brand.controller.ts
import Brand, { BrandDocument } from "../models/brand.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import { Request, Response } from "express";
import { PaginationQuery, CreateBrandBody, UpdateBrandBody, IdParam } from "../types/request.types.js";

// Lấy tất cả các thương hiệu
export const getAllBrands = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { keyword } = req.query;
    const page: number = parseInt(req.query.page || '1') || 1;
    const limit: number = parseInt(req.query.limit || '10') || 10;
    const skip: number = (page - 1) * limit;

    const query: any = { isDelete: false };
    if (keyword) {
      query.brandName = { $regex: keyword, $options: "i" };
    }

    const brands: BrandDocument[] = await Brand.find(query).skip(skip).limit(limit);
    const totalElements: number = await Brand.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: brands,
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
          "Lấy danh sách thương hiệu thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách thương hiệu"));
  }
};

// Lấy thương hiệu theo ID
export const getBrandById = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const brand: BrandDocument | null = await Brand.findById(id).where("isDelete").equals(false);

    if (!brand) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, brand, "Lấy thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy thương hiệu theo ID"));
  }
};

// Tạo thương hiệu mới
export const createBrand = async (req: Request<{}, {}, CreateBrandBody>, res: Response): Promise<void> => {
  try {
    const { brandName, description } = req.body;
    const imageFile: Express.Multer.File | undefined = req.file;

    const brand: BrandDocument = new Brand({
      brandName,
      description,
      isDelete: false,
    });

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      brand.image = imageUrl;
    }

    const savedBrand: BrandDocument = await brand.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedBrand, "Tạo thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo thương hiệu"));
  }
};

// Cập nhật thương hiệu
export const updateBrand = async (req: Request<IdParam, {}, UpdateBrandBody>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { brandName, description } = req.body;
    const imageFile: Express.Multer.File | undefined = req.file;

    const brand: BrandDocument | null = await Brand.findById(id);
    if (!brand || brand.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    brand.brandName = brandName || brand.brandName;
    brand.description = description !== undefined ? description : brand.description;

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      brand.image = imageUrl;
    }

    const updatedBrand: BrandDocument = await brand.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedBrand, "Cập nhật thương hiệu thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật thương hiệu"));
  }
};

// Xóa thương hiệu (đánh dấu isDelete là true)
export const deleteBrand = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const brand: BrandDocument | null = await Brand.findById(id);
    if (!brand || brand.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    brand.isDelete = true;
    await brand.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa thương hiệu"));
  }
};