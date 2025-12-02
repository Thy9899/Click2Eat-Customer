<<<<<<< HEAD
import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Auth from "../Auth/Auth";
import Profile from "../Profile/Profile";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSaved } from "../../context/SavedContext";

const Navbar = ({ onSearch }) => {
  const [menu, setMenu] = useState("home");
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { customer, logout } = useContext(AuthContext);
  const profileRef = useRef(null);

  // Contexts
  const { cart } = useCart();
  const { likedProducts } = useSaved();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const savedCount = likedProducts.length;

  // Scroll to section
  const handleScroll = (id) => {
    setMenu(id);
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -100;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Close profile popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav-header">
      <div className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="./src/Picture/logo.jpg" alt="Logo" />
        </div>

        {/* Mobile menu toggle */}
        <input type="checkbox" id="toggler" />
        <label htmlFor="toggler" className="nav-menu-icon">
          <i className="bx  bx-menu"></i>
        </label>

        <input type="checkbox" id="icon-toggler" />
        <label htmlFor="icon-toggler" className="nav-menu-icon2">
          <i className="bx  bx-caret-down"></i>
        </label>

        {/* Menu */}
        <ul className="navbar-menu">
          <li
            onClick={() => handleScroll("home")}
            className={menu === "home" ? "active" : ""}
          >
            Home
          </li>
          <li
            onClick={() => handleScroll("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </li>
          <li
            onClick={() => handleScroll("products")}
            className={menu === "products" ? "active" : ""}
          >
            Product
          </li>
          <li
            onClick={() => handleScroll("about")}
            className={menu === "about" ? "active" : ""}
          >
            About
          </li>
          <li
            onClick={() => handleScroll("contact")}
            className={menu === "contact" ? "active" : ""}
          >
            Contact
          </li>
        </ul>

        {/* Icons */}
        <div className="navbar-icons">
          <Link to="/saved">
            <li className="nav-icon-item">
              <div className="nav-icon-wrapper">
                <i className="bx  bx-bookmark-heart"></i>
                {savedCount > 0 && (
                  <span className="nav-badge">{savedCount}</span>
                )}
              </div>
              <span className="nav-name-icon">Saved</span>
            </li>
          </Link>

          <Link to="/cart">
            <li className="nav-icon-item">
              <div className="nav-icon-wrapper">
                <i className="bx  bx-shopping-bag"></i>
                {cartCount > 0 && (
                  <span className="nav-badge">{cartCount}</span>
                )}
              </div>
              <span className="nav-name-icon">Cart</span>
            </li>
          </Link>
        </div>

        {/* Right Side */}
        <div className="navbar-right" ref={profileRef}>
          {/* Search */}
          <div className="navbar-search-icon">
            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)} // ✅ perfect
            />
            <i className="bx  bx-search-alt"></i>
          </div>

          <div className="navbar-user-icon">
            {!customer ? (
              <button className="signin-btn" onClick={() => setShowAuth(true)}>
                <i className="bx  bx-user"></i>
                <span>Sign in</span>
              </button>
            ) : (
              <div
                className="nav-profile-menu"
                onClick={() => setShowProfile((prev) => !prev)}
              >
                {/* <img
                  src={
                    customer.image
                      ? customer.image.startsWith("http")
                        ? customer.image
                        : `https://click2eat-backend-customer-service.onrender.com/Images/${customer.image}`
                      : "https://images.icon-icons.com/1154/PNG/96/1486564400-account_81513.png"
                  }
                  alt="profile"
                /> */}

                <img
                  src={`https://click2eat-backend-customer-service.onrender.com/${customer.image}`}
                  alt="profile"
                />
              </div>
            )}

            {/* Profile popup */}
            {showProfile && customer && <Profile logout={logout} />}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showAuth && !customer && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
=======
import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Auth from "../Auth/Auth";
import Profile from "../Profile/Profile";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSaved } from "../../context/SavedContext";

const Navbar = ({ onSearch }) => {
  const [menu, setMenu] = useState("home");
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { customer, logout } = useContext(AuthContext);
  const profileRef = useRef(null);

  // Contexts
  const { cart } = useCart();
  const { likedProducts } = useSaved();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const savedCount = likedProducts.length;

  // Scroll to section
  const handleScroll = (id) => {
    setMenu(id);
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -100;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Close profile popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav-header">
      <div className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="./src/Picture/logo.jpg" alt="Logo" />
        </div>

        {/* Mobile menu toggle */}
        <input type="checkbox" id="toggler" />
        <label htmlFor="toggler" className="nav-menu-icon">
          <i className="bx  bx-menu"></i>
        </label>

        <input type="checkbox" id="icon-toggler" />
        <label htmlFor="icon-toggler" className="nav-menu-icon2">
          <i className="bx  bx-caret-down"></i>
        </label>

        {/* Menu */}
        <ul className="navbar-menu">
          <li
            onClick={() => handleScroll("home")}
            className={menu === "home" ? "active" : ""}
          >
            Home
          </li>
          <li
            onClick={() => handleScroll("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </li>
          <li
            onClick={() => handleScroll("products")}
            className={menu === "products" ? "active" : ""}
          >
            Product
          </li>
          <li
            onClick={() => handleScroll("about")}
            className={menu === "about" ? "active" : ""}
          >
            About
          </li>
          <li
            onClick={() => handleScroll("contact")}
            className={menu === "contact" ? "active" : ""}
          >
            Contact
          </li>
        </ul>

        {/* Icons */}
        <div className="navbar-icons">
          <Link to="/saved">
            <li className="nav-icon-item">
              <div className="nav-icon-wrapper">
                <i className="bx  bx-bookmark-heart"></i>
                {savedCount > 0 && (
                  <span className="nav-badge">{savedCount}</span>
                )}
              </div>
              <span className="nav-name-icon">Saved</span>
            </li>
          </Link>

          <Link to="/cart">
            <li className="nav-icon-item">
              <div className="nav-icon-wrapper">
                <i className="bx  bx-shopping-bag"></i>
                {cartCount > 0 && (
                  <span className="nav-badge">{cartCount}</span>
                )}
              </div>
              <span className="nav-name-icon">Cart</span>
            </li>
          </Link>
        </div>

        {/* Right Side */}
        <div className="navbar-right" ref={profileRef}>
          {/* Search */}
          <div className="navbar-search-icon">
            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)} // ✅ perfect
            />
            <i className="bx  bx-search-alt"></i>
          </div>

          <div className="navbar-user-icon">
            {!customer ? (
              <button className="signin-btn" onClick={() => setShowAuth(true)}>
                <i className="bx  bx-user"></i>
                <span>Sign in</span>
              </button>
            ) : (
              <div
                className="nav-profile-menu"
                onClick={() => setShowProfile((prev) => !prev)}
              >
                {/* <img
                  src={
                    customer.image
                      ? customer.image.startsWith("http")
                        ? customer.image
                        : `https://click2eat-backend-customer-service.onrender.com/Images/${customer.image}`
                      : "https://images.icon-icons.com/1154/PNG/96/1486564400-account_81513.png"
                  }
                  alt="profile"
                /> */}

                <img
                  src={`https://click2eat-backend-customer-service.onrender.com/${customer.image}`}
                  alt="profile"
                />
              </div>
            )}

            {/* Profile popup */}
            {showProfile && customer && <Profile logout={logout} />}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showAuth && !customer && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
