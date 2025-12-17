import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { saveLastOrderToLocal } from "../../utils/localOrder";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------------
  // Cart context
  // -----------------------------
  const { cart, confirmCart } = useCart();

  // -----------------------------
  // Component state
  // -----------------------------
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [shippingMethod, setShippingMethod] = useState("delivery"); // Delivery or Pickup

  // Shipping info form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
  });

  // Selected location from MapView
  const selectedLocation = location.state?.locationCode || "";
  // const selectedLocation =
  //   location.state?.locationCode || "11.554997,104.9287746";

  // -----------------------------
  // Calculated totals
  // -----------------------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const delivery = 2; // fixed delivery cost
  const total = subtotal + delivery;

  // -----------------------------
  // Redirect if not logged in
  // -----------------------------
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Please login first to continue checkout.");
  //   }
  // }, []);

  // -----------------------------
  // Handle input changes for shipping info
  // -----------------------------
  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Confirm order & send to API
  // -----------------------------
  const handleConfirmCart = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty.");

    // Check customer login
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to continue checkout.");
    }

    // Check for missing fields
    const missingFields = Object.entries(shippingInfo)
      .filter(([_, value]) => !value.trim())
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a location on the map.");
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

      // -----------------------------
      // Prepare payload for API
      // -----------------------------
      const payload = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        shipping_address: {
          ...shippingInfo,
          location: selectedLocation, // include selected location
        },
        payment_method: shippingMethod,
        subtotal,
        delivery,
        total,
      };

      // Call API to create order
      const res = await axios.post(
        "https://click2eat-backend-order-service.onrender.com/api/order",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdOrder = res.data.order;

      confirmCart(createdOrder);
      saveLastOrderToLocal(createdOrder);

      toast.success("Order placed successfully!");
      navigate(`/payment/${createdOrder._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error confirming order.");
      console.error(err);
      toast.error(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      {/* -----------------------------
          Header / Back button
      ----------------------------- */}
      <div className="checkout-header">
        <div className="btn-back" onClick={() => navigate("/cart")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </div>
        <h2 className="page-title">🛒 Checkout</h2>
      </div>

      <div className="checkout-container">
        {/* -----------------------------
            Shipping Info Section
        ----------------------------- */}
        <div className="checkout-section">
          <span className="section-title">Checkout</span>
          <hr />

          <span>
            <b>Shipping Information :</b>
          </span>

          {/* Shipping Method */}
          <div className="radio">
            <label
              className={
                shippingMethod === "delivery"
                  ? "radio-card active"
                  : "radio-card"
              }
            >
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === "delivery"}
                onChange={() => setShippingMethod("delivery")}
              />
              <span className="circle"></span>
              <span>Delivery</span>
            </label>

            <label
              className={
                shippingMethod === "pickup" ? "radio-card active" : "radio-card"
              }
            >
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === "pickup"}
                onChange={() => setShippingMethod("pickup")}
              />
              <span className="circle"></span>
              <span>Pickup</span>
            </label>
          </div>

          <span>
            <b>Your Loaction : </b>
          </span>

          {/* Shipping Form Inputs */}
          <div className="customer-info">
            {/* Selected location from Map */}
            <input
              type="text"
              value={selectedLocation}
              placeholder="Click to select location"
              readOnly
              onClick={() => navigate("/map")}
              required
            />
            {/* <input
              type="text"
              value={selectedLocation}
              placeholder={
                shippingMethod === "pickup"
                  ? "Pickup at store"
                  : "Click to select location"
              }
              readOnly
              disabled={shippingMethod === "pickup"}
              onClick={() => shippingMethod === "delivery" && navigate("/map")}
            /> */}
          </div>

          <span>
            <b>Customer Information : </b>
          </span>

          {/* Shipping Form Inputs */}
          <div className="customer-info">
            {Object.keys(shippingInfo).map((field) => (
              <input
                key={field}
                name={field}
                value={shippingInfo[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                required
              />
            ))}
          </div>
        </div>

        {/* -----------------------------
            Cart Review Section
        ----------------------------- */}
        <div className="checkout-section">
          <span className="section-title">Review your cart</span>
          <hr />

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item, index) => (
            <div className="cart-item" key={item.product_id}>
              <p className="item-index">{index + 1}</p>

              <div className="item-image">
                <img src={item.image} alt={item.name} />
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
            </div>
          ))}

          {/* Summary */}
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

          {/* Confirm Button */}
          <button
            onClick={handleConfirmCart}
            disabled={loading || cart.length === 0}
          >
            {loading ? "Confirming..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
