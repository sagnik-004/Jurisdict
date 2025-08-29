import React, { useState } from "react";

const AddCase = () => {
  const [caseSummary, setCaseSummary] = useState("");

  const handleCaseSummaryChange = (event) => {
    setCaseSummary(event.target.value);
  };

  const handleSubmit = () => {
    if (caseSummary.length < 250) {
      alert("Case Summary must be at least 250 words.");
      return;
    }
    console.log("Case submitted successfully!");
  };

  const inputFields = [
    { label: "Case ID", type: "text" },
    { label: "Case Title", type: "text" },
    { label: "BNS Section", type: "text" },
    { label: "Court Name", type: "text" },
    { label: "Judge ID", type: "text" },
    { label: "Filing Date", type: "date" },
    { label: "Hearing Dates", type: "date" },
    { label: "Police Station", type: "text" },
    { label: "Detainee ID", type: "text" },
    { label: "Bail Filing Date", type: "date" },
    { label: "Grounds for Bail", type: "text" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Case Summary (Minimum 250 words)
        </label>
        <textarea
          rows="5"
          value={caseSummary}
          onChange={handleCaseSummaryChange}
          placeholder="Enter case summary..."
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          Submit Case
        </button>
      </div>
    </div>
  );
};

export default AddCase;