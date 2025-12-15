import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

/* -----------------------------
   HELPER FUNCTIONS
----------------------------- */

// Haversine distance (km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Custom route calculation (NO API)
const calculateRoute = (origin, dest) => {
  const straightKm = calculateDistanceKm(
    origin.lat,
    origin.lon,
    dest.lat,
    dest.lon
  );

  // Adjust for real roads
  const ROAD_FACTOR = 1.25;
  const distanceKm = straightKm * ROAD_FACTOR;

  // Average delivery speed (motorbike)
  const AVG_SPEED = 25; // km/h
  const durationMin = (distanceKm / AVG_SPEED) * 60;

  return {
    distanceKm: distanceKm.toFixed(2),
    durationMin: durationMin.toFixed(1),
  };
};

const MapView = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState(null);

  // DELIVERY ORIGIN (Restaurant)
  const DELIVERY_ORIGIN = {
    lat: 11.5564,
    lon: 104.9282,
  };

  /* -----------------------------
     1. Initialize Map
  ----------------------------- */
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView(
      [DELIVERY_ORIGIN.lat, DELIVERY_ORIGIN.lon],
      13
    );
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

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
          {
            headers: {
              "User-Agent": "FoodDeliveryApp/1.0",
            },
          }
        );
        const data = await res.json();
        setLocationData(data);
      } catch (err) {
        console.error("Nominatim error", err);
      }
    });
  }, []);

  /* -----------------------------
     2. Get My Location
  ----------------------------- */
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

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
          {
            headers: {
              "User-Agent": "FoodDeliveryApp/1.0",
            },
          }
        );
        const data = await res.json();
        setLocationData(data);
      } catch (err) {
        console.error("Nominatim error", err);
      }
    });
  };

  /* -----------------------------
     3. Confirm Location
  ----------------------------- */
  const handleConfirm = () => {
    if (!locationData) {
      alert("Please pin a location first");
      return;
    }

    const dest = {
      lat: parseFloat(locationData.lat),
      lon: parseFloat(locationData.lon),
    };

    const route = calculateRoute(DELIVERY_ORIGIN, dest);

    navigate("/checkout", {
      state: {
        locationCode: `${dest.lat}, ${dest.lon}`,
        distance: route.distanceKm,
        duration: route.durationMin,
        address: locationData.display_name,
      },
    });
  };

  /* -----------------------------
     4. UI
  ----------------------------- */
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
          <div className="location-details">
            <h2>📌 Location Details</h2>
            {locationData ? (
              <>
                <p>
                  <b>Latitude:</b> {locationData.lat}
                </p>
                <p>
                  <b>Longitude:</b> {locationData.lon}
                </p>
                <p>
                  <b>Country:</b> {locationData.address?.country}
                </p>
                <p>
                  <b>City:</b>{" "}
                  {locationData.address?.city ||
                    locationData.address?.town ||
                    "N/A"}
                </p>
                <p>
                  <b>Road:</b> {locationData.address?.road || "Unknown"}
                </p>
                <p>
                  <b>Postcode:</b> {locationData.address?.postcode || "N/A"}
                </p>
              </>
            ) : (
              <p>Click on map to select a location</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
