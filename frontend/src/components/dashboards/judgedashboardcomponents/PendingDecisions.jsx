import React, { useState } from "react";
import { axiosInstance } from "../../../lib/axios.js";
import { Search } from "lucide-react";

const PendingDecisionCard = ({ caseItem, expandedCase, onToggle, onAction }) => {
  const isExpanded = expandedCase === caseItem._id;
  const [comment, setComment] = useState("");

  const handleAction = (e, action) => {
    e.stopPropagation();
    onAction(caseItem._id, action, comment);
    setComment("");
  };

  return (
    <div className="mb-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="cursor-pointer p-6" onClick={() => onToggle(caseItem._id)}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{caseItem.caseTitle}</h3>
            <div className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-6 space-y-4">
            <p><span className="font-semibold">Case ID:</span> {caseItem.caseId}</p>
            <p><span className="font-semibold">Detainee:</span> {caseItem.detaineeName}</p>
            <p><span className="font-semibold">Grounds for Bail:</span> {caseItem.groundsOfBail.join(", ")}</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add your comments..."
              className="w-full mt-4 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              rows="3"
            />
            <div className="flex justify-end items-center gap-4 mt-4">
              <button onClick={(e) => handleAction(e, "Accepted")} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Approve</button>
              <button onClick={(e) => handleAction(e, "Declined")} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Decline</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PendingDecisions = ({ bailAppeals, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);

  const handleAction = async (caseId, status, comments) => {
    try {
      await axiosInstance.post("/judge/bail-decision", { caseId, status, comments });
      onUpdate();
    } catch (err) {
      console.error("Error submitting bail decision:", err);
    }
  };
  
  const toggleCase = (caseId) => setExpandedCase(expandedCase === caseId ? null : caseId);

  const filteredCases = bailAppeals.filter(c => 
    c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Decisions</h2>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by case title..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="space-y-4">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <PendingDecisionCard 
                key={caseItem._id} 
                caseItem={caseItem} 
                expandedCase={expandedCase} 
                onToggle={toggleCase} 
                onAction={handleAction} 
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No cases are currently pending decision.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingDecisions;

