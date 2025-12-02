<<<<<<< HEAD
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
    cart.find((item) => String(item.product_id) === String(product.product_id));

  const cartQty = cartItem ? cartItem.quantity : 0;

  // Helper to find an array in response (works for many shapes)
  const extractArrayFromResponse = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;

    if (resData.products && Array.isArray(resData.products))
      return resData.products;
    if (resData.product && Array.isArray(resData.product))
      return resData.product;
    if (resData.allProducts && Array.isArray(resData.allProducts))
      return resData.allProducts;

    // If resData is object and contains any array value, return the first array
    if (typeof resData === "object") {
      for (const val of Object.values(resData)) {
        if (Array.isArray(val)) return val;
      }
    }

    return [];
  };

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await axios.get(
          `https://click2eat-backend-product-service.onrender.com/api/products/${product_id}`
        );
        // try multiple shapes too
        const prod =
          res?.data?.product ||
          res?.data ||
          (Array.isArray(res?.data)
            ? res.data.find(
                (p) =>
                  String(p.product_id || p._id || p.id) === String(product_id)
              )
            : null);

        // If res.data.product is an array, find the single product inside
        if (Array.isArray(prod)) {
          const found = prod.find(
            (p) => String(p.product_id || p._id || p.id) === String(product_id)
          );
          if (mounted) setProduct(found || null);
        } else {
          // If prod is an object with product fields
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
          `https://click2eat-backend-product-service.onrender.com/api/products`
        );

        const all = extractArrayFromResponse(res?.data);

        if (!Array.isArray(all) || all.length === 0) {
          console.warn("No products array found in response:", res?.data);
          setSuggested([]);
          return;
        }

        // remove current product by checking several possible id fields
        const filtered = all.filter((p) => {
          const idVals = [p.product_id, p._id, p.id];
          return !idVals.map((v) => String(v)).includes(String(product_id));
        });

        // shuffle & take up to 3
        const randomThree = filtered
          .slice() // copy
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setSuggested(randomThree);
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

  if (loadingProduct) return <p className="loading">Loading product...</p>;
  if (!product) return <p className="not-found">Product not found.</p>;

  const description = product.description || "";
  const shortText =
    description.length > 50
      ? description.substring(0, 50) + "..."
      : description;

  return (
    <div className="product-detail-wrapper">
      {/* Back */}
      <div className="header-product-detail">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">Product Detail</h2>
      </div>

      {/* Main Content */}
      <div className="product-detail-container">
        <div className="product-image">
          <img
            src={`https://click2eat-backend-product-service.onrender.com/Images/${product.image}`}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="product-price">
            Price :
            <span> {Number(product.unit_price || 0).toFixed(2)} USD</span>
          </p>

          <p className="product-qty">
            {" "}
            <span>Product ID : </span>
            {product.product_id || product._id || product.id || "N/A"}
          </p>

          <p className="product-qty">
            {" "}
            <span>Stocks : </span>
            {product.quantity || 0}
          </p>

          {/* Description with See More */}
          <p className="product-description">
            {" "}
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

          {/* <div className="qty-box-detail">
            {" "}
            Quantity :
            <button
              onClick={() => removeFromCart(product.product_id)}
              disabled={cartQty <= 0}
            >
              -
            </button>
            <span>{cartQty}</span>
            <button onClick={() => addToCart(product)}>+</button>
          </div> */}

          <button className="btn-addToCart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="suggest-product">
        <h2>For you</h2>

        <div className="suggest-product-list">
          {suggested.map((item) => (
            <div
              key={item.product_id}
              className="suggest-card"
              onClick={() => navigate(`/product/${item.product_id}`)}
            >
              <div className="suggest-img-wrapper">
                <img
                  src={`https://click2eat-backend-product-service.onrender.com/Images/${item.image}`}
                  alt={item.name}
                />

                {/* Bookmark icon */}
                <button
                  className={`btn-bookmark ${
                    isLiked(item.product_id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item);
                  }}
                >
                  {isLiked(item.product_id) ? (
                    <i className="bx  bxs-bookmark-heart"></i>
                  ) : (
                    <i className="bx bx-bookmark"></i>
                  )}
                </button>
              </div>

              <div className="suggest-body">
                <h3>{item.name}</h3>
                <p className="desc">{item.description?.substring(0, 60)}...</p>
                <p className="price"> ${item.unit_price.toFixed(2)}</p>
              </div>

              {/* Add to cart button */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
=======
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
    cart.find((item) => String(item.product_id) === String(product.product_id));

  const cartQty = cartItem ? cartItem.quantity : 0;

  // Helper to find an array in response (works for many shapes)
  const extractArrayFromResponse = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;

    if (resData.products && Array.isArray(resData.products))
      return resData.products;
    if (resData.product && Array.isArray(resData.product))
      return resData.product;
    if (resData.allProducts && Array.isArray(resData.allProducts))
      return resData.allProducts;

    // If resData is object and contains any array value, return the first array
    if (typeof resData === "object") {
      for (const val of Object.values(resData)) {
        if (Array.isArray(val)) return val;
      }
    }

    return [];
  };

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await axios.get(
          `https://click2eat-backend-product-service.onrender.com/api/products/${product_id}`
        );
        // try multiple shapes too
        const prod =
          res?.data?.product ||
          res?.data ||
          (Array.isArray(res?.data)
            ? res.data.find(
                (p) =>
                  String(p.product_id || p._id || p.id) === String(product_id)
              )
            : null);

        // If res.data.product is an array, find the single product inside
        if (Array.isArray(prod)) {
          const found = prod.find(
            (p) => String(p.product_id || p._id || p.id) === String(product_id)
          );
          if (mounted) setProduct(found || null);
        } else {
          // If prod is an object with product fields
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
          `https://click2eat-backend-product-service.onrender.com/api/products`
        );

        const all = extractArrayFromResponse(res?.data);

        if (!Array.isArray(all) || all.length === 0) {
          console.warn("No products array found in response:", res?.data);
          setSuggested([]);
          return;
        }

        // remove current product by checking several possible id fields
        const filtered = all.filter((p) => {
          const idVals = [p.product_id, p._id, p.id];
          return !idVals.map((v) => String(v)).includes(String(product_id));
        });

        // shuffle & take up to 3
        const randomThree = filtered
          .slice() // copy
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setSuggested(randomThree);
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

  if (loadingProduct) return <p className="loading">Loading product...</p>;
  if (!product) return <p className="not-found">Product not found.</p>;

  const description = product.description || "";
  const shortText =
    description.length > 50
      ? description.substring(0, 50) + "..."
      : description;

  return (
    <div className="product-detail-wrapper">
      {/* Back */}
      <div className="header-product-detail">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">Product Detail</h2>
      </div>

      {/* Main Content */}
      <div className="product-detail-container">
        <div className="product-image">
          <img
            src={`https://click2eat-backend-product-service.onrender.com/Images/${product.image}`}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="product-price">
            Price :
            <span> {Number(product.unit_price || 0).toFixed(2)} USD</span>
          </p>

          <p className="product-qty">
            {" "}
            <span>Product ID : </span>
            {product.product_id || product._id || product.id || "N/A"}
          </p>

          <p className="product-qty">
            {" "}
            <span>Stocks : </span>
            {product.quantity || 0}
          </p>

          {/* Description with See More */}
          <p className="product-description">
            {" "}
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

          {/* <div className="qty-box-detail">
            {" "}
            Quantity :
            <button
              onClick={() => removeFromCart(product.product_id)}
              disabled={cartQty <= 0}
            >
              -
            </button>
            <span>{cartQty}</span>
            <button onClick={() => addToCart(product)}>+</button>
          </div> */}

          <button className="btn-addToCart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="suggest-product">
        <h2>For you</h2>

        <div className="suggest-product-list">
          {suggested.map((item) => (
            <div
              key={item.product_id}
              className="suggest-card"
              onClick={() => navigate(`/product/${item.product_id}`)}
            >
              <div className="suggest-img-wrapper">
                <img
                  src={`https://click2eat-backend-product-service.onrender.com/Images/${item.image}`}
                  alt={item.name}
                />

                {/* Bookmark icon */}
                <button
                  className={`btn-bookmark ${
                    isLiked(item.product_id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item);
                  }}
                >
                  {isLiked(item.product_id) ? (
                    <i className="bx  bxs-bookmark-heart"></i>
                  ) : (
                    <i className="bx bx-bookmark"></i>
                  )}
                </button>
              </div>

              <div className="suggest-body">
                <h3>{item.name}</h3>
                <p className="desc">{item.description?.substring(0, 60)}...</p>
                <p className="price"> ${item.unit_price.toFixed(2)}</p>
              </div>

              {/* Add to cart button */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
