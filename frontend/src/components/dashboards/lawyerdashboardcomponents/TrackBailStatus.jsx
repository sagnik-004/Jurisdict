import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios.js";
import Case from "./Case.jsx";

const TrackBailStatus = () => {
  const [pendingBailCases, setPendingBailCases] = useState([]);
  const [expandedCase, setExpandedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOngoingCases = async () => {
      if (!user?.lawyerId) {
        setLoading(false);
        return;
      }
      try {
        setError(null);
        setLoading(true);
        const response = await axiosInstance.get(`/lawyer/${user.lawyerId}/ongoing-cases`);
        const allCases = response.data.cases || [];
        const filteredCases = allCases.filter(
          (c) => c.bailStatus === "Pending to judge"
        );
        setPendingBailCases(filteredCases);
      } catch (err) {
        console.error("Error fetching ongoing cases:", err);
        setError("Failed to fetch cases. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingCases();
  }, [user?.lawyerId]);

  const handleToggle = (caseId) => {
    setExpandedCase((prevExpandedCase) =>
      prevExpandedCase === caseId ? null : caseId
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Loading cases...
        </p>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 mt-8">{error}</p>;
    }
    if (pendingBailCases.length === 0) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No bail applications are currently pending with a judge.
        </p>
      );
    }
    return (
      <div>
        {pendingBailCases.map((caseItem) => (
          <Case
            key={caseItem._id}
            caseItem={caseItem}
            expandedCase={expandedCase}
            onToggle={handleToggle}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bail Applications Pending with Judge
        </h2>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default TrackBailStatus;