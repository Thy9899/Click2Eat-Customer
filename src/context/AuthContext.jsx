<<<<<<< HEAD
import React, { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem("customer")) || null
  );

  const logoutTimer = useRef(null); // ✅ track timer across renders
  const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour = 3600000 ms

  // Load saved customer on refresh
  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (savedCustomer && token && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed >= AUTO_LOGOUT_MS) {
        // ⏰ Already expired
        handleLogout();
      } else {
        // ✅ Still valid
        setCustomer(JSON.parse(savedCustomer));
        // Continue the timer for the remaining time
        startLogoutTimer(AUTO_LOGOUT_MS - elapsed);
      }
    }
  }, []);

  // Helper: Start auto logout timer
  const startLogoutTimer = (duration = AUTO_LOGOUT_MS) => {
    clearTimeout(logoutTimer.current); // clear existing timer
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, duration);
  };

  // ✅ Handle logout in one place
  const handleLogout = () => {
    setCustomer(null);
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("loginTime");
    window.location.reload();
  };

  const login = async (email, password) => {
    const res = await fetch(
      "https://click2eat-backend-customer-service.onrender.com/api/customers/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    // Expect customer instead of customers
    localStorage.setItem("token", data.token);
    localStorage.setItem("customer", JSON.stringify(data.customer));
    localStorage.setItem("loginTime", Date.now().toString());

    setCustomer(data.customer);

    startLogoutTimer();

    return data.customer;
  };

  const register = async (email, password, username) => {
    const res = await fetch(
      "https://click2eat-backend-customer-service.onrender.com/api/customers/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    // Save customer data
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("customer", JSON.stringify(data.customer));
    localStorage.setItem("loginTime", Date.now().toString()); // ✅ record register time

    setCustomer(data.customer);
    startLogoutTimer(); // ✅ start timer

    return data;
  };

  const logout = () => handleLogout(); // keep consistency

  return (
    <AuthContext.Provider
      value={{ customer, setCustomer, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
=======
import React, { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem("customer")) || null
  );

  const logoutTimer = useRef(null); // ✅ track timer across renders
  const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour = 3600000 ms

  // Load saved customer on refresh
  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (savedCustomer && token && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed >= AUTO_LOGOUT_MS) {
        // ⏰ Already expired
        handleLogout();
      } else {
        // ✅ Still valid
        setCustomer(JSON.parse(savedCustomer));
        // Continue the timer for the remaining time
        startLogoutTimer(AUTO_LOGOUT_MS - elapsed);
      }
    }
  }, []);

  // Helper: Start auto logout timer
  const startLogoutTimer = (duration = AUTO_LOGOUT_MS) => {
    clearTimeout(logoutTimer.current); // clear existing timer
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, duration);
  };

  // ✅ Handle logout in one place
  const handleLogout = () => {
    setCustomer(null);
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("loginTime");
    window.location.reload();
  };

  const login = async (email, password) => {
    const res = await fetch(
      "https://click2eat-backend-customer-service.onrender.com/api/customers/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    // Expect customer instead of customers
    localStorage.setItem("token", data.token);
    localStorage.setItem("customer", JSON.stringify(data.customer));
    localStorage.setItem("loginTime", Date.now().toString());

    setCustomer(data.customer);

    startLogoutTimer();

    return data.customer;
  };

  const register = async (email, password, username) => {
    const res = await fetch(
      "https://click2eat-backend-customer-service.onrender.com/api/customers/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    // Save customer data
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("customer", JSON.stringify(data.customer));
    localStorage.setItem("loginTime", Date.now().toString()); // ✅ record register time

    setCustomer(data.customer);
    startLogoutTimer(); // ✅ start timer

    return data;
  };

  const logout = () => handleLogout(); // keep consistency

  return (
    <AuthContext.Provider
      value={{ customer, setCustomer, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
