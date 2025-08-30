import React, { useState } from "react";
import { Search } from "@mui/icons-material";

const dummyBailGranted = [
  {
    _id: "grant001",
    caseTitle: "Priya Singh vs. State",
    caseId: "CASE-DEC-2025-001",
    courtName: "District Court, Asansol",
    verdictDate: "2025-08-10T00:00:00.000Z",
    judgeId: "JUDGE-01",
    judgeComments:
      "Bail granted on the grounds of insufficient evidence for continued detention. The accused has been cooperative.",
  },
  {
    _id: "grant002",
    caseTitle: "Amit Kumar Bail Application",
    caseId: "CASE-DEC-2025-002",
    courtName: "High Court, Calcutta",
    verdictDate: "2025-07-28T00:00:00.000Z",
    judgeId: "JUDGE-05",
    judgeComments:
      "Considering the defendant's clean prior record and community ties, bail is granted with conditions.",
  },
];

const dummyBailDeclined = [
  {
    _id: "decline001",
    caseTitle: "State vs. Rajeev Verma",
    caseId: "CASE-DEC-2025-003",
    courtName: "Sessions Court, Asansol",
    verdictDate: "2025-08-18T00:00:00.000Z",
    judgeId: "JUDGE-02",
    judgeComments:
      "Bail is declined due to the serious nature of the charges and the potential risk of witness tampering.",
  },
  {
    _id: "decline002",
    caseTitle: "Narcotics Case No. 78",
    caseId: "CASE-DEC-2025-004",
    courtName: "Special Court, Asansol",
    verdictDate: "2025-08-05T00:00:00.000Z",
    judgeId: "JUDGE-03",
    judgeComments:
      "Given the quantity of illicit substances involved and flight risk, the bail application is hereby declined.",
  },
];

const CaseItem = ({ caseItem, expandedCase, onToggle, searchResult }) => {
  const isExpanded = expandedCase === caseItem._id;
  const isGranted = caseItem.status === "Granted";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
      onClick={() => onToggle(caseItem._id)}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {caseItem.caseTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Case ID: {caseItem.caseId}
            </p>
          </div>
          {searchResult && (
            <span
              className={`font-semibold px-2.5 py-1 rounded-full text-xs ${
                isGranted
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              Bail {caseItem.status}
            </span>
          )}
          <svg
            className={`w-6 h-6 ml-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Court:</strong> {caseItem.courtName}
            </p>
            <p>
              <strong>Verdict Date:</strong>{" "}
              {new Date(caseItem.verdictDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Presiding Judge ID:</strong> {caseItem.judgeId}
            </p>
            <p>
              <strong>Judge's Comments:</strong> {caseItem.judgeComments}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const DecidedCases = () => {
  const [activeTab, setActiveTab] = useState("granted");
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const searchResults = searchQuery
    ? [
        ...dummyBailGranted
          .filter((c) =>
            c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => ({ ...c, status: "Granted" })),
        ...dummyBailDeclined
          .filter((c) =>
            c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => ({ ...c, status: "Declined" })),
      ]
    : [];

  const renderCaseList = (cases) => (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <CaseItem
          key={caseItem._id}
          caseItem={caseItem}
          expandedCase={expandedCaseId}
          onToggle={toggleExpand}
        />
      ))}
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
            <div className="space-y-4">
              {searchResults.map((caseItem) => (
                <CaseItem
                  key={caseItem._id}
                  caseItem={caseItem}
                  expandedCase={expandedCaseId}
                  onToggle={toggleExpand}
                  searchResult={true}
                />
              ))}
            </div>
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
                Bail Granted
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
            {activeTab === "granted" && renderCaseList(dummyBailGranted)}
            {activeTab === "declined" && renderCaseList(dummyBailDeclined)}
          </div>
        </>
      )}
    </div>
  );
};

export default DecidedCases;