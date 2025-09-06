import React, { useState, useEffect } from "react";
import { Search, Gavel, Calendar, FileText, User } from "lucide-react";
import { axiosInstance } from "../../../lib/axios.js";
import Case from "./Case.jsx";

const UnraisedBails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCase, setExpandedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOngoingCases();
  }, []);

  const fetchOngoingCases = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.judgeId) {
        const response = await axiosInstance.get(
          `/judge/${user.judgeId}/ongoing-cases`
        );
        const filteredCases = response.data.cases.filter(
          (caseItem) => caseItem.bailStatus === ""
        );
        setCases(filteredCases);
      }
    } catch (error) {
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleCase = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const filteredCases = cases.filter((c) =>
    c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Loading unraised bail cases...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Unraised Bail Cases
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                  Cases awaiting bail application submission
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cases by title..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white bg-white shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Unraised Bail Cases
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "No cases match your search criteria."
                    : "All cases have bail applications submitted."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-lg font-medium">
                    {filteredCases.length} case
                    {filteredCases.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredCases.map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {caseItem.caseTitle}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Case ID: {caseItem._id?.slice(-6)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Filed:{" "}
                                {new Date(
                                  caseItem.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                            Bail Pending
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCase(caseItem._id)}
                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        {expandedCase === caseItem._id
                          ? "Hide Details"
                          : "View Case Details"}
                      </button>

                      {expandedCase === caseItem._id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <Case
                            caseItem={caseItem}
                            expandedCase={expandedCase}
                            onToggle={toggleCase}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnraisedBails;
