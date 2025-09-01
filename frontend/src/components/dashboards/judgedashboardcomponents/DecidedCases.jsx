import React, { useState } from "react";
import { Search } from "lucide-react";

const DecidedCaseCard = ({ caseItem, expandedCase, onToggle }) => {
  const isExpanded = expandedCase === caseItem._id;

  return (
    <div className="mb-4">
      <div
        className={`bg-white dark:bg-gray-800 border-l-4 ${
          caseItem.bailStatus === "Accepted"
            ? "border-green-500"
            : "border-red-500"
        } border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 overflow-hidden`}
        onClick={() => onToggle(caseItem._id)}
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {caseItem.caseTitle}
            </h3>
            <div
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-6 space-y-4">
            <p>
              <span className="font-semibold">Case ID:</span> {caseItem.caseId}
            </p>
            <p>
              <span className="font-semibold">Filing Date:</span>{" "}
              {new Date(caseItem.filingDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  caseItem.bailStatus === "Accepted"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {caseItem.bailStatus}
              </span>
            </p>
            <p>
              <span className="font-semibold">Judge's Comments:</span>{" "}
              {caseItem.judgeComments?.join(", ") || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DecidedCases = ({ decidedCases }) => {
  const [activeTab, setActiveTab] = useState("granted");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);

  const grantedCases = decidedCases.filter((c) => c.bailStatus === "Accepted");
  const declinedCases = decidedCases.filter((c) => c.bailStatus === "Declined");

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
          <DecidedCaseCard
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