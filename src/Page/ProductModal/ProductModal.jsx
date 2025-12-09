import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductModal.css";

const ProductModal = ({ onClose, onAdd }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://click2eat-backend-product-service.onrender.com/api/products"
      )
      .then((res) => {
        console.log("API Response:", res.data);

        // Your backend: { success: true, list: [...] }
        if (Array.isArray(res.data.list)) {
          setProducts(res.data.list);
        } else {
          console.error("Unexpected API format:", res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="product-modal-overlay">
      <div className="product-modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Select Product</h2>

        <div className="productModal-grid">
          {products.map((p) => (
            <div className="productModal-card" key={p.product_id}>
              <img src={`${p.image}`} alt={p.name} />
              <span className="productModal-name">{p.name}</span>
              <p>${p.unit_price}</p>
              <button onClick={() => onAdd(p)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
