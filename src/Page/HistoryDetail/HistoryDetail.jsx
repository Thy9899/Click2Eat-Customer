import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./HistoryDetail.css";

const HistoryDetail = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `https://click2eat-backend-order-service.onrender.com/api/order/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data.order);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [order_id]);

  return (
    <div className="order-wrapper">
      <div className="header-order-status">
        <button className="btn-back" onClick={() => navigate("/history")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </button>
        <h2 className="page-title">📦 Order Details</h2>
      </div>

      <div className="history-detail">
        {loading ? (
          <p>Loading...</p>
        ) : !order ? (
          <p>No order found.</p>
        ) : (
          <>
            {/* Order Info */}
            <div className="order-info">
              <p className="top-bar">
                <strong>Order ID:</strong> {order._id}
              </p>
            </div>

            <div className="order-info">
              <p className="top-bar">
                <strong>Name:</strong> {order.shipping_address?.fullName}
              </p>
              <p className="top-bar">
                <strong>Phone:</strong> {order.shipping_address?.phone}
              </p>
              <p className="top-bar">
                <strong>Address:</strong> {order.shipping_address?.city}
              </p>
              <p className="top-bar">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="order-info">
              <p className="top-bar">
                <strong>Status:</strong> {order.status}
              </p>
            </div>

            {/* Items Table */}
            <table className="history-detail-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price}</td>
                    <td>${item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Table */}
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>
                    $
                    {order.items
                      .reduce((sum, item) => sum + item.total_price, 0)
                      .toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Delivery Fee</td>
                  <td>${order.delivery.toFixed(2)}</td>
                </tr>
                <tr className="summary-total">
                  <td>Total</td>
                  <td>${order.total_price.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div className="order-summary">
              <p>
                <strong>Delivery:</strong> ${order.delivery}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.total_price}
              </p>
              <p>
                <strong>Payment:</strong> {order.payment_method}
              </p>
              <p>
                <strong>Payment Status:</strong> {order.payment_status}
              </p>
            </div>

            <button
              className="btn-invoice"
              onClick={() => navigate(`/invoice/${order._id}`)}
            >
              View Invoice
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryDetail;
