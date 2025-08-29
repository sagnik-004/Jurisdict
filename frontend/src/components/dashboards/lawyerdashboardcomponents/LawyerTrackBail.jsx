import React, { useState, useEffect } from "react";
import { HelpOutline, ExpandMore, ExpandLess } from "@mui/icons-material";
import { axiosInstance } from "../../../lib/axios.js";

const LawyerTrackBail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appeals, setAppeals] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?.lawyerId) {
        return;
      }
      try {
        const [appealsRes, pendingRes] = await Promise.all([
          axiosInstance.get(`/lawyer/bail-appeals/${user.lawyerId}`),
          axiosInstance.get(`/lawyer/pending-bails/${user.lawyerId}`),
        ]);
        setAppeals(appealsRes.data.appeals);
        setPendingCases(pendingRes.data.pendingCases);
      } catch (error) {
        console.error("Error fetching bail cases:", error);
      }
    };

    fetchCases();
  }, [user?.lawyerId]);

  const handleAskAI = async (caseId, groundsOfBail, caseSummary) => {
    setLoading(true);
    alert("This feature is coming soon!");
    setLoading(false);
  };

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const renderCaseList = (cases) => (
    <ul className="space-y-4">
      {cases.map((caseItem) => (
        <li key={caseItem._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative">
          <div className="flex-grow pr-12">
            <p className="font-bold text-gray-900 dark:text-white">{caseItem.caseTitle}</p>
            {expandedCaseId === caseItem._id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Detainee Username:</strong> {caseItem.detaineeUsername}</p>
                <p><strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}</p>
                <p><strong>Judge Comments:</strong> {caseItem.judgeComments?.join(", ") || "No comments"}</p>
                <p><strong>Case Summary:</strong> {caseItem.caseSummary}</p>
                <p><strong>Status:</strong> <span className="font-semibold">{caseItem.status}</span></p>
                <div className="flex justify-end pt-2">
                    <button
                        onClick={() => handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        <HelpOutline fontSize="small" />
                        {loading ? "Processing..." : "Ask AI"}
                    </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => toggleExpand(caseItem._id)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab(0)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 0
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'
            }`}
          >
            Appeals from Detainee
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 1
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'
            }`}
          >
            Pending to Judge
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Bail Appeals ({appeals.length})</h3>
            {renderCaseList(appeals)}
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Pending with Judge ({pendingCases.length})</h3>
            {renderCaseList(pendingCases)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerTrackBail;

