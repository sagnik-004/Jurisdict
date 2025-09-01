import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";

const ProtectedRoute = ({ children, userType }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axiosInstance.get("/auth/refresh", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user, token: newToken } = response.data;

        if (!user || !newToken) {
          throw new Error("Invalid authentication response");
        }

        localStorage.setItem("token", newToken);
        setUser(user);

      } catch (error) {
        console.error("Authentication failed:", error.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  if (userType && user.type !== userType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;