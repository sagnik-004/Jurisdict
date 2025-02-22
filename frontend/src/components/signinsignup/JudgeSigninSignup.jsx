import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home, Briefcase } from "lucide-react";

const JudgeSigninSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    username: "",
    judgeId: "",
    password: "",
    judgeIdOrUsername: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!isLogin) {
        const { judgeIdOrUsername, ...signupData } = formData;
        const response = await axiosInstance.post("/judge/signup", signupData);
        setSuccess("Signup successful! Redirecting...");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        setTimeout(() => navigate(`/j/${formData.username}`), 1500);
      } else {
        const response = await axiosInstance.post("/judge/login", {
          judgeIdOrUsername: formData.judgeIdOrUsername,
          password: formData.password,
        });
        setSuccess("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate(`/j/${response.data.user.username}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#ffffff",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {isLogin ? "Login" : "Sign up"}
        </h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
          {isLogin ? "Login to continue" : "Create an account to continue"}
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <Briefcase
                  size={18}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                  }}
                />
                <input
                  type="text"
                  name="judgeIdOrUsername"
                  value={formData.judgeIdOrUsername}
                  placeholder="Judge ID or Username"
                  required
                  onChange={handleChange}
                  style={{
                    width: "calc(100% - 40px)",
                    padding: "10px 10px 10px 35px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
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
                    color: "#999",
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
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
                    color: "#999",
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
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
                    color: "#999",
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <Briefcase
                  size={18}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                  }}
                />
                <input
                  type="number"
                  name="judgeId"
                  value={formData.judgeId}
                  placeholder="Judge ID"
                  required
                  onChange={handleChange}
                  style={{
                    width: "calc(100% - 40px)",
                    padding: "10px 10px 10px 35px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
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
                color: "#999",
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
                border: "1px solid #ddd",
                borderRadius: "8px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              marginTop: "10px",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
            }}
            onMouseOut={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            }}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign up"}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
                setFormData({
                  name: "",
                  address: "",
                  email: "",
                  username: "",
                  judgeId: "",
                  password: "",
                  judgeIdOrUsername: "",
                });
              }}
              style={{
                color: "#667eea",
                cursor: "pointer",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JudgeSigninSignUp;
