import React from "react";
import { FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import "../../style/navbar.scss";
import { Sidebar } from "react-pro-sidebar";
import { User } from "lucide-react";
import axios from "../../axiosConfig";

export default function Navbar({ onToggleSidebar }) {
  const [toggle, setToggle] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function fetchCurrentUser() {
      const token = localStorage.getItem("access");
      if (!token) return null;
      try {
        const response = await axios.get("/accounts/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        return null;
      }
    }
    fetchCurrentUser().then(setUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FiMenu />
        </button>
        <div className="navbar-title">Admin Dashboard</div>
      </div>
      <div className="navbar-right">
        <button className="notification" onClick={() => setToggle(true)}>
          <FaUser />
        </button>
      </div>
      <Sidebar
        onBackdropClick={() => setToggle(false)}
        toggled={toggle}
        breakPoint="all"
        rtl={true}
      >
        <div className="container">
          <div className="top">
            <div className="title-profile">
              <span>Profile Info</span>
            </div>
            <div className="image-profile">
              <div className="imgg">
                <User size={100} />
              </div>
            </div>
            <div className="info">
              <span>{user?.full_name || "Unknown User"}</span>
              <span>{user?.role || "No role"}</span>
            </div>
          </div>
          <div className="bottom">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </Sidebar>
    </nav>
  );
}
