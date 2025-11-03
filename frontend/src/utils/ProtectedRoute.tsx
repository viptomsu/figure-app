import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../stores";

// Tạo ProtectedRoute component for client-side protection
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Lấy trạng thái xác thực từ Zustand store
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // hoặc return một loading component
  }

  return <>{children}</>;
};

// For server-side protection, use this function in page components
export const requireAuth = () => {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  return isAuthenticated;
};

export default ProtectedRoute;
