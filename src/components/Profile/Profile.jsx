import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";

const Profile = ({ logout }) => {
  const { customer } = useContext(AuthContext);

  if (!customer) return null; // safety check

  return (
    <div className="sub-menu-wrap">
      <div className="sub-menu">
        {/* Customer info */}
        <div className="user-info">
          {/* <img
            src={
              customer.image
                ? customer.image.startsWith("http")
                  ? customer.image
                  : `https://click2eat-backend-customer-service.onrender.com/Images/${customer.image}`
                : "./Photos/profile.png"
            }
            alt={customer.username}
          /> */}
          <img
            src={`https://click2eat-backend-customer-service.onrender.com/Images/${customer.image}`}
            alt={customer.username}
          />
          <h3>{customer.username}</h3>
        </div>
        <hr />

        {/* Links */}
        <Link to="/profile" className="sub-menu-link">
          <img
            src="https://images.icon-icons.com/1769/PNG/512/4092564-about-mobile-ui-profile-ui-user-website_114033.png"
            alt="profile"
          />
          <p>View Profile</p>
        </Link>

        <Link to="/order-status/:order_id" className="sub-menu-link">
          <img
            src="https://images.icon-icons.com/1577/PNG/512/3615755-box-delivery-express-parcel-postman-scooter-service_107909.png"
            alt="status"
          />
          <p>Status Order</p>
        </Link>

        <Link to="/history" className="sub-menu-link">
          <img
            src="https://images.icon-icons.com/1369/PNG/512/-history_89998.png"
            alt="history"
          />
          <p>History</p>
        </Link>

        <button className="sub-menu-link logout-btn-form" onClick={logout}>
          <img
            src="https://images.icon-icons.com/2098/PNG/512/log_out_icon_128821.png"
            alt="logout"
          />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
