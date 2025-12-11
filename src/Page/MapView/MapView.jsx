import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

const MapView = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState(null);

  // YOUR RESTAURANT / DELIVERY CENTER ORIGIN
  const DELIVERY_ORIGIN = {
    lat: 11.5564,
    lon: 104.9282,
  };

  // -----------------------------
  // 1. Initialize Map
  // -----------------------------
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([11.5564, 104.9282], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Click on map
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

  // -----------------------------
  // 2. Get My Current Location
  // -----------------------------
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

  // -----------------------------
  // 3. Calculate Distance & Duration via OSRM API
  // -----------------------------
  const calculateRoute = async (destLat, destLon) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${DELIVERY_ORIGIN.lon},${DELIVERY_ORIGIN.lat};${destLon},${destLat}?overview=false`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        alert("No route found");
        return null;
      }

      const route = data.routes[0];

      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
      };
    } catch (err) {
      console.error(err);
      alert("Error calculating route");
      return null;
    }
  };

  // -----------------------------
  // 4. Confirm Location + Route Calculation
  // -----------------------------
  const handleConfirm = async () => {
    if (!locationData) {
      alert("Please pin a location first");
      return;
    }

    const destLat = locationData.lat;
    const destLon = locationData.lon;

    const routeInfo = await calculateRoute(destLat, destLon);
    if (!routeInfo) return;

    const distanceKm = (routeInfo.distance / 1000).toFixed(2);
    const durationMin = (routeInfo.duration / 60).toFixed(1);

    navigate("/checkout", {
      state: {
        locationCode: `${destLat}, ${destLon}`,
        distance: distanceKm,
        duration: durationMin,
      },
    });
  };

  // -----------------------------
  // 5. UI
  // -----------------------------
  return (
    <div className="map-wrapper">
      <div className="checkout-header">
        <div className="btn-back" onClick={() => navigate("/checkout")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </div>
        <h2 className="page-title">📍 Your Location</h2>
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
