import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home } from "lucide-react";

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

    if (!isSignin) {
      try {
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
        setError(null);

        setTimeout(() => {
          navigate(`/d/${response.data.username}`);
        }, 1500);

      } catch (err) {
        console.error('Signup Error:', err.response?.data);
        setError(err.response?.data?.message || "Error signing up");
        setMessage(null);
      }
    } else {
      try {
        const response = await axiosInstance.post(
          "/detainee/login",
          {
            emailOrUsername: formData.usernameOrEmail,
            password: formData.password,
          },
          { withCredentials: true }
        );

        setMessage("Login successful! Redirecting...");
        setError(null);

        setTimeout(() => {
          navigate(`/d/${response.data.username}`);
        }, 1500);

      } catch (err) {
        console.error('Login Error:', err.response?.data);
        setError(err.response?.data?.message || "Error logging in");
        setMessage(null);
      }
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
        <h2 style={{ marginBottom: "20px", color: "#333", fontSize: "24px", fontWeight: "600" }}>
          {isSignin ? "Login" : "Sign up"}
        </h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
          {isSignin ? "Login to continue" : "Create an account to continue"}
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

        {message && (
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
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isSignin ? (
            <>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <User
                  size={18}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
                <Lock
                  size={18}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
            </>
          ) : (
            <>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <Mail
                  size={18}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ position: "relative", marginBottom: "15px" }}>
                <Lock
                  size={18}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
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
            </>
          )}
          <button
            type="submit"
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
              e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            }}
          >
            {isSignin ? "Login" : "Sign up"}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <p>
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={toggleForm}
              style={{
                color: "#667eea",
                cursor: "pointer",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              {isSignin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetaineeSigninSignup;
