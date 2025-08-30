import React, { useState, useEffect } from "react";
import { HelpOutline, ExpandMore, ExpandLess } from "@mui/icons-material";
import { axiosInstance } from "../../../lib/axios.js";

const LawyerTrackBail = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPendingCases = async () => {
      if (!user?.lawyerId) {
        return;
      }
      try {
        const response = await axiosInstance.get(`/lawyer/pending-bails/${user.lawyerId}`);
        setPendingCases(response.data.pendingCases || []);
      } catch (error) {
        console.error("Error fetching pending bail cases:", error);
      }
    };

    fetchPendingCases();
  }, [user?.lawyerId]);

  const handleAskAI = async (caseId, groundsOfBail, caseSummary) => {
    setLoading(true);
    alert("This feature is coming soon!");
    setLoading(false);
  };

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const renderCaseList = (cases) => {
    if (cases.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No pending cases found.</p>;
    }

    return (
        <ul className="space-y-4">
        {cases.map((caseItem) => (
            <li key={caseItem._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(caseItem._id)}>
                <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{caseItem.caseTitle}</p>
                <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
                </button>
                </div>
            </div>

            {expandedCaseId === caseItem._id && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Detainee Username:</strong> {caseItem.detaineeUsername}</p>
                    <p><strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}</p>
                    <p><strong>Judge Comments:</strong> {caseItem.judgeComments?.join(", ") || "No comments"}</p>
                    <p><strong>Case Summary:</strong> {caseItem.caseSummary}</p>
                    <p><strong>Status:</strong> <span className="font-semibold px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">{caseItem.status}</span></p>
                </div>
                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        <HelpOutline fontSize="small" />
                        {loading ? "Processing..." : "Ask AI for Suggestions"}
                    </button>
                </div>
                </div>
            )}
            </li>
        ))}
        </ul>
    );
  }


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bail Applications Pending with Judge</h2>
      </div>
      
      <div>
        {renderCaseList(pendingCases)}
      </div>
    </div>
  );
};

export default LawyerTrackBail;