'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { signup } from '@/services/client';
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  requiredStringSchema,
} from '@/schema/validation';

const RegisterSection = () => {
  const [signupLoading, setSignupLoading] = useState(false); // Trạng thái loading cho nút đăng ký
  const router = useRouter();
  // Schema xác thực đầu vào
  const validationSchema = z.object({
    fullName: requiredStringSchema('Tên đầy đủ là bắt buộc'),
    username: requiredStringSchema('Tên đăng nhập là bắt buộc'),
    password: passwordSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
  });

  type FormValues = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(validationSchema) });

  // Hàm xử lý đăng ký
  const handleSignup = async (data: FormValues) => {
    const { fullName, username, password, email, phoneNumber } = data;
    const userInfo = {
      username,
      password,
      email,
      phoneNumber, // Số điện thoại
      role: 'CUSTOMER', // Đặt role là CUSTOMER
      fullName, // Tên đầy đủ
    };

    setSignupLoading(true); // Bật trạng thái loading cho nút đăng ký
    try {
      const response = await signup(userInfo);
      toast.success('Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.');
      router.push('/login');
    } catch (error) {
      console.log(error);
    } finally {
      setSignupLoading(false); // Tắt trạng thái loading sau khi hoàn tất
    }
  };

  return (
    <section id="register" className="py-20">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex justify-center gap-8 mb-8">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Đăng nhập
              </Link>
              <Link href="/register" className="text-gray-900 font-medium">
                Đăng ký
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h6 className="text-xl font-semibold mb-6">Đăng ký tài khoản</h6>
              <form onSubmit={handleSubmit(handleSignup)}>
                <div className="mb-4">
                  <input
                    type="text"
                    className={`w-full p-3 border rounded ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tên đầy đủ"
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>
                  )}
                </div>
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
                <div className="mb-4">
                  <input
                    type="email"
                    className={`w-full p-3 border rounded ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className={`w-full p-3 border rounded ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    value={signupLoading ? 'Đang xử lý...' : 'Đăng ký'}
                    disabled={signupLoading}
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

export default RegisterSection;
