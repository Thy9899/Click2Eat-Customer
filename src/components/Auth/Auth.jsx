import React, { useState, useContext } from "react";
import "./Auth.css";
import { AuthContext } from "../../context/AuthContext";

const Auth = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        await login(form.email, form.password);
        //alert("Login successful!");
        window.location.reload(); //refresh page
      } else {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        await register(form.email, form.password, form.username);
        alert("Registration successful!");
      }
      onClose();
    } catch (err) {
      // handle axios error if using axios
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Tabs */}
        <div className="popup-tabs">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {activeTab === "register" && (
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="•••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {activeTab === "register" && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="•••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === "login" && (
            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />{" "}
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot your password?
              </a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === "login" ? "Sign in" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
