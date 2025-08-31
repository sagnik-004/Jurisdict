import React, { useState } from "react";
import { axiosInstance } from "../../../lib/axios.js";
import AIPopup from "../../common/AIPopup.jsx";

const Case = ({ caseItem, expandedCase, onToggle }) => {
  const [showAIPopup, setShowAIPopup] = useState(false);
  const isExpanded = expandedCase === caseItem._id;
  const user = JSON.parse(localStorage.getItem("user"));

  const getEntityType = () => {
    if (user?.lawyerId) return "lawyer";
    if (user?.judgeId) return "judge";
    return "detainee";
  };

  const handleAskAI = async (e) => {
    e.stopPropagation();
    setShowAIPopup(true);
    try {
      const entityType = getEntityType();
      const response = await axiosInstance.post(
        `/case/${entityType}/${caseItem.caseId}/process-case`
      );
      console.log("AI response:", response.data);
    } catch (err) {
      console.error("Error processing case with AI:", err);
    }
  };

  const handleRaiseBail = async (e) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.patch(
        `/lawyer/${caseItem.caseId}/forward-to-judge`
      );
      if (response.data && response.data.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error raising bail:", err);
    }
  };

  const handleForwardToJudge = async (e) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.patch(
        `/lawyer/${caseItem.caseId}/forward-to-judge`
      );
      if (response.data && response.data.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error forwarding case:", err);
    }
  };

  return (
    <>
      <div className="mb-4">
        <div
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 overflow-hidden"
          onClick={() => onToggle(caseItem._id)}
        >
          <div className="border-l-4 border-orange-500">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {caseItem.caseTitle}
                    </h3>
                  </div>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded border">
                    Case ID: {caseItem.caseId}
                  </span>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-8 h-8 rounded bg-gray-800 dark:bg-gray-600 flex items-center justify-center transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-400 ease-in-out overflow-visible ${
              isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Court
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {caseItem.courtName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Filing Date
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(
                            caseItem.filingDate || caseItem.verdictDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Judge Name
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {caseItem.judgeName || "Not Assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          ></path>
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6h-3V9a1 1 0 10-2 0v2H4V5z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Judge ID
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {caseItem.judgeId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Case Summary
                    </h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {caseItem.caseSummary || "No summary available."}
                    </p>
                  </div>
                </div>

                {caseItem.aiRecommendation && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        AI Recommendation
                      </h4>
                    </div>
                    <div className="pl-11">
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {caseItem.aiRecommendation}
                      </p>
                    </div>
                  </div>
                )}

                {caseItem.judgeComments &&
                  Array.isArray(caseItem.judgeComments) &&
                  caseItem.judgeComments.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-amber-600 dark:text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Judge Comments
                        </h4>
                      </div>
                      <div className="pl-11">
                        <ul className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 space-y-2">
                          {caseItem.judgeComments.map((comment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="whitespace-pre-wrap">
                                {comment}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-6 flex justify-end items-center gap-4">
                {getEntityType() === "lawyer" && (
                  <>
                    {(caseItem.bailStatus === "" ||
                      caseItem.bailStatus === "Pending to lawyer") && (
                      <button
                        onClick={
                          caseItem.bailStatus === ""
                            ? handleRaiseBail
                            : handleForwardToJudge
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          ></path>
                        </svg>
                        {caseItem.bailStatus === ""
                          ? "Raise Bail"
                          : "Forward to Judge"}
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={handleAskAI}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75V4h1.25a.75.75 0 010 1.5H10.75V7h-1.5V5.5H8a.75.75 0 010-1.5h1.25V2.75A.75.75 0 0110 2zM5.636 4.636a.75.75 0 011.06 0l.955.955a.75.75 0 01-1.06 1.06l-.955-.955a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4v-1.25a.75.75 0 011.5 0V9.25h1.25a.75.75 0 010 1.5H5.5v1.25a.75.75 0 01-1.5 0V10.75H2.75A.75.75 0 012 10zm11.364 4.364a.75.75 0 010 1.06l-.955.955a.75.75 0 01-1.06-1.06l.955-.955a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75V16h-1.25a.75.75 0 010-1.5h1.25v-1.25a.75.75 0 011.5 0V14.5h1.25a.75.75 0 010 1.5H10.75V17.25A.75.75 0 0110 18zm4.364-11.364a.75.75 0 011.06 0l.955.955a.75.75 0 01-1.06 1.06l-.955-.955a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIPopup
        isOpen={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        aiRecommendation={caseItem.aiRecommendation}
      />
    </>
  );
};

export default Case;
