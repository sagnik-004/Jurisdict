import React, { useState } from "react";
import Case from "./Case";

const TrackBailStatus = () => {
  const [pendingBailCases, setPendingBailCases] = useState([]);
  const [expandedCase, setExpandedCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = (caseId) => {
    setExpandedCase((prevExpandedCase) =>
      prevExpandedCase === caseId ? null : caseId
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center mt-8">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="ml-4 text-orange-600 dark:text-orange-400">
            Loading...
          </p>
        </div>
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