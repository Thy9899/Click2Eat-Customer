import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container" id="contact">
      <h1 className="contact-title">
        <span>Contact Us</span>
      </h1>
      <p className="contact-subtitle">
        Get in touch and let us know how we can help.
      </p>

      <div className="contact-cards">
        {/* Address */}
        <div className="contact-card">
          <div className="icon-wrapper">
            <img
              src="https://images.icon-icons.com/317/PNG/512/map-marker-icon_34392.png"
              alt=""
            />
          </div>
          <h3>Address</h3>
          <p>Russian Federation Blvd (110), Phnom Penh 120404</p>
          <a
            href="https://www.google.com/maps/place/Royal+University+of+Phnom+Penh/@11.568676,104.8907417,17z/data=!3m1!4b1!4m6!3m5!1s0x3109519fe4077d69:0x20138e822e434660!8m2!3d11.568676!4d104.8907417!16s%2Fm%2F0278m39?entry=ttu&g_ep=EgoyMDI1MDkyOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
          >
            View on map →
          </a>
        </div>

        {/* Phone */}
        <div className="contact-card">
          <div className="icon-wrapper">
            <img
              src="https://images.icon-icons.com/644/PNG/512/red_phone_icon-icons.com_59526.png"
              alt="Phone Icon"
            />
          </div>
          <h3>Contact</h3>
          <p>+855 (016) 609 284</p>
          <p>+855 (095) 755 873</p>
        </div>

        {/* Email */}
        <div className="contact-card">
          <div className="icon-wrapper">
            <img
              src="https://images.icon-icons.com/1826/PNG/512/4202011emailgmaillogomailsocialsocialmedia-115677_115624.png"
              alt=""
            />
          </div>
          <h3>Email</h3>
          <p>support@mailerbakery.com</p>
          <p>contact@mailerbakery.com</p>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="footer">
        <div className="footer-logo">
          <img
            src="https://img.icons8.com/color/48/000000/bread.png"
            alt="logo"
          />
          <h4>MAILER BAKERY</h4>
          <p>ARTISAN HAND CODED HTML</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae.</p>
        </div>

        <div className="footer-links">
          <div>
            <h5>Explore</h5>
            <ul>
              <li>Services</li>
              <li>For Agencies</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>FAQ</li>
              <li>Team</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        <div className="footer-contact">
          <h5>Get in Touch</h5>
          <p>support@mailerbakery.com</p>
          <p>+91 (996) 788 1994</p>
        </div>
      </footer> */}
    </div>
  );
};

export default ContactUs;
