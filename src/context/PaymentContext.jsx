<<<<<<< HEAD
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  /** Fetch order by ID */
  const fetchOrderById = async (order_id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your order.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://click2eat-backend-order-service.onrender.com/api/order/${order_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentOrder(res.data.order); // ✅ FIXED
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch order");
      console.error("fetchOrderById Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (order_id, method) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStatus("success");
      toast.success(`Payment via ${method} successful!`);
      return true;
    } catch {
      setPaymentStatus("failed");
      toast.error("Payment failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetCheckout = () => {
    setCurrentOrder(null);
    setPaymentStatus(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        currentOrder,
        loading,
        paymentStatus,
        fetchOrderById,
        processPayment,
        resetCheckout,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
=======
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  /** Fetch order by ID */
  const fetchOrderById = async (order_id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your order.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://click2eat-backend-order-service.onrender.com/api/order/${order_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentOrder(res.data.order); // ✅ FIXED
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch order");
      console.error("fetchOrderById Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (order_id, method) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStatus("success");
      toast.success(`Payment via ${method} successful!`);
      return true;
    } catch {
      setPaymentStatus("failed");
      toast.error("Payment failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetCheckout = () => {
    setCurrentOrder(null);
    setPaymentStatus(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        currentOrder,
        loading,
        paymentStatus,
        fetchOrderById,
        processPayment,
        resetCheckout,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
