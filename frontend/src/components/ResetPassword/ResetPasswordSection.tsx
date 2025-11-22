'use client';

import { passwordConfirmationSchema, passwordSchema } from '@/schema/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { resetPassword } from '@/services/client'; // Import hàm resetPassword

// Khởi tạo toast cho toàn bộ ứng dụng

const ResetPasswordSection: React.FC = () => {
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const router = useRouter(); // Dùng để chuyển hướng trang sau khi đăng nhập thành công
  const searchParams = useSearchParams(); // Lấy query params từ URL

  // Lấy token từ query params
  const token = searchParams.get('token');

  // Schema xác thực đầu vào
  const validationSchema = z.object({
    newPassword: passwordSchema,
    confirmNewPassword: passwordConfirmationSchema('newPassword', 'confirmNewPassword'),
  });

  type FormValues = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(validationSchema) });

  // Hàm xử lý khi submit form
  const handleResetPassword = async (data: FormValues) => {
    const { newPassword } = data;

    if (!token) {
      toast.error('Token không hợp lệ hoặc đã hết hạn.');
      return;
    }

    setLoading(true); // Bật trạng thái loading cho nút thay đổi mật khẩu
    try {
      console.log(token);
      // Gọi API resetPassword
      const result = await resetPassword(token, newPassword);

      // Hiển thị thông báo thành công
      toast.success('Mật khẩu của bạn đã được cập nhật thành công.');

      // Chuyển hướng về trang đăng nhập
      router.push('/login');
    } catch (error) {
      // Hiển thị toast thông báo lỗi
      toast.error('Đặt lại mật khẩu không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
    }
  };

  return (
    <section id="login" className="py-20">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h6 className="text-xl font-semibold mb-6">Thay đổi mật khẩu</h6>
              <form onSubmit={handleSubmit(handleResetPassword)}>
                <div className="mb-4">
                  <input
                    type="password"
                    className={`w-full p-3 border rounded ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mật khẩu mới"
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message as string}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    className={`w-full p-3 border rounded ${
                      errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Xác nhận mật khẩu mới"
                    {...register('confirmNewPassword')}
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmNewPassword.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    value={loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordSection;
