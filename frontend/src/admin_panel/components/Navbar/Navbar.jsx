import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const {token, admin, setAdmin, setToken } = useContext(StoreContext);
  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully")
    navigate("/login");
  }
  return (
    <div className="navbar">
      <div className="logo-text">Tomato<span>Express</span><span className="admin-badge">Admin</span></div>
      {token && admin && (
        <div className="navbar-profile">
          <img className="profile" src={assets.profile_icon} alt="Profile" />
          <ul className="nav-profile-dropdown">
            <li onClick={logout}>
              <img src={assets.logout_icon} alt="Logout" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
