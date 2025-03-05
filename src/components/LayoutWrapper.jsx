import React from "react";
import AdminLayout from "./admin/AdminLayout";
import CourierLayout from "./courier/CourierLayout";

const LayoutWrapper = () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("access");

  if (!token) {
    // Handle the case when there's no token (user is not logged in)
    return <div>Please log in.</div>;
  }

  let role = "";

  try {
    // Decode the JWT token (assuming it's a JWT)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    role = payload.role ? payload.role.toLowerCase() : "";
  } catch (error) {
    console.error("Error decoding token:", error);
    return <div>Error decoding token.</div>;
  }

  // Conditional rendering based on role
  if (role === "admin" || role === "operator") {
    return <AdminLayout />;
  } else if (role === "courier") {
    return <CourierLayout />;
  } else {
    return <div>Unauthorized Access</div>;
  }
};

export default LayoutWrapper;
