import React from "react";
import "./Products.css";
import { useCart } from "../../context/CartContext";
import { useSaved } from "../../context/SavedContext";
import { useNavigate } from "react-router-dom";

const Products = ({ products }) => {
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useSaved();
  const navigate = useNavigate();

  const openDetail = (product_id) => {
    navigate(`/product/${product_id}`);
  };

  return (
    <section className="products" id="products">
      <h1 className="heading">
        <span>Products</span>
      </h1>

      <div className="box-container">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.product_id}
            onClick={() => openDetail(product.product_id)}
          >
            {product.discount && (
              <span className="discount">-{product.discount}%</span>
            )}

            <div className="image">
              <img
                src={`https://click2eat-backend-product-service.onrender.com/Images/${product.image}`}
                alt={product.name}
              />
            </div>

            <button
              className={`icon-btn saved ${
                isLiked(product.product_id) ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(product);
              }}
            >
              {isLiked(product.product_id) ? (
                <i className="bx  bxs-bookmark-heart"></i>
              ) : (
                <i className="bx bx-bookmark"></i>
              )}
            </button>

            <button
              className="cart-button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              +
            </button>

            <h3>{product.name}</h3>

            <p className="desc">{product.description?.substring(0, 45)}...</p>

            <div className="price">
              ${product.unit_price}
              {product.price && <span>${product.price}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
