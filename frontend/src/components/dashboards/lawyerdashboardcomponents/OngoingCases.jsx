import React, { useState } from 'react';
import { Search } from '@mui/icons-material';
import { axiosInstance } from "../../../lib/axios.js";

const dummyRegisteredCases = [
  {
    _id: 'reg001',
    caseTitle: 'State vs. Sharma',
    caseId: 'CASE-REG-2025-001',
    courtName: 'District Court, Asansol',
    filingDate: '2025-08-15T00:00:00.000Z',
    judgeId: 'JUDGE-01',
    caseSummary: 'A case regarding property dispute and forgery in official documents. The preliminary hearings have concluded.'
  },
  {
    _id: 'reg002',
    caseTitle: 'Verma Corporation vs. Gupta Industries',
    caseId: 'CASE-REG-2025-002',
    courtName: 'High Court, Calcutta',
    filingDate: '2025-07-20T00:00:00.000Z',
    judgeId: 'JUDGE-05',
    caseSummary: 'Corporate litigation concerning a breach of contract and intellectual property rights.'
  }
];

const dummyAppeals = [
  {
    _id: 'app001',
    caseTitle: 'Appeal on behalf of Rohan Mehra',
    caseId: 'CASE-APP-2025-001',
    courtName: 'Sessions Court, Asansol',
    filingDate: '2025-08-22T00:00:00.000Z',
    judgeId: 'JUDGE-02',
    caseSummary: 'Bail appeal for Rohan Mehra, detained in connection with a cyber-fraud case. Grounds for appeal include lack of direct evidence.'
  },
  {
    _id: 'app002',
    caseTitle: 'Appeal for Sunita Devi',
    caseId: 'CASE-APP-2025-002',
    courtName: 'District Court, Asansol',
    filingDate: '2025-08-25T00:00:00.000Z',
    judgeId: 'JUDGE-01',
    caseSummary: 'An appeal challenging the initial remand order, citing procedural errors by the arresting authority.'
  }
];

const CaseItem = ({ caseItem, expandedCase, onToggle }) => {
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

const OngoingCases = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [expandedCase, setExpandedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCaseDescription = (caseId) => {
    setExpandedCase((prev) => (prev === caseId ? null : caseId));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCases = (cases) =>
    cases.filter((caseItem) =>
      caseItem.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderCaseList = (cases, type) => {
    const caseList = filteredCases(cases);
    if (caseList.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No {type} cases found.</p>;
    }
    return (
      <div className="space-y-4">
        {caseList.map((caseItem) => (
          <CaseItem
            key={caseItem._id}
            caseItem={caseItem}
            expandedCase={expandedCase}
            onToggle={toggleCaseDescription}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ongoing Cases</h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by case title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('registered')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'registered'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Registered Cases
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'appeals'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            Appeals from Detainee
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'registered' && renderCaseList(dummyRegisteredCases, 'registered')}
        {activeTab === 'appeals' && renderCaseList(dummyAppeals, 'appeals')}
      </div>
    </div>
  );
};

export default OngoingCases;

