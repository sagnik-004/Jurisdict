import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Case from "./Case.jsx";
import { axiosInstance } from "../../../lib/axios.js";

const PendingDecisions = ({ onUpdate }) => {
  const [bailAppeals, setBailAppeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);

  const fetchPendingCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.judgeId) {
        throw new Error("Judge ID not found in local storage.");
      }
      const response = await axiosInstance.get(
        `/judge/${user.judgeId}/ongoing-cases`
      );
      if (response.data && Array.isArray(response.data.cases)) {
        const pendingCases = response.data.cases.filter(
          (c) => c.bailStatus === "Pending to judge"
        );
        setBailAppeals(pendingCases);
      }
    } catch (err) {
      console.error("Error fetching pending decisions:", err);
      setError("Failed to fetch pending cases. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCases();
  }, []);

  const toggleCase = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const filteredCases = bailAppeals.filter((c) =>
    c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pending Decisions
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by case title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="ml-4 text-orange-600 dark:text-orange-400">
                Loading...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">
              {error}
            </p>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <Case
                key={caseItem._id}
                caseItem={caseItem}
                expandedCase={expandedCase}
                onToggle={toggleCase}
                onUpdate={() => {
                  fetchPendingCases();
                  if (onUpdate) onUpdate();
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No cases are currently pending decision.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingDecisions;
