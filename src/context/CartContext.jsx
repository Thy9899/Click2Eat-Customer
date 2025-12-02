<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from "react";
import { saveLastOrderToLocal } from "../utils/localOrder";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const loadCartFromLocal = () => {
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
  if (!lastOrder) return [];
  const now = new Date().getTime();
  if (now - lastOrder.timestamp > 60 * 60 * 1000) {
    localStorage.removeItem("lastOrder");
    return [];
  }
  return lastOrder.order.items || [];
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCartFromLocal);
  const [confirmed, setConfirmed] = useState(false);
  const [lastOrder, setLastOrder] = useState(() => {
    const order = JSON.parse(localStorage.getItem("lastOrder"));
    return order ? order.order : null;
  });

  useEffect(() => {
    if (cart.length > 0 && !confirmed) {
      // save in-progress order as last order
      saveLastOrderToLocal({ items: cart });
      setLastOrder({ items: cart });
    }
  }, [cart, confirmed]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product_id === product.product_id
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeRowCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setConfirmed(false);
  };

  const confirmCart = (order) => {
    setConfirmed(true);
    setLastOrder(order);
    saveLastOrderToLocal(order);
    setCart([]); // clear cart after confirm
  };

  const resetConfirmation = () => {
    setConfirmed(false);
    setLastOrder(null);
    localStorage.removeItem("lastOrder");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        confirmed,
        lastOrder,
        addToCart,
        removeFromCart,
        removeRowCart,
        clearCart,
        confirmCart,
        resetConfirmation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
=======
import React, { createContext, useContext, useState, useEffect } from "react";
import { saveLastOrderToLocal } from "../utils/localOrder";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const loadCartFromLocal = () => {
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
  if (!lastOrder) return [];
  const now = new Date().getTime();
  if (now - lastOrder.timestamp > 60 * 60 * 1000) {
    localStorage.removeItem("lastOrder");
    return [];
  }
  return lastOrder.order.items || [];
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCartFromLocal);
  const [confirmed, setConfirmed] = useState(false);
  const [lastOrder, setLastOrder] = useState(() => {
    const order = JSON.parse(localStorage.getItem("lastOrder"));
    return order ? order.order : null;
  });

  useEffect(() => {
    if (cart.length > 0 && !confirmed) {
      // save in-progress order as last order
      saveLastOrderToLocal({ items: cart });
      setLastOrder({ items: cart });
    }
  }, [cart, confirmed]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product_id === product.product_id
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeRowCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setConfirmed(false);
  };

  const confirmCart = (order) => {
    setConfirmed(true);
    setLastOrder(order);
    saveLastOrderToLocal(order);
    setCart([]); // clear cart after confirm
  };

  const resetConfirmation = () => {
    setConfirmed(false);
    setLastOrder(null);
    localStorage.removeItem("lastOrder");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        confirmed,
        lastOrder,
        addToCart,
        removeFromCart,
        removeRowCart,
        clearCart,
        confirmCart,
        resetConfirmation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
