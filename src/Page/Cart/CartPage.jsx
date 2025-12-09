// CartPage.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import ProductModal from "../ProductModal/ProductModal";
import "./CartPage.css";

const CartPage = () => {
  const { cart, confirmed, addToCart, removeFromCart, removeRowCart } =
    useCart();

  const [showModal, setShowModal] = React.useState(false);

  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0
  );

  return (
    <div className="cart-wrapper">
      {/* HEADER */}
      <div className="header-cart-detail">
        <div className="btn-back" onClick={() => navigate("/")}>
          <i className="bx  bx-chevron-left"></i>
          <span>Back</span>
        </div>

        <h2 className="page-title">Product Detail</h2>
      </div>

      {cart.length === 0 ? (
        <p className="empty">No items in your cart.</p>
      ) : (
        <div className="cart-layout">
          {/* LEFT — CART TABLE */}
          <div className="cart-box">
            <div className="box-header">
              <h3>Cart Items</h3>
              <span className="item-count">{cart.length} Items</span>
            </div>

            <hr />

            <div className="table">
              <div className="table-header">
                <span>No</span>
                <span>Product Details</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
                <span>Action</span>
              </div>

              {cart.map((item, index) => (
                <div className="table-row" key={item.product_id}>
                  <span>{index + 1}</span>

                  <div className="product-cart-info">
                    <img src={`${item.image}`} alt={item.name} />
                    <span>{item.name}</span>
                  </div>

                  {!confirmed ? (
                    <div className="product-qty-box">
                      <button onClick={() => removeFromCart(item.product_id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  ) : (
                    <span>{item.quantity}</span>
                  )}

                  <span className="summary-amount">
                    ${item.unit_price.toFixed(2)}
                  </span>

                  <span className="summary-amount">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </span>

                  <div
                    className="minus-item"
                    onClick={() => removeRowCart(item.product_id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="addMore-product" onClick={() => setShowModal(true)}>
              <i className="bx bx-arrow-from-bottom"></i>
              <span>Add More</span>
            </div>

            {/* MODAL (OUTSIDE the button div) */}
            {showModal && (
              <ProductModal
                onClose={() => setShowModal(false)}
                onAdd={(product) => {
                  addToCart(product);
                  setShowModal(false);
                }}
              />
            )}
          </div>

          {/* RIGHT – SUMMARY */}
          <div className="summary-box">
            <h3>Order Summary</h3>

            {cart.map((item) => (
              <div className="summary-item" key={item.product_id}>
                <span className="item-label">Items</span>
                <span className="qty">x{item.quantity}</span>
                <span className="name">{item.name}</span>
                <span className="amount">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <hr />

            <div className="summary-row">
              <span>Subtotal</span>
              <span className="summary-amount">${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-amount">Free</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span className="summary-amount">${subtotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              CHECK OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
