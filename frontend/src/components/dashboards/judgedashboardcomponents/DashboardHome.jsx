import React from "react";
import { Scale, Gavel, FileText, BarChart3 } from "lucide-react";

const DashboardHome = ({ user, dashboardStats, setSelectedItem }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Judicial Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user?.name && `Welcome, ${user.name}`} •{" "}
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItem("Pending Decisions")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Decisions
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardStats.pendingDecisions}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Requires Action
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItem("Unraised Bails")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Unraised Bails
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardStats.unraisedBails}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Awaiting Applications
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItem("Decided Cases")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Decided Cases
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardStats.decidedCases}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Cases
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardStats.totalCases}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Under Jurisdiction
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Priority Actions
            </h3>
            <div className="space-y-4">
              {dashboardStats.pendingDecisions > 0 && (
                <div
                  className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
                  onClick={() => setSelectedItem("Pending Decisions")}
                >
                  <Scale className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Review {dashboardStats.pendingDecisions} Pending Decision
                      {dashboardStats.pendingDecisions !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bail applications awaiting your review
                    </p>
                  </div>
                  <div className="text-orange-600 dark:text-orange-400">→</div>
                </div>
              )}

              {dashboardStats.unraisedBails > 0 && (
                <div
                  className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => setSelectedItem("Unraised Bails")}
                >
                  <Gavel className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Monitor {dashboardStats.unraisedBails} Case
                      {dashboardStats.unraisedBails !== 1 ? "s" : ""} Without
                      Bail Applications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cases that may require bail consideration
                    </p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">→</div>
                </div>
              )}

              {dashboardStats.pendingDecisions === 0 &&
                dashboardStats.unraisedBails === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      All caught up! No pending actions at this time.
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Session
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Since
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jurisdiction
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {dashboardStats.totalCases} Active Cases
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
