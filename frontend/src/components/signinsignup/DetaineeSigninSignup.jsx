import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const DetaineeSigninSignup = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    username: "",
    password: "",
    usernameOrEmail: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignin(!isSignin);
    setError(null);
    setMessage(null);
    setFormData({
      name: "",
      address: "",
      email: "",
      username: "",
      password: "",
      usernameOrEmail: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!isSignin) {
        const response = await axiosInstance.post(
          "/detainee/signup",
          {
            name: formData.name,
            address: formData.address,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
          { withCredentials: true }
        );

        setMessage("Sign-up successful! Redirecting...");
        setTimeout(() => {
          navigate(`/d/${response.data.username}`);
        }, 1500);
      } else {
        const response = await axiosInstance.post(
          "/detainee/login",
          {
            emailOrUsername: formData.usernameOrEmail,
            password: formData.password,
          },
          { withCredentials: true }
        );

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(`/d/${response.data.username}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    muted: darkMode ? "#94A3B8" : "#64748B",
    primary: darkMode ? "#818CF8" : "#6366F1",
    secondary: darkMode ? "#EC4899" : "#EC4899",
    glass: darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
    border: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0F172A, #1E293B)"
          : "linear-gradient(135deg, #F8FAFC, #E2E8F0)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          background: colors.glass,
          padding: "40px",
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          boxShadow: darkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.2)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              color: colors.text,
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center",
              flex: 1,
            }}
          >
            {isSignin ? "Login" : "Sign up"}
          </motion.h2>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.text,
              position: "absolute",
              right: 0,
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ color: colors.muted, marginBottom: "20px", fontSize: "14px" }}
        >
          {isSignin ? "Login to continue" : "Create an account to continue"}
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: darkMode ? "#FFEBEE20" : "#FFEBEE",
              color: "#C62828",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: darkMode ? "#E8F5E920" : "#E8F5E9",
              color: "#2E7D32",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {!isSignin ? (
              <>
                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <User
                    size={18}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: colors.muted,
                    }}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                    style={{
                      width: "calc(100% - 40px)",
                      padding: "10px 10px 10px 35px",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      outline: "none",
                      fontSize: "14px",
                      background: "none",
                      color: colors.text,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>
                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <Home
                    size={18}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: colors.muted,
                    }}
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="Address"
                    required
                    onChange={handleChange}
                    style={{
                      width: "calc(100% - 40px)",
                      padding: "10px 10px 10px 35px",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      outline: "none",
                      fontSize: "14px",
                      background: "none",
                      color: colors.text,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>
                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: colors.muted,
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    required
                    onChange={handleChange}
                    style={{
                      width: "calc(100% - 40px)",
                      padding: "10px 10px 10px 35px",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      outline: "none",
                      fontSize: "14px",
                      background: "none",
                      color: colors.text,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>
                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <User
                    size={18}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: colors.muted,
                    }}
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Username"
                    required
                    onChange={handleChange}
                    style={{
                      width: "calc(100% - 40px)",
                      padding: "10px 10px 10px 35px",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      outline: "none",
                      fontSize: "14px",
                      background: "none",
                      color: colors.text,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: colors.muted,
                    }}
                  />
                  <input
                    type="text"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    placeholder="Username or Email"
                    required
                    onChange={handleChange}
                    style={{
                      width: "calc(100% - 40px)",
                      padding: "10px 10px 10px 35px",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      outline: "none",
                      fontSize: "14px",
                      background: "none",
                      color: colors.text,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.muted,
                }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                required
                onChange={handleChange}
                style={{
                  width: "calc(100% - 40px)",
                  padding: "10px 10px 10px 35px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "14px",
                  background: "none",
                  color: colors.text,
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#8B5CF6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              marginTop: "10px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: darkMode
                ? "0 4px 6px rgba(0, 0, 0, 0.2)"
                : "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Processing..." : isSignin ? "Login" : "Sign up"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          style={{ marginTop: "20px", fontSize: "14px", color: colors.muted }}
        >
          <p>
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={toggleForm}
              style={{
                color: colors.primary,
                cursor: "pointer",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              {isSignin ? "Sign up" : "Login"}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DetaineeSigninSignup;