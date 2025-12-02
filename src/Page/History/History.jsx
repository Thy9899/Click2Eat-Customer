import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]); // <-- NEW
  const [selectAll, setSelectAll] = useState(false); // <-- NEW

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("⚠ No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://click2eat-backend-order-service.onrender.com/api/order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.orders || res.data.list || []);
      } catch (err) {
        console.error("Frontend Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 👉 Handle Select All
  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    if (newState) {
      setSelectedOrders(orders.map((o) => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  // 👉 Handle individual checkbox
  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 👉 Delete selected orders
  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("No orders selected.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedOrders.length} selected order(s)?`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5000/api/customerOrders/delete-multiple",
        {
          data: { ids: selectedOrders }, // <-- send list of IDs
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted orders from UI
      setOrders((prev) =>
        prev.filter((order) => !selectedOrders.includes(order._id))
      );

      // Reset selection
      setSelectedOrders([]);
      setSelectAll(false);

      alert("Selected orders deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete orders.");
    }
  };

  return (
    <div className="history-wrapper">
      <div className="header-history">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">⏰ Order History</h2>
      </div>

      {/* Table */}
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-message">
                  No orders found.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => toggleSelect(order._id)}
                  />
                </td>

                <td>{order._id}</td>
                <td>{order.status || "Processing"}</td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>

                <td>
                  <button className="btn-delete">
                    <i className="bx bxs-trash"></i>
                  </button>
                </td>

                <td>
                  <div
                    className="history-btn-detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/history-detail/${order._id}`);
                    }}
                  >
                    Details
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="btn-delete-selected"
          onClick={handleDeleteSelected}
          disabled={selectedOrders.length === 0}
        >
          Delete Selected ({selectedOrders.length}){" "}
          <i className="bx bxs-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default History;
