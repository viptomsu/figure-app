import { z } from 'zod';

export const emailSchema = z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ');

export const passwordSchema = z
  .string()
  .min(1, 'Mật khẩu là bắt buộc')
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự');

export const phoneSchema = z.string().min(1, 'Số điện thoại là bắt buộc');

export const requiredStringSchema = (message: string) => z.string().min(1, message);

export const passwordConfirmationSchema = (
  passwordFieldName: string = 'password',
  fieldName: string = 'confirmPassword'
) =>
  z
    .string()
    .min(1, 'Xác nhận mật khẩu là bắt buộc')
    .superRefine((data, ctx) => {
      const password = (ctx as any).parent?.[passwordFieldName];
      if (data !== password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu xác nhận không khớp',
          path: [fieldName],
        });
      }
    });
