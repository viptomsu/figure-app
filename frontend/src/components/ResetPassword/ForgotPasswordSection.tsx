import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// @ts-ignore
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify
import { forgotPassword } from "../../services/authService"; // Import hàm forgotPassword

// Khởi tạo toast cho toàn bộ ứng dụng
toast.configure();

const ForgotPasswordSection: React.FC = () => {
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const router = useRouter(); // Dùng để chuyển hướng trang sau khi gửi yêu cầu thành công

  // Schema xác thực đầu vào
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // Hàm xử lý khi submit form
  const handleForgotPassword = async (data: any) => {
    const { email } = data;

    setLoading(true); // Bật trạng thái loading cho nút gửi yêu cầu
    try {
      // Gọi API forgotPassword
      const result = await forgotPassword(email);
      if (result === "Email không tồn tại trong hệ thống") {
        toast.error("Email không tồn tại trong hệ thống.");
        return;
      }
      // Hiển thị thông báo thành công
      toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");

      // Chuyển hướng về trang đăng nhập sau khi gửi yêu cầu thành công
      router.push("/login");
    } catch (error) {
      // Hiển thị toast thông báo lỗi
      toast.error("Yêu cầu quên mật khẩu không thành công. Vui lòng thử lại.");
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
              <h6 className="text-xl font-semibold mb-6">Quên mật khẩu</h6>
              <form onSubmit={handleSubmit(handleForgotPassword)}>
                <div className="mb-6">
                  <input
                    type="email"
                    className={`w-full p-3 border rounded ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    value={loading ? "Đang xử lý..." : "Gửi yêu cầu"}
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

export default ForgotPasswordSection;
