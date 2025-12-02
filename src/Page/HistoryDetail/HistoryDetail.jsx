import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const HistoryDetail = () => {
  const { order_id } = useParams(); // ✅ get order_id from URL
  const [order, setOrder] = useState(null); // ✅ should store ONE order
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("⚠ No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `https://click2eat-backend-order-service.onrender.com/api/order/${order_id}`, // ✅ correct URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data.order); // ✅ correct response field
      } catch (err) {
        console.error("Frontend Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [order_id]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found.</p>; // ✅ handles null

  return (
    <div className="order-wrapper">
      <div className="header-order-status">
        <button className="btn-back" onClick={() => navigate("/history")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">📦 Details</h2>
      </div>

      <div className="history-detail">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Order ID:</strong> {order.name}
        </p>
        <p>
          <strong>Status:</strong> {order.status || "Processing"}{" "}
        </p>
        <p>
          <strong>Customer Name:</strong> {order.shipping_address?.fullName}
        </p>

        <p>
          <strong>Phone Number:</strong> {order.shipping_address?.phone}
        </p>

        <p>
          <strong>Total:</strong> ${order.total_price?.toFixed(2)}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.payment_method || "N/A"}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.payment_status || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <button
          className="btn-invoice"
          onClick={(e) => {
            e.stopPropagation(); // stop triggering order card click
            navigate(`/invoice/${order._id}`);
          }}
        >
          View Invoice
        </button>
      </div>
    </div>
  );
};

export default HistoryDetail;
