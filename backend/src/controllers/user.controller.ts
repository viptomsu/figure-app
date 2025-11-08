// user.controller.ts
import User, { UserDocument } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import { Request, Response } from "express";
import { PaginationQuery, CreateUserBody, UpdateUserBody, ChangePasswordBody, IdParam } from "../types/request.types.js";

// Lấy tất cả người dùng với phân trang và tìm kiếm
export const getAllUsers = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const { searchText } = req.query;
    const page: number = parseInt(req.query.page || '1') || 1;
    const limit: number = parseInt(req.query.limit || '10') || 10;
    const skip: number = (page - 1) * limit;

    const query: any = {};
    if (searchText) {
      query.username = { $regex: searchText, $options: "i" };
    }

    const users: UserDocument[] = await User.find(query).skip(skip).limit(limit);
    const totalElements: number = await User.countDocuments(query);
    const totalPages: number = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: users,
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
          "Lấy danh sách người dùng thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách người dùng"));
  }
};

// Lấy người dùng theo ID
export const getUserById = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy người dùng thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy người dùng theo ID"));
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { userId } = req.user;
    const user: UserDocument | null = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy thông tin người dùng"));
  }
};

// Tạo mới người dùng
export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password, email, phoneNumber, fullName, role, address } =
      req.body;
    const imageFile: Express.Multer.File | undefined = req.file;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user: UserDocument = new User({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      fullName,
      role,
      address,
      isDelete: false,
    });

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const savedUser: UserDocument = await user.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedUser, "Tạo người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo người dùng"));
  }
};

// Cập nhật người dùng
export const updateUser = async (req: Request<IdParam, {}, UpdateUserBody>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, fullName, role, address } = req.body;
    const imageFile: Express.Multer.File | undefined = req.file;

    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.fullName = fullName || user.fullName;
    user.role = role || user.role;
    user.address = address || user.address;

    if (imageFile) {
      const imageUrl: string = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const updatedUser: UserDocument = await user.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Cập nhật người dùng thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật người dùng"));
  }
};

// Xóa người dùng
export const deleteUser = async (req: Request<IdParam>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    user.isDelete = true;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa người dùng"));
  }
};

export const changePassword = async (req: Request<IdParam, {}, ChangePasswordBody>, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra nếu người dùng đã gửi `currentPassword` và `newPassword`
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Vui lòng nhập đầy đủ thông tin mật khẩu")
        );
    }

    // Tìm người dùng theo `id`
    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid: boolean = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Mật khẩu hiện tại không chính xác"));
    }

    // Băm và lưu mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Đổi mật khẩu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi đổi mật khẩu"));
  }
};