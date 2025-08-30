import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { axiosInstance } from "../../../lib/axios.js";
import Case from "./Case.jsx";

const DecidedCases = () => {
  const [activeTab, setActiveTab] = useState("granted");
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDecidedCases = async () => {
      if (!user?.lawyerId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/lawyer/${user.lawyerId}/ongoing-cases`
        );
        setAllCases(response.data.cases || []);
      } catch (err) {
        console.error("Error fetching decided cases:", err);
        setError("Failed to fetch cases. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDecidedCases();
  }, [user?.lawyerId]);

  const grantedCases = allCases.filter((c) => c.bailStatus === "Accepted");
  const declinedCases = allCases.filter((c) => c.bailStatus === "Declined");

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const searchResults = searchQuery
    ? allCases.filter(
        (c) =>
          (c.bailStatus === "Accepted" || c.bailStatus === "Declined") &&
          c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderCaseList = (cases) => {
    if (loading) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Loading...
        </p>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 mt-8">{error}</p>;
    }
    if (cases.length === 0) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No cases to display in this category.
        </p>
      );
    }
    return (
      <div className="space-y-4">
        {cases.map((caseItem) => (
          <Case
            key={caseItem._id}
            caseItem={caseItem}
            expandedCase={expandedCaseId}
            onToggle={toggleExpand}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Decided Cases
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search decided cases..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Search Results ({searchResults.length})
          </h3>
          {searchResults.length > 0 ? (
            renderCaseList(searchResults)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No cases found matching your search.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("granted")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "granted"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                Bail Accepted
              </button>
              <button
                onClick={() => setActiveTab("declined")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "declined"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                Bail Declined
              </button>
            </nav>
          </div>
          <div className="mt-6">
            {activeTab === "granted" && renderCaseList(grantedCases)}
            {activeTab === "declined" && renderCaseList(declinedCases)}
          </div>
        </>
      )}
    </div>
  );
};

export default DecidedCases;