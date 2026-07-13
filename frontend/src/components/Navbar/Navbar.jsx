import React, { useContext, useState, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, searchQuery, setSearchQuery, admin, setAdmin, setCartItems } = useContext(StoreContext);
  const navigate=useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    setCartItems({});
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
    <div className="navbar">
      <Link to="/">
        <div className="logo-text">Tomato<span>Express</span></div>
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        <div className={`navbar-search ${showSearch ? "active" : ""}`}>
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" });
            }}
            ref={searchInputRef}
          />
          <img
            src={assets.search_icon}
            alt=""
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
          />
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 || !token ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => navigate("/login")}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              {admin && (
                <>
                  <li onClick={()=>navigate("/admin")}><img src={assets.profile_icon} alt="" style={{filter: "invert(1)"}} /><p>Admin Panel</p></li>
                  <hr />
                </>
              )}
              <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
