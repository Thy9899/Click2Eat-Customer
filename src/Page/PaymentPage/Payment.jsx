import React, { useEffect, useState } from "react";
import { usePayment } from "../../context/PaymentContext";
import {
  loadLastOrderFromLocal,
  removeLastOrderFromLocal,
} from "../../utils/localOrder";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, processPayment, resetCheckout } = usePayment();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (order_id) {
        const data = await fetchOrderById(order_id);
        setOrder(data);
      } else {
        const lastOrderData = loadLastOrderFromLocal();
        if (lastOrderData) setOrder(lastOrderData);
        else {
          toast.error("No order to pay.");
          navigate("/cart");
        }
      }
    };
    loadOrder();
  }, [order_id]);

  const handlePayment = async (method) => {
    if (!order) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        return;
      }

      // backend payment
      await axios.post(
        `https://click2eat-backend-order-service.onrender.com/api/order/pay/${order._id}`, // ✅ FIXED
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await processPayment(order._id, method);
      removeLastOrderFromLocal(); // ✅ clear local order
      toast.success("Payment successful!");
      resetCheckout();
      navigate(`/payment-success/${order._id}`);
      // navigate(`/order-status/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed.");
      console.error(err);
    }
  };

  if (!order) return <p>Loading order...</p>;

  return (
    <div className="payment-wrapper">
      <h2>Payment for Order #{order._id}</h2>
      <p>Total: USD {order.total_price?.toFixed(2)}</p>
      <p>Payment Method: {order.payment_method}</p>
      <div className="payment-buttons">
        <button onClick={() => handlePayment("Credit Card")}>
          Pay with Credit Card
        </button>
        <button onClick={() => navigate("/")}>Pay with Cash</button>
      </div>
    </div>
  );
};

export default Payment;
