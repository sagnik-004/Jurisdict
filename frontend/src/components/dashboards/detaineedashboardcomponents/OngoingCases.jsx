import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axios";
import { motion } from "framer-motion";

const OngoingCases = ({ themeColors }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.username) {
        setError("User not authenticated");
        return;
      }

      const response = await axiosInstance.get(
        `/detainee/ongoing/${user.username}`
      );

      setCases(response.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cases");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading)
    return <div style={{ color: themeColors.text }}>Loading cases...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        maxWidth: "1200px",
        padding: "2rem",
        background: themeColors.glass,
        borderRadius: "12px",
        margin: "2rem auto",
        backdropFilter: "blur(10px)",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          color: themeColors.text,
          fontSize: "1.8rem",
          fontWeight: 600,
          marginBottom: "2rem",
          borderBottom: `2px solid ${themeColors.text}20`,
          paddingBottom: "1rem",
        }}
      >
        Ongoing Cases
      </h3>

      {error && (
        <div
          style={{
            color: "#ef4444",
            marginBottom: "1.5rem",
            fontSize: "1.1rem",
          }}
        >
          {error}
        </div>
      )}

      {cases.length === 0 ? (
        <div
          style={{
            color: themeColors.text,
            opacity: 0.7,
            fontSize: "1.1rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No ongoing cases found
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {cases.map((caseItem) => (
            <motion.div
              key={caseItem._id}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                padding: "1.5rem",
                background: themeColors.background,
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      color: themeColors.text,
                      fontSize: "1.2rem",
                      margin: 0,
                    }}
                  >
                    {caseItem.caseTitle}
                  </h4>
                  <p
                    style={{
                      color: themeColors.text,
                      opacity: 0.8,
                      fontSize: "0.95rem",
                      margin: "0.5rem 0 0 0",
                    }}
                  >
                    {caseItem.courtName}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      color: themeColors.text,
                      opacity: 0.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    {new Date(caseItem.filingDate).toLocaleDateString("en-IN")}
                  </span>
                  <div
                    style={{
                      backgroundColor: themeColors.buttonBg,
                      color: "#fff",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {caseItem.status}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: themeColors.text,
                      fontSize: "0.95rem",
                      opacity: 0.8,
                    }}
                  >
                    Judge: {caseItem.judgeName}
                  </span>
                </div>
                <div
                  style={{
                    color: themeColors.text,
                    fontSize: "0.95rem",
                    opacity: 0.8,
                  }}
                >
                  Detainee: @{caseItem.detaineeUsername}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OngoingCases;
