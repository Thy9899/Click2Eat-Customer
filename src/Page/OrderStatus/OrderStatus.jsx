import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./OrderStatus.css";

const DELIVERY_ORIGIN = { lat: 11.5564, lon: 104.9282 };
const AVG_SPEED_KMH = 25;
const ROAD_FACTOR = 1.25;

/* =============================
   HELPER FUNCTIONS
============================= */
const toRad = (d) => (d * Math.PI) / 180;

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateRoute = (destLat, destLon) => {
  const straightKm = haversineKm(
    DELIVERY_ORIGIN.lat,
    DELIVERY_ORIGIN.lon,
    destLat,
    destLon
  );

  const distanceKm = straightKm * ROAD_FACTOR;
  const durationMin = (distanceKm / AVG_SPEED_KMH) * 60;

  return {
    distanceKm,
    durationMin,
  };
};

const OrderStatus = () => {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const [progress, setProgress] = useState(0);
  const [leftDistance, setLeftDistance] = useState(0);
  const [leftDuration, setLeftDuration] = useState(0);
  const [originalDistance, setOriginalDistance] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);

  /* =============================
     FETCH LAST ORDER
  ============================= */
  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://click2eat-backend-order-service.onrender.com/api/order/last",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const lastOrder = res.data.order;
        if (!lastOrder) {
          toast.error("No order found");
          setLoading(false);
          return;
        }

        setOrder(lastOrder);
        setConfirmed(lastOrder.status === "confirmed");
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch last order");
        setLoading(false);
      }
    };

    fetchLastOrder();
    return () => clearInterval(intervalRef.current);
  }, []);

  /* =============================
     DELIVERY PROGRESS SIMULATION
  ============================= */
  useEffect(() => {
    if (!order || !confirmed || order.completed || order.status === "canceled")
      return;

    if (!order.shipping_address?.location) return;

    const [lat, lon] = order.shipping_address.location.split(",").map(Number);

    const { distanceKm, durationMin } = calculateRoute(lat, lon);

    setOriginalDistance(distanceKm.toFixed(2));
    setOriginalDuration(durationMin.toFixed(1));
    setLeftDistance(distanceKm.toFixed(2));
    setLeftDuration(durationMin.toFixed(1));

    if (!order.deliveryStartTime) return;

    intervalRef.current = setInterval(() => {
      const startTime = new Date(order.deliveryStartTime).getTime();
      const now = Date.now();

      const elapsedMs = now - startTime;
      const totalMs = durationMin * 60 * 1000;

      const newProgress = Math.min((elapsedMs / totalMs) * 100, 100);
      setProgress(newProgress);

      const remainingMin = Math.max((totalMs - elapsedMs) / 60000, 0);
      setLeftDuration(remainingMin.toFixed(1));

      const remainingKm = Math.max(
        distanceKm - (distanceKm * newProgress) / 100,
        0
      );
      setLeftDistance(remainingKm.toFixed(2));

      if (newProgress >= 100) {
        clearInterval(intervalRef.current);
        markOrderCompleted();
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [order, confirmed]);

  /* =============================
     MARK COMPLETED
  ============================= */
  const markOrderCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `https://click2eat-backend-order-service.onrender.com/api/order/complete/${order._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder((prev) => ({ ...prev, completed: true }));
      toast.success("🎉 Order Completed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark order completed");
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>No order found.</p>;

  const [lat, lon] = order.shipping_address?.location
    ? order.shipping_address.location.split(",")
    : [0, 0];

  // =============================
  // UI
  // =============================
  return (
    <div className="order-wrapper">
      <div className="header-order-status">
        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </button>
        <h2 className="page-title">📦 Order Status</h2>
      </div>

      <div className="orders-list">
        {order.status === "cancelled" ? (
          <div className="canceled-box">❌ Your Order Has Been Canceled</div>
        ) : order.completed ? (
          <div className="completed-box">
            🎉 Your Order Has Been Delivered Successfully!
          </div>
        ) : !confirmed ? (
          <div className="admin-confirmed">
            <div className="cus-information">
              <span>🚚 Delivery Information</span>
              <p>
                <b>Customer:</b> {order.shipping_address.fullName}
              </p>
              <p>
                <b>Phone:</b> {order.shipping_address.phone}
              </p>
              <p>
                <b>City:</b> {order.shipping_address.city}
              </p>
              <p>
                <b>Location:</b> {lat}, {lon}
              </p>
              <p>
                <b>Status:</b> {order.status}
              </p>
            </div>

            <div className="deliver-info">
              <span>⏳ Waiting for admin to confirm your order...</span>
              <div className="pending-confirm">⏳</div>
            </div>
          </div>
        ) : (
          <div className="admin-confirmed">
            <div className="cus-information">
              <span>🚚 Delivery Information</span>
              <p>
                <b>Customer:</b> {order.shipping_address.fullName}
              </p>
              <p>
                <b>Phone:</b> {order.shipping_address.phone}
              </p>
              <p>
                <b>City:</b> {order.shipping_address.city}
              </p>
              <p>
                <b>Location:</b> {lat}, {lon}
              </p>
              <p>
                <b>Status:</b> {order.status}
              </p>
            </div>

            <div className="deliver-info">
              <span>🏍️ Your Order Is On The Way!</span>
              <p>
                <b>Total Distance:</b> {originalDistance} km
              </p>
              <p>
                <b>Total ETA:</b> {originalDuration} minutes
              </p>

              <div className="progress-bar-container">
                <span className="label-start">Start 📍</span>
                <span className="label-end">End 🏁</span>
                <span className="driver-icon" style={{ left: `${progress}%` }}>
                  <img src="https://images.icon-icons.com/2989/PNG/512/express_shipping_delivery_service_hour_icon_187260.png" />
                </span>
              </div>

              <p className="Progress-info">
                Progress: <b>{progress.toFixed(1)}%</b>
              </p>

              <div className="remaining-info">
                <div className="remaining-title">📉 Live Countdown</div>
                <p>
                  <b>Remaining Distance:</b> {leftDistance} km
                </p>
                <p>
                  <b>Remaining Time:</b> {leftDuration} minutes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
