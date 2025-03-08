import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import SidebarItem from "./SidebarItem";
import Navbar from "./Navbar";
import "../../style/admin-layout.scss";

export default function AdminLayout() {
  // Determine if we're on mobile
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Desktop state: collapsed (sidebar shrinks)
  const [collapsed, setCollapsed] = useState(false);
  // Mobile state: toggled (sidebar fully slides in/out)
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setToggled((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setToggled(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Pass both states */}
      <SidebarItem collapsed={collapsed} toggled={toggled} />
      <div className="main-content">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      {/* Only render overlay on mobile when toggled open */}
      {isMobile && toggled && (
        <div className="overlay active" onClick={closeSidebar}></div>
      )}
    </div>
  );
}
