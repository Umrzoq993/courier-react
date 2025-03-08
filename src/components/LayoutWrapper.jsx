import React from "react";
import AdminLayout from "./admin/AdminLayout";
import { Outlet } from "react-router-dom";

export default function LayoutWrapper() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
