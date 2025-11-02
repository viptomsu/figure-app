// product.controller.js
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import ProductVariation from "../models/productVariation.model.js";
import ProductImage from "../models/productImage.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import mongoose from "mongoose";

// Lấy danh sách sản phẩm với phân trang và lọc
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      categoryId,
      brandId,
      page = 1,
      limit = 10,
      sortField = "productName",
      sortDirection = "asc",
    } = req.query;
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortDirection === "asc" ? 1 : -1 };

    const query = { isDelete: false };
    if (search) query.productName = { $regex: search, $options: "i" };
    if (categoryId) query.category = new mongoose.Types.ObjectId(categoryId);
    if (brandId) query.brand = new mongoose.Types.ObjectId(brandId);

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("category brand images variations");
    const totalElements = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const response = {
      content: products,
      page: Number(page),
      limit: Number(limit),
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, response, "Lấy danh sách sản phẩm thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách sản phẩm"));
  }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm và populate các trường liên quan
    const product = await Product.findById(id).populate(
      "category brand images variations"
    );

    if (!product || product.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Sản phẩm không tồn tại"));
    }

    // Tính toán reviewCount và avgRating
    const reviews = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    let reviewStats = { avgRating: 0, reviewCount: 0 };
    if (reviews.length > 0) {
      reviewStats = {
        avgRating: reviews[0].avgRating,
        reviewCount: reviews[0].reviewCount,
      };
    }

    // Kết hợp sản phẩm với thông tin đánh giá
    const productWithReviews = {
      ...product.toObject(),
      ...reviewStats,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, productWithReviews, "Lấy sản phẩm thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy chi tiết sản phẩm"));
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      price,
      description,
      discount,
      badge,
      stock,
      isNewProduct,
      isSale,
      isSpecial,
      categoryId,
      brandId,
    } = req.body;
    const images = req.files;
    const variations = req.body.variations
      ? JSON.parse(req.body.variations)
      : [];

    const category = await Category.findById(categoryId);
    const brand = await Brand.findById(brandId);
    if (!category || !brand) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Danh mục hoặc thương hiệu không hợp lệ")
        );
    }

    const product = new Product({
      productName,
      price,
      description,
      discount,
      badge,
      stock,
      isNewProduct,
      isSale,
      isSpecial,
      category: category._id,
      brand: brand._id,
    });

    await product.save();

    // Lưu hình ảnh
    if (images) {
      for (const [index, imageFile] of images.entries()) {
        const imageUrl = await uploadFileToFirebase(
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype
        );
        const productImage = new ProductImage({
          product: product._id,
          imageUrl,
          isDefault: index === 0,
        });
        await productImage.save();
        product.images.push(productImage._id);
      }
    }

    // Lưu biến thể
    for (const variationData of variations) {
      const variation = new ProductVariation({
        ...variationData,
        product: product._id,
      });
      await variation.save();
      product.variations.push(variation._id);
    }

    await product.save();

    res
      .status(201)
      .json(new ApiResponse(201, product, "Tạo sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo sản phẩm"));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      price,
      description,
      discount,
      badge,
      stock,
      isNewProduct,
      isSale,
      isSpecial,
      categoryId,
      brandId,
    } = req.body;
    const images = req.files;
    const variations = req.body.variations
      ? JSON.parse(req.body.variations)
      : [];

    const product = await Product.findById(id);
    if (!product || product.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }

    // Cập nhật các trường thông tin của sản phẩm
    product.productName = productName;
    product.price = price;
    product.description = description;
    product.discount = discount;
    product.badge = badge;
    product.stock = stock;
    product.isNewProduct = isNewProduct;
    product.isSale = isSale;
    product.isSpecial = isSpecial;
    product.category = categoryId
      ? new mongoose.Types.ObjectId(categoryId)
      : product.category;
    product.brand = brandId
      ? new mongoose.Types.ObjectId(brandId)
      : product.brand;

    await product.save();

    // Xóa các hình ảnh cũ và thêm hình ảnh mới (nếu có hình ảnh mới)
    if (images && images.length > 0) {
      await ProductImage.deleteMany({ product: product._id });
      product.images = []; // Xóa danh sách ID ảnh cũ

      for (const [index, imageFile] of images.entries()) {
        const imageUrl = await uploadFileToFirebase(
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype
        );

        const productImage = new ProductImage({
          product: product._id,
          imageUrl,
          isDefault: index === 0, // Đặt ảnh đầu tiên là ảnh mặc định
        });

        await productImage.save();
        product.images.push(productImage._id); // Cập nhật danh sách ID ảnh mới
      }
    }

    // Xóa các biến thể cũ và thêm biến thể mới
    if (variations) {
      await ProductVariation.deleteMany({ product: product._id });
      product.variations = []; // Xóa danh sách ID biến thể cũ

      for (const variationData of variations) {
        const variation = new ProductVariation({
          ...variationData,
          product: product._id,
        });

        await variation.save();
        product.variations.push(variation._id); // Cập nhật danh sách ID biến thể mới
      }
    }

    await product.save(); // Lưu lại tất cả thay đổi vào sản phẩm

    res
      .status(200)
      .json(new ApiResponse(200, product, "Cập nhật sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật sản phẩm"));
  }
};

// Xóa sản phẩm (đánh dấu là đã xóa)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product || product.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }

    product.isDelete = true;
    await product.save();

    res.status(200).json(new ApiResponse(200, null, "Xóa sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa sản phẩm"));
  }
};
export const getFilteredProducts = async (req, res) => {
  try {
    const { isNewProduct, isSale, isSpecial, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Xây dựng query dựa trên các bộ lọc
    const query = { isDelete: false };
    if (isNewProduct !== undefined)
      query.isNewProduct = isNewProduct === "true";
    if (isSale !== undefined) query.isSale = isSale === "true";
    if (isSpecial !== undefined) query.isSpecial = isSpecial === "true";

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate("category brand images variations");

    const totalElements = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    // Chuyển đổi Product sang DTO cho từng sản phẩm
    const productDTOs = products.map((product) => ({
      _id: product._id,
      productName: product.productName,
      price: product.price,
      description: product.description,
      discount: product.discount,
      badge: product.badge,
      stock: product.stock,
      isNewProduct: product.isNewProduct,
      isSale: product.isSale,
      isSpecial: product.isSpecial,
      category: product.category
        ? {
            _id: product.category._id,
            categoryName: product.category.categoryName,
            image: product.category.image,
          }
        : null,
      brand: product.brand
        ? {
            _id: product.brand._id,
            brandName: product.brand.brandName,
            image: product.brand.image,
          }
        : null,
      variations: product.variations.map((variation) => ({
        _id: variation._id,
        attributeName: variation.attributeName,
        attributeValue: variation.attributeValue,
        price: variation.price,
        quantity: variation.quantity,
      })),
      images: product.images.map((image) => ({
        _id: image._id,
        imageUrl: image.imageUrl,
        isDefault: image.isDefault,
      })),
      avgRating: 0, // Placeholder for average rating
      reviewCount: 0, // Placeholder for review count
      isDelete: product.isDelete,
    }));

    const response = {
      content: productDTOs,
      page: Number(page),
      limit: Number(limit),
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, response, "Lấy danh sách sản phẩm thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách sản phẩm"));
  }
};
