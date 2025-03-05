import "../../style/sidebar.scss";
import React from "react";
import {
  RiHome4Line,
  RiTeamLine,
  RiCalendar2Line,
  RiFolder2Line,
  RiUserFollowLine,
  RiPlantLine,
  RiStackLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { Sidebar, SubMenu, Menu, MenuItem } from "react-pro-sidebar";

function SidebarItem({ collapsed }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        className={`app ${collapsed ? "collapsed" : ""}`}
        style={{ height: "100%", position: "absolute" }}
        collapsed={collapsed}
      >
        <main>
          <Menu>
            <MenuItem>
              <div
                style={{
                  padding: "9px",
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: "1px",
                }}
              >
                TUJJOR EXPRESS
              </div>
            </MenuItem>
            <hr />
          </Menu>

          <Menu>
            <MenuItem icon={<RiHome4Line />}>Dashboard</MenuItem>
            <SubMenu defaultOpen label={"Professors"} icon={<RiTeamLine />}>
              <MenuItem icon={<RiUserFollowLine />}>Active</MenuItem>
              <MenuItem icon={<RiUserUnfollowLine />}>Ex Professors</MenuItem>
              <MenuItem icon={<RiCalendar2Line />}>Probation Period</MenuItem>
            </SubMenu>
            <SubMenu defaultOpen label={"Records"} icon={<RiFolder2Line />}>
              <MenuItem icon={<RiStackLine />}>Senior Students</MenuItem>
              <MenuItem icon={<RiPlantLine />}>Junior Students</MenuItem>
            </SubMenu>
          </Menu>
        </main>
      </Sidebar>
    </div>
  );
}

export default SidebarItem;
