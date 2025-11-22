import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  passwordSchema,
  requiredStringSchema,
  passwordConfirmationSchema,
} from '@/schema/validation';
import { changePassword } from '@/services/client';

const PasswordChange: React.FC<{ userId: string }> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Validation schema
  const validationSchema = z.object({
    currentPassword: requiredStringSchema('Mật khẩu cũ là bắt buộc'),
    newPassword: passwordSchema,
    confirmPassword: passwordConfirmationSchema('newPassword'),
  });

  type FormValues = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
  });

  // Hàm xử lý khi submit form
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Gọi API đổi mật khẩu
      await changePassword(userId, data.currentPassword, data.newPassword);
      toast.success('Đổi mật khẩu thành công!');
    } catch (error: any) {
      // Kiểm tra xem phản hồi lỗi có tồn tại hay không
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!'); // Thông báo lỗi chung
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h6 className="text-xl font-semibold mb-4">Đổi mật khẩu</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            className="w-full p-2.5 border border-gray-300 rounded"
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message as string}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2.5 border border-gray-300 rounded"
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2.5 border border-gray-300 rounded"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-2.5 text-white rounded border-none cursor-pointer text-base ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-red-700'
            } transition-all duration-300`}
          >
            {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
