import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { axiosInstance } from "../../../lib/axios.js";
import Case from "./Case";

const DecidedCases = () => {
  const [activeTab, setActiveTab] = useState("granted");
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?.username) {
        setError("User not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/detainee/${user.username}/ongoing-cases`
        );
        if (response.data && response.data.success) {
          setAllCases(response.data.data || []);
        } else {
          setError(response.data.message || "Failed to fetch cases.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching cases."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [user?.username]);

  const grantedCases = allCases.filter(
    (c) =>
      c.bailStatus === "Accepted" &&
      c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const declinedCases = allCases.filter(
    (c) =>
      c.bailStatus === "Declined" &&
      c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const renderCaseList = (cases) => {
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
    </div>
  );
};

export default DecidedCases;