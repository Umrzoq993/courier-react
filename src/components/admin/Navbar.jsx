import React from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import "../../style/navbar.scss";

export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FiMenu />
        </button>
        <div className="navbar-title">Admin Dashboard</div>
      </div>
      <div className="navbar-right">
        <button className="notification">
          <FiBell />
        </button>
      </div>
    </nav>
  );
}
