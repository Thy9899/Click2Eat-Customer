import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "./MapView.css";

const MapView = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([11.5564, 104.9282], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      const data = await res.json();

      setLocationData(data);
    });
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const map = mapRef.current;

      map.setView([latitude, longitude], 15);

      if (!markerRef.current) {
        markerRef.current = L.marker([latitude, longitude]).addTo(map);
      } else {
        markerRef.current.setLatLng([latitude, longitude]);
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      const data = await res.json();

      setLocationData(data);
    });
  };

  const handleConfirm = () => {
    if (!locationData) {
      alert("Please pin a location first");
      return;
    }

    const code = `${locationData.lat}, ${locationData.lon}`;
    navigate("/checkout", { state: { locationCode: code } });
  };

  return (
    <div className="map-wrapper">
      <div className="checkout-header">
        <div className="btn-back" onClick={() => navigate("/checkout")}>
          <i className="bx  bx-chevron-left"></i>
          <span>Back</span>
        </div>
        <h2 className="page-title">🛒 Checkout</h2>
      </div>

      <div className="map-container">
        <div className="map-card">
          <button onClick={handleGetLocation} className="map-btn primary">
            📍 My Current Location
          </button>

          <div id="map"></div>

          <button onClick={handleConfirm} className="map-btn confirm">
            Confirm Location
          </button>
        </div>

        <div className="location-detail">
          {locationData ? (
            <div className="location-details">
              <h2>📌 Location Details</h2>
              <p>
                <b>Latitude:</b> {locationData.lat}
              </p>
              <p>
                <b>Longitude:</b> {locationData.lon}
              </p>
              <p>
                <b>Country:</b> {locationData.address.country}
              </p>
              <p>
                <b>City:</b>{" "}
                {locationData.address.city || locationData.address.town}
              </p>
              <p>
                <b>Road:</b> {locationData.address.road || "Unknown"}
              </p>
              <p>
                <b>Postcode:</b> {locationData.address.postcode || "N/A"}
              </p>
              <p style={{ marginTop: "10px" }}>
                <b>Selected:</b> {locationData.lat}, {locationData.lon}
              </p>
            </div>
          ) : (
            <div className="location-details">
              <h2>📌 Location Details</h2>
              <p>
                <b>Latitude:</b>
              </p>
              <p>
                <b>Longitude:</b>
              </p>
              <p>
                <b>Country:</b>
              </p>
              <p>
                <b>City:</b>
              </p>
              <p>
                <b>Road:</b>
              </p>
              <p>
                <b>Postcode:</b>
              </p>
              <p>
                <b>Selected:</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
