import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PaymentProvider } from "./context/PaymentContext";
import { SavedProvider } from "./context/SavedContext";
import { OrderStatusProvider } from "./context/OrderStatusContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <PaymentProvider>
          <SavedProvider>
            <OrderStatusProvider>
              <Routes>
                <Route path="/*" element={<Home />} />
              </Routes>
            </OrderStatusProvider>
          </SavedProvider>
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
