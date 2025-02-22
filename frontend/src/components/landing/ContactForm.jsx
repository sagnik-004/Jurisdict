import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faGooglePlusG } from "@fortawesome/free-brands-svg-icons";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8FAF6",
        padding: "40px",
        borderRadius: "8px",
        Width: "100%",
        margin: "auto",
      }}
    >
      {/* Left Section: Contact Info */}
      <div style={{ width: "40%", paddingRight: "20px" }}>
        <h2 style={{fontSize: "24px", fontWeight: "600", marginBottom: "10px" }}>Contact Us</h2>
        <p style={{ color: "#555" }}>Our mailing address is:</p>
        <p style={{ color: "#444", marginBottom: "8px" }}>152A Charlotte Street, Peterborough ON</p>
        <p style={{ color: "#444", fontWeight: "bold" }}>Phone: 705-742-3221</p>

        {/* Social Media Icons */}
        <div style={{ marginTop: "10px", display: "flex", gap: "15px" }}>
          <a href="#" style={{ fontSize: "20px", color: "#333" }}>
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="#" style={{ fontSize: "20px", color: "#333" }}>
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#" style={{ fontSize: "20px", color: "#333" }}>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="#" style={{ fontSize: "20px", color: "#333" }}>
            <FontAwesomeIcon icon={faGooglePlusG} />
          </a>
        </div>
      </div>

      {/* Right Section: Contact Form */}
      <div style={{ width: "55%", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
        <p style={{ color: "#555", marginBottom: "15px" }}>
          <strong>Great vision without great people is irrelevant.</strong>
          <br />
          Let's work together.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "640px",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter a valid email address"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "640px",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            required
          />
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            style={{
              width: "640px",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              height: "80px",
            }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#8B5CF6",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
