import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, userType }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get("https://jurisdict.onrender.com/auth/refresh", {
          withCredentials: true,
        });

        if (!response.data?.user) {
          throw new Error("Invalid refresh response");
        }

        setUser(response.data.user);
      } catch (error) {
        console.error("Authentication failed:", error);
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

  // If no user, redirect to landing page
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // If userType is specified, check if user has correct type
  if (userType && user.type !== userType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
