import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { CgProductHunt } from "react-icons/cg";
import {
  RiHome4Line,
  RiFolder2Line,
  RiStackLine,
  RiPlantLine,
} from "react-icons/ri";
import "../../style/sidebar.scss";

export default function SidebarItem({ collapsed, toggled, onHeaderClick }) {
  return (
    <div
      className={`sidebar ${toggled ? "mobile-open" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <Sidebar
        style={{ height: "100%", position: "fixed" }}
        collapsed={collapsed}
        toggled={toggled}
      >
        <Menu>
          <MenuItem onClick={onHeaderClick}>
            <div
              onClick={onHeaderClick}
              style={{
                padding: "9px",
                fontWeight: "bold",
                fontSize: collapsed ? 0 : 14,
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {collapsed ? (
                // Display logo image when collapsed
                <img
                  src="/tujjor_logo.png"
                  alt="Logo"
                  style={{ height: "40px", width: "auto" }}
                />
              ) : (
                "TUJJOR EXPRESS"
              )}
            </div>
          </MenuItem>
          <hr />
        </Menu>
        <Menu>
          <MenuItem component={<Link to="/main" />} icon={<RiHome4Line />}>
            Dashboard
          </MenuItem>
          <MenuItem
            component={<Link to="/main/products" />}
            icon={<CgProductHunt />}
          >
            Products
          </MenuItem>
          <SubMenu defaultOpen label="Records" icon={<RiFolder2Line />}>
            <MenuItem icon={<RiStackLine />}>Senior Students</MenuItem>
            <MenuItem icon={<RiPlantLine />}>Junior Students</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
