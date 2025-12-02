import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { customer, logout, setCustomer } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    username: customer?.username || "",
    email: customer?.email || "",
    picture: customer?.image || null,
    phone: customer?.phone || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!customer) navigate("/");
  }, [customer, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setForm((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append("phone", form.phone);

      if (form.picture instanceof File) {
        formData.append("image", form.picture);
      }

      if (form.password) formData.append("password", form.password);

      const res = await fetch(
        `https://click2eat-backend-customer-service.onrender.com/api/customers/profile/${customer.customer_id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      const updatedCustomer = { ...customer, ...data.customer };
      setCustomer(updatedCustomer);
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));

      setMessage("✅ Profile updated successfully!");
      setShowEdit(false);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          <img src="./src/assets/icon/back.png" alt="back" />
          <span>Back</span>
        </button>
        <h2 className="page-title">🧑‍💼 Profile</h2>
      </div>

      <div className={`profile-card-container ${showEdit ? "edit-mode" : ""}`}>
        {/* LEFT CARD */}
        <div className="profile-left">
          {/* <img
            className="profile-photo"
            src={
              customer.image
                ? customer.image.startsWith("http")
                  ? customer.image
                  : `https://click2eat-backend-customer-service.onrender.com/Images/${customer.image}`
                : "./Photos/profile.png"
            }
            alt="profile"
          /> */}

          <h3 className="profile-title">{customer.username}</h3>

          <div className="edit-icon-btn" onClick={() => setShowEdit(!showEdit)}>
            <i className="bx bx-edit"></i>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          <div className="info-title">
            <h2>Information</h2>
            <hr />
          </div>

          {!showEdit ? (
            <>
              <div className="info-group">
                <label>Email</label>
                <p>{customer.email}</p>
              </div>

              <div className="info-group">
                <label>Username</label>
                <p>{customer.username}</p>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <p>{customer.phone || "—"}</p>
              </div>

              {/* Social Icons */}
              <div className="social-links">
                <a>
                  <img src="https://images.icon-icons.com/2108/PNG/512/facebook_icon_130940.png" />
                </a>
                <a>
                  <img src="https://images.icon-icons.com/2108/PNG/512/telegram_icon_130816.png" />
                </a>
                <a>
                  <img src="https://images.icon-icons.com/836/PNG/512/Instagram_icon-icons.com_66804.png" />
                </a>
              </div>
            </>
          ) : (
            /* INLINE EDIT FORM */
            <form className="edit-form" onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <label>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
              />

              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <label>Profile Image</label>
              <input type="file" name="picture" onChange={handleChange} />

              <label>New Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <div className="edit-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setShowEdit(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {message && <p className="status-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
