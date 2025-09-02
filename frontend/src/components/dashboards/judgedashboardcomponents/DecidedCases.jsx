import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { axiosInstance } from "../../../lib/axios.js";
import Case from "./Case.jsx";

const DecidedCases = () => {
  const [activeTab, setActiveTab] = useState("granted");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDecidedCases();
  }, []);

  const fetchDecidedCases = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.judgeId) {
        const response = await axiosInstance.get(`/judge/${user.judgeId}/ongoing-cases`);
        const decidedCases = response.data.cases.filter(caseItem => 
          caseItem.bailStatus === "Accepted" || caseItem.bailStatus === "Declined"
        );
        setCases(decidedCases);
      }
    } catch (error) {
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const grantedCases = cases.filter((c) => c.bailStatus === "Accepted");
  const declinedCases = cases.filter((c) => c.bailStatus === "Declined");

  const toggleCase = (caseId) =>
    setExpandedCase(expandedCase === caseId ? null : caseId);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filterCases = (cases) =>
    cases.filter((c) =>
      c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderList = (cases) => (
    <div className="space-y-4">
      {cases.length > 0 ? (
        filterCases(cases).map((c) => (
          <Case
            key={c._id}
            caseItem={c}
            expandedCase={expandedCase}
            onToggle={toggleCase}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No cases in this category.
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-center items-center mt-8">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Decided Cases
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by case title..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
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
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Bail Granted
          </button>
          <button
            onClick={() => setActiveTab("declined")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "declined"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Bail Declined
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "granted" && renderList(grantedCases)}
        {activeTab === "declined" && renderList(declinedCases)}
      </div>
    </div>
  );
};

export default DecidedCases;