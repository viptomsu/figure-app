import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUserStore } from "../stores";

// Tạo ProtectedRoute component
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  // Lấy trạng thái xác thực từ Zustand store
  const { isAuthenticated } = useUserStore();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Nếu không xác thực, chuyển hướng đến /login
        )
      }
    />
  );
};

export default ProtectedRoute;
