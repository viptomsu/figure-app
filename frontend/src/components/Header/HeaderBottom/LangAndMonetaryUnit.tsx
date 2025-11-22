import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";

const LangAndMonetaryUnit: React.FC = () => {
  const router = useRouter();

  // Lấy trạng thái người dùng từ Zustand
  const { user } = useUserStore();

  const handleClick = () => {
    if (user) {
      router.push("/history"); // Điều hướng tới trang lịch sử đặt hàng
    }
  };

  return (
    <div className="lang-and-monetary-unit">
      <ul className="flex items-center justify-between list-none p-0 m-0">
        {/* Hiển thị mục Lịch sử đặt hàng nếu user đã đăng nhập */}
        {user && (
          <li onClick={handleClick} className="cursor-pointer">
            <p className="m-0 text-white text-sm">Lịch sử đặt hàng</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LangAndMonetaryUnit;
