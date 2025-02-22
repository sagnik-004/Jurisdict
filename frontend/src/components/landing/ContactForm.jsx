import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const ContactForm = ({ darkMode, colors }) => {
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
        backgroundColor: darkMode ? "#1E293B" : "#F8FAFC",
        padding: "40px",
        borderRadius: "8px",
        width: "95%",
        margin: "auto",
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ width: "40%", paddingRight: "20px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "10px" }}
        >
          Contact Us
        </h2>
        <p style={{ color: colors.muted }}>Our mailing address is:</p>
        <p style={{ color: colors.muted, marginBottom: "8px" }}>
          152A Charlotte Street, Peterborough ON
        </p>
        <p style={{ color: colors.muted, fontWeight: "bold" }}>
          Phone: 705-742-3221
        </p>
        <div style={{ marginTop: "10px", display: "flex", gap: "15px" }}>
          <a
            href="#"
            style={{
              fontSize: "20px",
              color: colors.muted,
              transition: "all 0.2s ease",
              ":hover": { color: colors.primary },
            }}
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            style={{
              fontSize: "20px",
              color: colors.muted,
              transition: "all 0.2s ease",
              ":hover": { color: colors.primary },
            }}
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            style={{
              fontSize: "20px",
              color: colors.muted,
              transition: "all 0.2s ease",
              ":hover": { color: colors.primary },
            }}
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            style={{
              fontSize: "20px",
              color: colors.muted,
              transition: "all 0.2s ease",
              ":hover": { color: colors.primary },
            }}
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      <div
        style={{
          width: "55%",
          backgroundColor: colors.background,
          padding: "20px",
          borderRadius: "8px",
          boxShadow: darkMode
            ? "0px 0px 10px rgba(255, 255, 255, 0.1)"
            : "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ color: colors.muted, marginBottom: "15px" }}>
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
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: colors.background,
              color: colors.text,
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
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: colors.background,
              color: colors.text,
            }}
            required
          />
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              fontSize: "14px",
              height: "80px",
              backgroundColor: colors.background,
              color: colors.text,
            }}
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: colors.primary,
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;