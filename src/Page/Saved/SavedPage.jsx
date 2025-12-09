import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSaved } from "../../context/SavedContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./SavedPage.css";

const SavedPage = () => {
  const { likedProducts, toggleLike } = useSaved();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="saved-products">
      <div className="saved-header">
        {/* Back Button */}
        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="bx  bx-chevron-left"></i>
          <span>Back</span>
        </button>

        <h2 className="page-title">❤️ Your Saved Items</h2>
      </div>

      <div className="saved-box-container">
        {likedProducts.length === 0 ? (
          <p className="alert">No saved items yet.</p>
        ) : (
          likedProducts.map((item) => (
            <div className="box saved-item" key={item.saved_id}>
              {/* Product Image */}

              <div className="image">
                <img key={item.saved_id} src={item.image} alt={item.name} />
              </div>

              {/* Product Info */}
              <h3>{item.name}</h3>
              <div className="price">${item.price}</div>

              {/* Buttons */}
              <div className="btn">
                <div className="icons">
                  {/* Unsaved Button */}
                  <button
                    className="icon-btn saved active"
                    onClick={() => toggleLike(item)}
                  >
                    <i className="bx  bxs-bookmark-heart"></i>
                  </button>

                  {/* Add to Cart */}
                  <button
                    className="cart-button"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPage;
