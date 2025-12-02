<<<<<<< HEAD
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderStatusContext = createContext();
export const useOrderStatus = () => useContext(OrderStatusContext);

export const OrderStatusProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // <-- plural
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "https://click2eat-backend-order-service.onrender.com/api/order/last",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // wrap in array because backend returns `order`, not `orders`
      setOrders(res.data.order ? [res.data.order] : []);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderStatusContext.Provider value={{ orders, loading, fetchOrders }}>
      {children}
    </OrderStatusContext.Provider>
  );
};
=======
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderStatusContext = createContext();
export const useOrderStatus = () => useContext(OrderStatusContext);

export const OrderStatusProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // <-- plural
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "https://click2eat-backend-order-service.onrender.com/api/order/last",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // wrap in array because backend returns `order`, not `orders`
      setOrders(res.data.order ? [res.data.order] : []);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderStatusContext.Provider value={{ orders, loading, fetchOrders }}>
      {children}
    </OrderStatusContext.Provider>
  );
};
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
