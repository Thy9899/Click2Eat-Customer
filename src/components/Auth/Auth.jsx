import React, { useState, useContext, useEffect } from "react";
import "./Auth.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const Auth = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  // ----------------------------
  // Handle Input Change
  // ----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ----------------------------
  // Submit (Login / Register)
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading immediately when user clicks

    try {
      if (activeTab === "login") {
        await login(form.email, form.password);
        window.location.reload(); // refresh after login
      } else {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        await register(form.email, form.password, form.username);
        alert("Registration successful!");
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    setLoading(false); // Stop loading after backend finishes
  };

  // ----------------------------
  // Optional (remove if unused)
  // ----------------------------
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      await axios.post(
        `https://click2eat-backend-customer-service.onrender.com/api/customers/login`
      );
    } catch (error) {
      toast.error("Error fetching Customers");
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
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
                disabled={loading}
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
                  disabled={loading}
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
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
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
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
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
                  disabled={loading}
                />{" "}
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot your password?
              </a>
            </div>
          )}

          {/* Loading or button */}
          <button type="submit" className="submit-btn">
            {activeTab === "login" ? "Sign in" : "Register"}
          </button>
          {loading ? <div className="auth-line-loader"></div> : ""}
        </form>
      </div>
    </div>
  );
};

export default Auth;
