import React from 'react';

const Case = ({ caseItem, expandedCase, onToggle }) => {
  const isExpanded = expandedCase === caseItem._id;
  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
      onClick={() => onToggle(caseItem._id)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {caseItem.caseTitle}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Case ID: {caseItem.caseId}
          </p>
        </div>
        <svg
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Court:</strong> {caseItem.courtName}</p>
          <p><strong>Filing Date:</strong> {new Date(caseItem.filingDate).toLocaleDateString()}</p>
          <p><strong>Judge ID:</strong> {caseItem.judgeId}</p>
          <p><strong>Summary:</strong> {caseItem.caseSummary}</p>
        </div>
      )}
    </div>
  );
};

export default Case;