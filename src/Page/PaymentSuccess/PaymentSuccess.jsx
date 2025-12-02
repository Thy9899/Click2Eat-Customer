import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { order_id } = useParams(); // get order ID from URL

  useEffect(() => {
    const timer = setTimeout(() => {
      // navigate(`/invoice/${order_id}`); // pass actual order_id
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, order_id]);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="checkmark">
          <span>✓</span>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your order has been paid successfully.</p>
        <p>You will be redirected shortly...</p>

        <button
          className="success-btn"
          onClick={() => navigate(`/order-status/${order_id}`)}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
