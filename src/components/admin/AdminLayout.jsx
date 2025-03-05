import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import Navbar from "./Navbar";
import "../../style/admin-layout.scss";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="admin-layout">
      <SidebarItem collapsed={collapsed} />
      <div className="main-content">
        <Navbar onToggleSidebar={handleCollapsedChange} />
        <div className="content-area">
          {/* Replace with your actual dashboard content */}
          <h2>Dashboard</h2>
          <p>Welcome to your admin panel.</p>
        </div>
      </div>
    </div>
  );
}
