<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SavedContext = createContext();
export const useSaved = () => useContext(SavedContext);

export const SavedProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);

  // ✅ Fetch all saved products on mount
  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // user not logged in

      try {
        const res = await axios.get(
          "https://click2eat-backend-saved-service.onrender.com/api/saved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const list = res.data.list || [];
        setLikedProducts(list);
      } catch (err) {
        console.error("Error fetching saved products:", err);
      }
    };

    fetchSaved();
  }, []);

  // ✅ Toggle like/save product
  const toggleLike = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User not authenticated");
      return;
    }

    const exists = likedProducts.find(
      (productItem) => productItem.product_id === product.product_id
    );

    try {
      if (exists) {
        // DELETE saved item (gateway will forward to microservice)
        await axios.delete(
          `https://click2eat-backend-saved-service.onrender.com/api/saved/${exists.saved_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikedProducts((prev) =>
          prev.filter((item) => item.saved_id !== exists.saved_id)
        );
      } else {
        let payload;
        let headers = { Authorization: `Bearer ${token}` };

        // If user selected a local file for upload
        if (product.imageFile) {
          payload = new FormData();
          payload.append("name", product.name);
          payload.append("category", product.category);
          payload.append("price", product.price);
          payload.append("product_id", product.product_id || "");
          payload.append("image", product.imageFile); // File object
          headers = { ...headers, "Content-Type": "multipart/form-data" };
        } else {
          // If using existing image URL
          payload = {
            name: product.name,
            category: product.category,
            price: product.price,
            product_id: product.product_id || null,
            image: product.image || null,
          };
        }

        const res = await axios.post(
          "https://click2eat-backend-saved-service.onrender.com/api/saved",
          payload,
          {
            headers,
          }
        );

        // Store saved item from backend response
        const savedItem = {
          saved_id: res.data.saved_id,
          customer_id: res.data.customer_id,
          product_id: res.data.product_id,
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          image: res.data.image,
        };

        setLikedProducts((prev) => [...prev, savedItem]);
      }
    } catch (error) {
      console.error("Error toggling saved product:", error);
    }
  };

  // ✅ Check if a product is already saved
  const isLiked = (productId) =>
    likedProducts.some((product) => product.product_id === productId);

  return (
    <SavedContext.Provider value={{ likedProducts, toggleLike, isLiked }}>
      {children}
    </SavedContext.Provider>
  );
};
=======
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SavedContext = createContext();
export const useSaved = () => useContext(SavedContext);

export const SavedProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);

  // ✅ Fetch all saved products on mount
  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // user not logged in

      try {
        const res = await axios.get(
          "https://click2eat-backend-saved-service.onrender.com/api/saved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const list = res.data.list || [];
        setLikedProducts(list);
      } catch (err) {
        console.error("Error fetching saved products:", err);
      }
    };

    fetchSaved();
  }, []);

  // ✅ Toggle like/save product
  const toggleLike = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User not authenticated");
      return;
    }

    const exists = likedProducts.find(
      (productItem) => productItem.product_id === product.product_id
    );

    try {
      if (exists) {
        // DELETE saved item (gateway will forward to microservice)
        await axios.delete(
          `https://click2eat-backend-saved-service.onrender.com/api/saved/${exists.saved_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikedProducts((prev) =>
          prev.filter((item) => item.saved_id !== exists.saved_id)
        );
      } else {
        let payload;
        let headers = { Authorization: `Bearer ${token}` };

        // If user selected a local file for upload
        if (product.imageFile) {
          payload = new FormData();
          payload.append("name", product.name);
          payload.append("category", product.category);
          payload.append("price", product.price);
          payload.append("product_id", product.product_id || "");
          payload.append("image", product.imageFile); // File object
          headers = { ...headers, "Content-Type": "multipart/form-data" };
        } else {
          // If using existing image URL
          payload = {
            name: product.name,
            category: product.category,
            price: product.price,
            product_id: product.product_id || null,
            image: product.image || null,
          };
        }

        const res = await axios.post(
          "https://click2eat-backend-saved-service.onrender.com/api/saved",
          payload,
          {
            headers,
          }
        );

        // Store saved item from backend response
        const savedItem = {
          saved_id: res.data.saved_id,
          customer_id: res.data.customer_id,
          product_id: res.data.product_id,
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          image: res.data.image,
        };

        setLikedProducts((prev) => [...prev, savedItem]);
      }
    } catch (error) {
      console.error("Error toggling saved product:", error);
    }
  };

  // ✅ Check if a product is already saved
  const isLiked = (productId) =>
    likedProducts.some((product) => product.product_id === productId);

  return (
    <SavedContext.Provider value={{ likedProducts, toggleLike, isLiked }}>
      {children}
    </SavedContext.Provider>
  );
};
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
