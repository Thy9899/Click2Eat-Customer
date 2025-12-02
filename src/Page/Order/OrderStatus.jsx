<<<<<<< HEAD
import React, { useEffect } from "react";
import { useOrderStatus } from "../../context/OrderStatusContext";
import { useNavigate } from "react-router-dom";
import "./OrderStatus.css";

const OrderStatus = () => {
  const { orders, loading, fetchOrders } = useOrderStatus();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (!orders || orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="order-wrapper">
      <div className="header-order-status">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">📦 Order Status</h2>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            {/* Clicking the card still opens order details */}
            <div
              className="order-info"
              onClick={() => navigate(`/order-status/${order._id}`)}
            >
              <p>Order ID: {order._id}</p>
              <p>Order Status: {order.status || "Processing"}</p>
              <p>Payment Status: {order.payment_status || "Pending"}</p>
              <p>Total: ${order.total_price?.toFixed(2)}</p>
              <p>Shipping Method: {order.shipping_method || "Delivery"}</p>
              <p>Items: {order.items?.length || 0}</p>
            </div>

            {/* BUTTON FOR VIEW INVOICE */}
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
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
=======
import React, { useEffect } from "react";
import { useOrderStatus } from "../../context/OrderStatusContext";
import { useNavigate } from "react-router-dom";
import "./OrderStatus.css";

const OrderStatus = () => {
  const { orders, loading, fetchOrders } = useOrderStatus();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (!orders || orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="order-wrapper">
      <div className="header-order-status">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">📦 Order Status</h2>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            {/* Clicking the card still opens order details */}
            <div
              className="order-info"
              onClick={() => navigate(`/order-status/${order._id}`)}
            >
              <p>Order ID: {order._id}</p>
              <p>Order Status: {order.status || "Processing"}</p>
              <p>Payment Status: {order.payment_status || "Pending"}</p>
              <p>Total: ${order.total_price?.toFixed(2)}</p>
              <p>Shipping Method: {order.shipping_method || "Delivery"}</p>
              <p>Items: {order.items?.length || 0}</p>
            </div>

            {/* BUTTON FOR VIEW INVOICE */}
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
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
