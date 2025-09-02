import React, { useState } from "react";

const AIPopup = ({ isOpen, onClose, data, isLoading, error }) => {
  const [expandedCase, setExpandedCase] = useState(null);

  const handleToggle = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const renderMarkdown = (text) => {
    if (!text) return "";
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-4">$1</h1>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>');
  };

  if (!isOpen) return null;

  const aiRecommendation = data?.aiAssistance;
  const relatedCases = data?.similarCases || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Analysis & Related Cases
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Analyzing case data...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center text-red-500">
                <p>{error}</p>
              </div>
            </div>
          ) : data ? (
            <>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a.75.75 0 01.75.75V4h1.25a.75.75 0 010 1.5H10.75V7h-1.5V5.5H8a.75.75 0 010-1.5h1.25V2.75A.75.75 0 0110 2zM5.636 4.636a.75.75 0 011.06 0l.955.955a.75.75 0 01-1.06 1.06l-.955-.955a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4v-1.25a.75.75 0 011.5 0V9.25h1.25a.75.75 0 010 1.5H5.5v1.25a.75.75 0 01-1.5 0V10.75H2.75A.75.75 0 012 10zm11.364 4.364a.75.75 0 010 1.06l-.955.955a.75.75 0 01-1.06-1.06l.955-.955a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75V16h-1.25a.75.75 0 010-1.5h1.25v-1.25a.75.75 0 011.5 0V14.5h1.25a.75.75 0 010 1.5H10.75V17.25A.75.75 0 0110 18zm4.364-11.364a.75.75 0 011.06 0l.955.955a.75.75 0 01-1.06 1.06l-.955-.955a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Recommendation
                  </h3>
                </div>
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed pl-11 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="mb-3">${renderMarkdown(aiRecommendation || "No recommendation available.")}</p>` 
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Related Cases
                </h3>
                <div className="space-y-4">
                  {relatedCases.length > 0 ? (
                    relatedCases.map((caseItem) => {
                      const isExpanded = expandedCase === caseItem._id;
                      return (
                        <div key={caseItem._id} className="mb-4">
                          <div
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 overflow-hidden"
                            onClick={() => handleToggle(caseItem._id)}
                          >
                            <div className="border-l-4 border-blue-500">
                              <div className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <svg
                                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {caseItem.caseTitle}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div
                                      className={`w-6 h-6 rounded bg-gray-800 dark:bg-gray-600 flex items-center justify-center transition-transform duration-300 ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    >
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`transition-all duration-400 ease-in-out overflow-visible ${
                                isExpanded
                                  ? "max-h-none opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-4">
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-gray-600 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <h5 className="text-base font-semibold text-gray-900 dark:text-white">
                                      Case Summary
                                    </h5>
                                  </div>
                                  <div 
                                    className="pl-9 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                      __html: `<p class="mb-3">${renderMarkdown(caseItem.caseSummary)}</p>` 
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No related cases found.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AIPopup;