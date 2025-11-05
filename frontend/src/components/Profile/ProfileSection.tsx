import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// @ts-ignore
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from 'sonner';
import { updateProfile } from "../../services/userService";
import { Tabs } from "antd";
import PasswordChange from "./PasswordChange";
import AddressBook from "./AddressBook";
import { useUserStore } from "../../stores";


const ProfileSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user: userData, updateUserProfile } = useUserStore();

  // Validation schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Họ và tên là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phoneNumber: Yup.string().required("Số điện thoại là bắt buộc"),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Reset form với thông tin từ Redux khi component mount
  useEffect(() => {
    if (userData) {
      setImagePreview(userData.avatar);
      reset({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      });
    }
  }, [userData, reset]);

  const handleUpdateProfile = async (data: any) => {
    if (!userData) return;
    setIsLoading(true);

    try {
      // Gọi API để cập nhật thông tin người dùng (bao gồm avatar nếu có)
      await updateProfile(userData.userId, data, selectedImage);

      // Hiển thị thông báo thành công
      toast.success(
        "Cập nhật thông tin thành công! Vui lòng đăng nhập lại để làm mới thông tin"
      );

      // Cập nhật thông tin người dùng trong Zustand
      updateUserProfile({ ...userData, ...data });
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      toast.error("Cập nhật thông tin không thành công. Vui lòng thử lại.");
      console.error("Error updating profile", error);
    } finally {
      // Tắt trạng thái loading
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh đại diện mới
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section id="profile" className="py-5 max-w-[700px] mx-auto">
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ color: "#0060c9" }}
        tabBarGutter={30}
      >
        <Tabs.TabPane tab="Thông tin cá nhân" key="1">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-center mb-5">
              <div
                className="cursor-pointer relative"
                onClick={() => document.getElementById("avatarInput")?.click()}
              >
                <img
                  src={imagePreview || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  className="w-25 h-25 rounded-full border-2 border-gray-300"
                />
                <p className="mt-2.5 text-primary text-sm text-center">
                  Thay đổi avatar
                </p>
              </div>
            </div>
            <input
              id="avatarInput"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <form onSubmit={handleSubmit(handleUpdateProfile)}>
              <div className="mb-4">
                <label className="block mb-1">Họ và tên</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message as string}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-gray-300 rounded"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Số điện thoại</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message as string}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message as string}
                  </p>
                )}
              </div>

              <div className="text-center">
                <input
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 py-2.5 text-white rounded border-none cursor-pointer text-base ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-red-700"
                  } transition-all duration-300`}
                  value={isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                />
              </div>
            </form>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đổi mật khẩu" key="2">
          <PasswordChange userId={userData?.userId} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý địa chỉ" key="3">
          <AddressBook userId={userData?.userId} />
        </Tabs.TabPane>
      </Tabs>
    </section>
  );
};

export default ProfileSection;
