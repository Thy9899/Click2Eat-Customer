<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { saveLastOrderToLocal } from "../../utils/localOrder";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, confirmCart, removeRowCart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("delivery");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    location: "",
  });

  // ---------------------------
  // IMPORTANT: Move these HERE
  // ---------------------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const delivery = 2;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmCart = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty.");

    const missingFields = Object.entries(shippingInfo)
      .filter(([_, value]) => !value.trim())
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to place an order.");
        setLoading(false);
        return;
      }

      const payload = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        shipping_address: shippingInfo,
        payment_method: shippingMethod,
        subtotal,
        delivery,
        total,
      };

      const res = await axios.post(
        "https://click2eat-backend-order-service.onrender.com/api/order",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if ([200, 201].includes(res.status)) {
        confirmCart(res.data.order);
        saveLastOrderToLocal(res.data.order);

        toast.success("Order confirmed successfully!");
        navigate(`/payment/${res.data.order.order_id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error confirming order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-header">
        <button className="btn-back" onClick={() => navigate("/cart")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">🛒 Checkout</h2>
      </div>

      <div className="checkout-container">
        <div className="checkout-section">
          <span className="section-title">Checkout</span>

          <hr />

          <span>Shipping Info</span>
          <div className="randio">
            <label>
              <input
                type="radio"
                checked={shippingMethod === "delivery"}
                onChange={() => setShippingMethod("delivery")}
              />
              Delivery
            </label>
            <label>
              <input
                type="radio"
                checked={shippingMethod === "pickup"}
                onChange={() => setShippingMethod("pickup")}
              />
              Pickup
            </label>
          </div>

          {/* Inputs */}
          <div className="customer-info">
            {Object.keys(shippingInfo).map((field) => (
              <input
                key={field}
                name={field}
                value={shippingInfo[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
              />
            ))}
          </div>
        </div>

        {/* CART REVIEW */}
        <div className="checkout-section">
          <span className="section-title">Review your cart</span>

          <hr />

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item, index) => (
            <div className="cart-item" key={item.product_id}>
              <p className="item-index">{index + 1}</p>

              <div className="item-image">
                <img
                  src={`https://click2eat-backend-product-service.onrender.com/Images/${item.image}`}
                  alt={item.name}
                />
              </div>

              <div className="item-info">
                <p className="ch-item-qty">x{item.quantity}</p>
              </div>

              <div className="item-info">
                <p className="item-name">{item.name}</p>
              </div>

              <p className="item-price">
                USD {(item.unit_price * item.quantity).toFixed(2)}
              </p>

              {/* <div className="checkout-minus-item">
                <button
                  onClick={() => removeRowCart(item.product_id)}
                  disabled={loading}
                >
                  <i className="bx bxs-trash"></i>
                </button> 
              </div>*/}
            </div>
          ))}

          <div className="summary-row">
            <span className="checkout-span">Subtotal</span>
            <span>USD {subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>USD {delivery.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>USD {total.toFixed(2)}</span>
          </div>

          {/* Buttons */}
          <button
            onClick={handleConfirmCart}
            disabled={loading || cart.length === 0}
          >
            {loading ? "Confirming..." : "Confirm & Pay"}
          </button>

          {/* <button onClick={clearCart} disabled={loading}>
            Clear Cart
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { saveLastOrderToLocal } from "../../utils/localOrder";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, confirmCart, removeRowCart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("delivery");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    location: "",
  });

  // ---------------------------
  // IMPORTANT: Move these HERE
  // ---------------------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const delivery = 2;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmCart = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty.");

    const missingFields = Object.entries(shippingInfo)
      .filter(([_, value]) => !value.trim())
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to place an order.");
        setLoading(false);
        return;
      }

      const payload = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        shipping_address: shippingInfo,
        payment_method: shippingMethod,
        subtotal,
        delivery,
        total,
      };

      const res = await axios.post(
        "https://click2eat-backend-order-service.onrender.com/api/order",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if ([200, 201].includes(res.status)) {
        confirmCart(res.data.order);
        saveLastOrderToLocal(res.data.order);

        toast.success("Order confirmed successfully!");
        navigate(`/payment/${res.data.order.order_id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error confirming order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-header">
        <button className="btn-back" onClick={() => navigate("/cart")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">🛒 Checkout</h2>
      </div>

      <div className="checkout-container">
        <div className="checkout-section">
          <span className="section-title">Checkout</span>

          <hr />

          <span>Shipping Info</span>
          <div className="randio">
            <label>
              <input
                type="radio"
                checked={shippingMethod === "delivery"}
                onChange={() => setShippingMethod("delivery")}
              />
              Delivery
            </label>
            <label>
              <input
                type="radio"
                checked={shippingMethod === "pickup"}
                onChange={() => setShippingMethod("pickup")}
              />
              Pickup
            </label>
          </div>

          {/* Inputs */}
          <div className="customer-info">
            {Object.keys(shippingInfo).map((field) => (
              <input
                key={field}
                name={field}
                value={shippingInfo[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
              />
            ))}
          </div>
        </div>

        {/* CART REVIEW */}
        <div className="checkout-section">
          <span className="section-title">Review your cart</span>

          <hr />

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item, index) => (
            <div className="cart-item" key={item.product_id}>
              <p className="item-index">{index + 1}</p>

              <div className="item-image">
                <img
                  src={`https://click2eat-backend-product-service.onrender.com/Images/${item.image}`}
                  alt={item.name}
                />
              </div>

              <div className="item-info">
                <p className="ch-item-qty">x{item.quantity}</p>
              </div>

              <div className="item-info">
                <p className="item-name">{item.name}</p>
              </div>

              <p className="item-price">
                USD {(item.unit_price * item.quantity).toFixed(2)}
              </p>

              {/* <div className="checkout-minus-item">
                <button
                  onClick={() => removeRowCart(item.product_id)}
                  disabled={loading}
                >
                  <i className="bx bxs-trash"></i>
                </button> 
              </div>*/}
            </div>
          ))}

          <div className="summary-row">
            <span className="checkout-span">Subtotal</span>
            <span>USD {subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>USD {delivery.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>USD {total.toFixed(2)}</span>
          </div>

          {/* Buttons */}
          <button
            onClick={handleConfirmCart}
            disabled={loading || cart.length === 0}
          >
            {loading ? "Confirming..." : "Confirm & Pay"}
          </button>

          {/* <button onClick={clearCart} disabled={loading}>
            Clear Cart
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
