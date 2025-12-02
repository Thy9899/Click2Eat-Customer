import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Invoice.css";
import { toast } from "react-toastify";

const Invoice = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in.");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `https://click2eat-backend-order-service.onrender.com/api/order/${order_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data.order);
      } catch (err) {
        toast.error("Failed to load order.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [order_id]);

  if (loading) return <p className="loading">Loading order...</p>;
  if (!order) return <p className="loading">Order not found.</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "paid":
        return "status-paid";
      case "confirmed":
        return "status-confirmed";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="order-status-wrapper">
      <div className="order-card">
        <h2>Invoice</h2>

        <p className="order-id">Order ID: {order._id}</p>

        <div className={`status-box ${getStatusColor(order.payment_status)}`}>
          Payment Status: {order.payment_status.toUpperCase()}
        </div>

        <h3>Order Items</h3>
        <ul className="items-list">
          {order.items?.map((item) => (
            <li key={item._id} className="item-row">
              <span>{item.product_id}</span>
              <span>Qty: {item.quantity}</span>
              <span>${item.total_price}</span>
            </li>
          ))}
        </ul>

        <div className="total-section">
          <strong>Total Price:</strong> ${order.total_price}
        </div>

        <h3>Shipping Address</h3>
        <div className="address-box">
          <p>Name: {order.shipping_address?.fullName}</p>
          <p>Phone: {order.shipping_address?.phone}</p>
          <p>Location: {order.shipping_address?.location}</p>
          <p>
            {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
            {order.shipping_address?.zipCode}
          </p>
        </div>

        <button className="invoice-back-btn" onClick={() => navigate("/")}>
          Back Home
        </button>
      </div>
    </div>
  );
};

export default Invoice;
