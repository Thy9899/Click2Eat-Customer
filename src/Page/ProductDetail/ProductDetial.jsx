import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useSaved } from "../../context/SavedContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();

  const { cart, addToCart, removeFromCart } = useCart();
  const { toggleLike, isLiked } = useSaved();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

  const [expanded, setExpanded] = useState(false);
  const [suggested, setSuggested] = useState([]);

  const cartItem =
    product &&
    cart.find(
      (item) =>
        String(item.product_id || item._id || item.id) ===
        String(product.product_id || product._id || product.id),
    );

  const cartQty = cartItem ? cartItem.quantity : 0;

  // ============================
  // Helper: Extract array safely
  // ============================
  const extractArrayFromResponse = (resData) => {
    if (!resData) return [];

    if (Array.isArray(resData)) return resData;

    if (resData.products && Array.isArray(resData.products))
      return resData.products;

    if (resData.product && Array.isArray(resData.product))
      return resData.product;

    if (resData.allProducts && Array.isArray(resData.allProducts))
      return resData.allProducts;

    if (typeof resData === "object") {
      for (const val of Object.values(resData)) {
        if (Array.isArray(val)) return val;
      }
    }

    return [];
  };

  // ============================
  // Fetch Product + Suggestions
  // ============================
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoadingProduct(true);

      try {
        const res = await axios.get(
          `https://click2eat-backend-product-service-887e.onrender.com/api/products/${product_id}`,
        );

        const prod =
          res?.data?.product ||
          res?.data ||
          (Array.isArray(res?.data)
            ? res.data.find(
                (p) =>
                  String(p.product_id || p._id || p.id) === String(product_id),
              )
            : null);

        if (Array.isArray(prod)) {
          const found = prod.find(
            (p) => String(p.product_id || p._id || p.id) === String(product_id),
          );
          if (mounted) setProduct(found || null);
        } else {
          if (mounted) setProduct(prod || null);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoadingProduct(false);
      }
    };

    const fetchSuggested = async () => {
      setLoadingSuggested(true);

      try {
        const res = await axios.get(
          `https://click2eat-backend-product-service-887e.onrender.com/api/products`,
        );

        const all = extractArrayFromResponse(res?.data);

        if (!Array.isArray(all) || all.length === 0) {
          setSuggested([]);
          return;
        }

        const filtered = all.filter((p) => {
          const ids = [p.product_id, p._id, p.id];
          return !ids.map((v) => String(v)).includes(String(product_id));
        });

        const randomProducts = filtered
          .slice()
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setSuggested(randomProducts);
      } catch (err) {
        console.error("Error loading suggestions:", err);
        setSuggested([]);
      } finally {
        setLoadingSuggested(false);
      }
    };

    fetchProduct();
    fetchSuggested();

    return () => {
      mounted = false;
    };
  }, [product_id]);

  const description = product?.description || "";

  const shortText =
    description.length > 50
      ? description.substring(0, 50) + "..."
      : description;

  // ============================
  // UI
  // ============================
  return (
    <div className="product-detail-wrapper">
      {/* Back Button */}
      <div className="header-product-detail">
        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </button>

        <h2 className="page-title">Product Detail</h2>
      </div>

      {loadingProduct ? (
        <p className="loading">Loading product...</p>
      ) : !product ? (
        <p className="not-found">Product not found.</p>
      ) : (
        <>
          {/* Product Detail */}
          <div className="product-detail-container">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
              <h1>{product.name}</h1>

              <p className="product-price">
                Price :
                <span> {Number(product.unit_price || 0).toFixed(2)} USD</span>
              </p>

              <p className="product-qty">
                <span>Product ID : </span>
                {product.product_id || product._id || product.id || "N/A"}
              </p>

              <p className="product-qty">
                <span>Stocks : </span>
                {product.quantity || 0}
              </p>

              {/* Description */}
              <p className="product-description">
                <span>Description : </span>

                {expanded ? description : shortText}

                {description.length > 50 && (
                  <span
                    onClick={() => setExpanded(!expanded)}
                    className="see-more-btn"
                  >
                    {expanded ? " See less" : " See more"}
                  </span>
                )}
              </p>

              {/* Add to Cart */}
              <button
                className="btn-addToCart"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Suggested Products */}
          <div className="suggest-product">
            <h2>For you</h2>

            <div className="suggest-product-list">
              {loadingSuggested ? (
                <p>Loading suggestions...</p>
              ) : (
                suggested.map((item) => (
                  <div
                    key={item.product_id || item._id || item.id}
                    className="suggest-card"
                    onClick={() =>
                      navigate(`/product/${item.product_id || item._id}`)
                    }
                  >
                    <div className="suggest-img-wrapper">
                      <img src={item.image} alt={item.name} />

                      {/* Bookmark */}
                      <button
                        className={`btn-bookmark ${
                          isLiked(item.product_id || item._id) ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item);
                        }}
                      >
                        {isLiked(item.product_id || item._id) ? (
                          <i className="bx bxs-bookmark-heart"></i>
                        ) : (
                          <i className="bx bx-bookmark"></i>
                        )}
                      </button>
                    </div>

                    <div className="suggest-body">
                      <h3>{item.name}</h3>

                      <p className="desc">
                        {item.description?.substring(0, 60)}...
                      </p>

                      <p className="price">
                        ${Number(item.unit_price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Add to Cart */}
                    <button
                      className="btn-add-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      +
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
