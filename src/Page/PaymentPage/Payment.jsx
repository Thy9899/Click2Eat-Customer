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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        let data = null;
        if (order_id) {
          data = await fetchOrderById(order_id);
        } else {
          data = loadLastOrderFromLocal();
        }

        if (!data) {
          toast.error("No order to pay.");
          navigate("/cart");
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [order_id, fetchOrderById, navigate]);

  const handlePayment = async (method) => {
    if (!order) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        return;
      }

      // Backend payment call
      await axios.post(
        `https://click2eat-backend-order-service.onrender.com/api/order/pay/${order._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await processPayment(order._id, method);
      removeLastOrderFromLocal(); // Clear local order
      resetCheckout();

      toast.success("Payment successful!");
      navigate(`/payment-success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed.");
      console.error(err);
    }
  };

  // if (loading) return <p>Loading order...</p>;
  // if (!order) return null; // already redirected if no order

  return (
    <div className="payment-wrapper">
      {loading ? (
        <p>Loading order...</p>
      ) : (
        <div>
          <h2>Payment for Order #{order._id}</h2>
          <p>Total: USD {order.total_price?.toFixed(2)}</p>
          <p>Payment Method: {order.payment_method}</p>

          <div className="payment-buttons">
            <button onClick={() => handlePayment("Credit Card")}>
              <p>Pay with Credit Card</p>
              <img
                src="https://images.icon-icons.com/2104/PNG/512/credit_card_icon_129121.png"
                alt="Credit Card"
              />
            </button>

            <button onClick={() => navigate("/")}>
              <p>Pay with Cash</p>
              <img
                src="https://images.icon-icons.com/403/PNG/512/cash_40532.png"
                alt="Cash"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
