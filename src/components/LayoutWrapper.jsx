import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import CourierLayout from "./courier/CourierLayout"; // Create this layout
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode if not installed

export default function LayoutWrapper() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  if (!token) {
    // If no token, redirect to login
    navigate("/");
    return null;
  }

  let role = "";
  try {
    const decoded = jwtDecode(token);
    role = decoded.role || "";
  } catch (error) {
    console.error("Error decoding token:", error);
    // If token is invalid, redirect to login
    navigate("/");
    return null;
  }

  // Conditionally render layouts based on role
  if (role.toLowerCase() === "courier") {
    return (
      <CourierLayout>
        <Outlet />
      </CourierLayout>
    );
  } else if (
    role.toLowerCase() === "admin" ||
    role.toLowerCase() === "operator"
  ) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  } else {
    // If role is unrecognized, you might want to force logout or show an error
    // For simplicity, let's just redirect to login:
    navigate("/");
    return null;
  }
}
