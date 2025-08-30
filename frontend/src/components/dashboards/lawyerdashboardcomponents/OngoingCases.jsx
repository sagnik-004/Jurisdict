import React, { useState, useEffect } from 'react';
import { Search } from '@mui/icons-material';
import { axiosInstance } from "../../../lib/axios.js";
import Case from './Case.jsx';

const OngoingCases = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [expandedCase, setExpandedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredCases, setRegisteredCases] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOngoingCases = async () => {
      if (!user?.lawyerId) {
        setError("Lawyer ID not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/lawyer/${user.lawyerId}/ongoing-cases`);
        if (response.data && response.data.success) {
          const allCases = response.data.cases;
          setRegisteredCases(allCases.filter(c => c.bailStatus === ""));
          setAppeals(allCases.filter(c => c.bailStatus === "Pending to lawyer"));
        } else {
          setError(response.data.message || "Failed to fetch cases.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingCases();
  }, [user?.lawyerId]);

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

    if (loading) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Loading cases...</p>;
    }
    
    if (error) {
        return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    }

    if (caseList.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No {type} cases found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {caseList.map((caseItem) => (
          <Case
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
        {activeTab === 'registered' && renderCaseList(registeredCases, 'registered')}
        {activeTab === 'appeals' && renderCaseList(appeals, 'appeals')}
      </div>
    </div>
  );
};

export default OngoingCases;