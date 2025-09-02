import React, { useState } from "react";
import { Search } from "lucide-react";
import Case from "./Case.jsx";

const UnraisedBails = ({ cases }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleCase = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const filteredCases = cases.filter((c) =>
    c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Unraised Bails
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by case title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem) => (
            <Case
              key={caseItem._id}
              caseItem={caseItem}
              expandedCase={expandedCase}
              onToggle={toggleCase}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No unraised bails found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UnraisedBails;