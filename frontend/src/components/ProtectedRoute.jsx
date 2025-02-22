import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, userType }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/auth/refresh",
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (!response.data?.user) {
          throw new Error("Invalid refresh response");
        }

        setUser(response.data.user);
      } catch (error) {
        console.error("Authentication failed:", error);
        // Clear cookie with same attributes
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; sameSite=none";
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    return () => {
      const source = axios.CancelToken.source();
      source.cancel('Component unmounted');
    };
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

  return children;
};

export default ProtectedRoute;
