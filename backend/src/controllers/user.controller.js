// user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";

// Lấy tất cả người dùng với phân trang và tìm kiếm
export const getAllUsers = async (req, res) => {
  try {
    const { searchText } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (searchText) {
      query.username = { $regex: searchText, $options: "i" };
    }

    const users = await User.find(query).skip(skip).limit(limit);
    const totalElements = await User.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

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
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
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
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('-password');
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
export const createUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, fullName, role, address } =
      req.body;
    const imageFile = req.file;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
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
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const savedUser = await user.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedUser, "Tạo người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo người dùng"));
  }
};

// Cập nhật người dùng
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, fullName, role, address } = req.body;
    const imageFile = req.file;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    user.role = role;
    user.address = address;

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const updatedUser = await user.save();
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
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
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

export const changePassword = async (req, res) => {
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
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(
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
