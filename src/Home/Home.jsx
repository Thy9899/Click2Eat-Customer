import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Dashboard from "../Page/Dashboard/Dashboard";
import Cart from "../Page/Cart/CartPage";
import Checkout from "../Page/Checkout/Checkout";
import Payment from "../Page/PaymentPage/Payment";
import PaymentSuccess from "../Page/PaymentSuccess/PaymentSuccess";
import Saved from "../Page/Saved/SavedPage";
import Profile from "../Page/ProfilePage/ProfilePage";
import History from "../Page/History/History";
import OrderStatus from "../Page/Order/OrderStatus";
import Invoice from "../Page/Invoice/Invoice";
import History_Detail from "../Page/HistoryDetail/HistoryDetail";
import ProductDetial from "../Page/ProductDetail/ProductDetial";
import MapView from "../Page/MapView/MapView";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Navbar onSearch={setSearchTerm} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard searchTerm={searchTerm} />} />
          <Route path="/product/:product_id" element={<ProductDetial />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:order_id" element={<Payment />} />
          <Route
            path="/payment-success/:order_id"
            element={<PaymentSuccess />}
          />
          <Route path="/order-status/:order_id" element={<OrderStatus />} />
          <Route path="/invoice/:order_id" element={<Invoice />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route
            path="/history-detail/:order_id"
            element={<History_Detail />}
          />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
