import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  // Load orders on mount
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
            headers: { Authorization: `Bearer ${token}` },
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

  // Select all checkbox
  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setSelectedOrders(newState ? orders.map((o) => o._id) : []);
  };

  // Toggle individual checkbox
  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete selected orders or single order
  const handleDeleteSelected = async (ids = selectedOrders) => {
    if (ids.length === 0) {
      alert("No orders selected.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${ids.length} order(s)?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5000/api/customerOrders/delete-multiple",
        {
          data: { ids },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove deleted orders from UI
      setOrders((prev) => prev.filter((order) => !ids.includes(order._id)));

      // Reset selection if deleting selectedOrders
      if (ids === selectedOrders) {
        setSelectedOrders([]);
        setSelectAll(false);
      }

      alert("Order(s) deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete order(s).");
    }
  };

  return (
    <div className="history-wrapper">
      <div className="header-history">
        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="bx bx-chevron-left"></i>
          <span>Back</span>
        </button>
        <h2 className="page-title">⏰ Order History</h2>
      </div>

      {loading ? (
        <div className="spinner-center">
          <p>Loading History...</p>
        </div>
      ) : (
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
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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
                    <td>${order.total_price?.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteSelected([order._id])}
                      >
                        <i className="bx bxs-trash"></i>
                      </button>
                    </td>
                    <td>
                      <div
                        className="history-btn-detail"
                        onClick={() => navigate(`/history-detail/${order._id}`)}
                      >
                        Details
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
      )}
    </div>
  );
};

export default History;
