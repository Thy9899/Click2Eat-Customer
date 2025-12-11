import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./OrderStatus.css";

const DELIVERY_ORIGIN = { lat: 11.5564, lon: 104.9282 };

const OrderStatus = () => {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const [progress, setProgress] = useState(0);
  const [leftDistance, setLeftDistance] = useState(0);
  const [leftDuration, setLeftDuration] = useState(0);
  const [originalDistance, setOriginalDistance] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);

  const intervalRef = useRef(null);

  // -----------------------------
  // FETCH LAST ORDER
  // -----------------------------
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

        // only mark loading false after order is set
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

  // -----------------------------
  // DELIVERY PROGRESS SIMULATION
  // -----------------------------
  useEffect(() => {
    if (!order || !confirmed || order.completed) return;
    if (!order.shipping_address?.location) return;

    const [lat, lon] = order.shipping_address.location.split(",").map(Number);

    const fetchRouteAndStart = async () => {
      try {
        const routeRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${DELIVERY_ORIGIN.lon},${DELIVERY_ORIGIN.lat};${lon},${lat}?overview=false`
        );
        const routeData = await routeRes.json();

        if (!routeData.routes?.length) {
          toast.error("No route found");
          return;
        }

        const route = routeData.routes[0];
        const distanceKm = route.distance / 1000;
        const durationMin = route.duration / 60;

        setOriginalDistance(distanceKm.toFixed(2));
        setOriginalDuration(durationMin.toFixed(1));
        setLeftDistance(distanceKm.toFixed(2));
        setLeftDuration(durationMin.toFixed(1));

        if (!order.deliveryDuration) {
          setOrder((prev) => ({ ...prev, deliveryDuration: durationMin }));
        }

        if (!order.deliveryStartTime) return;

        // Start interval
        intervalRef.current = setInterval(() => {
          const startTime = new Date(order.deliveryStartTime).getTime();
          const now = Date.now();
          const elapsedMs = now - startTime;
          const totalMs = order.deliveryDuration * 60 * 1000;

          const newProgress = Math.min((elapsedMs / totalMs) * 100, 100);
          setProgress(newProgress);

          const remaining = Math.max((totalMs - elapsedMs) / 60000, 0);
          setLeftDuration(remaining.toFixed(1));

          const newDistance = Math.max(
            distanceKm - (distanceKm * newProgress) / 100,
            0
          );
          setLeftDistance(newDistance.toFixed(2));

          if (newProgress >= 100) {
            clearInterval(intervalRef.current);
            markOrderCompleted();
          }
        }, 1000);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch route");
      }
    };

    fetchRouteAndStart();
    return () => clearInterval(intervalRef.current);
  }, [order, confirmed]);

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
      toast.error("Failed to mark as completed");
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>No order found.</p>;

  const [lat, lon] = order.shipping_address?.location
    ? order.shipping_address.location.split(",")
    : [0, 0];

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
        {order.completed ? (
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
