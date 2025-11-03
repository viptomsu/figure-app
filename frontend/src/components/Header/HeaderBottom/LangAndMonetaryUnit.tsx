import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";

const LangAndMonetaryUnit: React.FC = () => {
  const router = useRouter();

  // Lấy trạng thái người dùng từ Zustand
  const { isAuthenticated: isUserLoggedIn } = useUserStore();

  const handleClick = () => {
    if (isUserLoggedIn) {
      router.push("/history"); // Điều hướng tới trang lịch sử đặt hàng
    }
  };

  return (
    <div className="lang-and-monetary-unit">
      <ul>
        {/* Hiển thị mục Lịch sử đặt hàng nếu user đã đăng nhập */}
        {isUserLoggedIn && (
          <li onClick={handleClick} style={{ cursor: "pointer" }}>
            <p style={{ color: "#ffffff" }}>Lịch sử đặt hàng</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LangAndMonetaryUnit;
