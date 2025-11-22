'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { login } from '@/services/client';
import { useUserStore } from '@/stores';
import { passwordSchema, requiredStringSchema } from '@/schema/validation';

// Khởi tạo toast cho toàn bộ ứng dụng

const LoginSection = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const { loginSuccess } = useUserStore(); // Use Zustand store

  const validationSchema = z.object({
    username: requiredStringSchema('Tên đăng nhập là bắt buộc'),
    password: passwordSchema,
  });

  type FormValues = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(validationSchema) });

  const handleLogin = async (data: FormValues) => {
    const { username, password } = data;
    setLoginLoading(true);
    try {
      const result = await login(username, password);
      const user = result.payload;

      if (!user) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Store user info in Zustand
      loginSuccess(user);

      if (user.isDelete) {
        toast.warning('Tài khoản của bạn đã bị khóa!');
        return;
      }

      toast.success('Đăng nhập thành công');
      router.push('/');
    } catch (error) {
      toast.error('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <section id="login" className="py-20">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex justify-center gap-8 mb-8">
              <Link href="/login" className="text-gray-900 font-medium">
                Đăng nhập
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">
                Đăng ký
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h6 className="text-xl font-semibold mb-6">Đăng nhập tài khoản</h6>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="mb-4">
                  <input
                    type="text"
                    className={`w-full p-3 border rounded ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tên đăng nhập"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className={`w-full p-3 border rounded ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mật khẩu"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <input type="checkbox" name="remember" id="remember" className="mr-2" />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Ghi nhớ tài khoản
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div>
                  <input
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    value={loginLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    disabled={loginLoading}
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

export default LoginSection;
