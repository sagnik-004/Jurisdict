import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import { Menu, ChevronLeft, Sun, Moon } from "lucide-react";
import Sidebar from "./judgedashboardcomponents/Sidebar.jsx";
import UnraisedBails from "./judgedashboardcomponents/UnraisedBails.jsx";
import PendingDecisions from "./judgedashboardcomponents/PendingDecisions.jsx";
import DecidedCases from "./judgedashboardcomponents/DecidedCases.jsx";
import FAQ from "./judgedashboardcomponents/FAQ.jsx";

const JudgeDashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Unraised Bails");
  const [mode, setMode] = useState("light");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [bailAppeals, setBailAppeals] = useState([]);
  const [decidedCases, setDecidedCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(mode === "light" ? "dark" : "light");
    root.classList.add(mode);
  }, [mode]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchData(loggedInUser.username);
    } else {
      navigate("/landing");
    }
  }, [navigate]);

  const fetchData = (username) => {
    axiosInstance
      .get(`/judge/cases/${username}`)
      .then((res) => setCases(res.data));
    axiosInstance
      .get(`/judge/bail-appeals/${username}`)
      .then((res) => setBailAppeals(res.data));
    axiosInstance
      .get(`/judge/decided-cases/${username}`)
      .then((res) => setDecidedCases(res.data));
  };

  const onBailDecisionUpdate = () => fetchData(user.username);

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await axiosInstance.post("/judge/logout");
      } catch (error) {
        console.error("Server logout failed", error);
      }
      localStorage.clear();
      navigate("/landing");
    }, 1500);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Unraised Bails":
        return <UnraisedBails cases={cases} />;
      case "Pending Decisions":
        return (
          <PendingDecisions
            bailAppeals={bailAppeals}
            onUpdate={onBailDecisionUpdate}
          />
        );
      case "Decided Cases":
        return <DecidedCases decidedCases={decidedCases} />;
      case "FAQs":
        return <FAQ />;
      default:
        return <UnraisedBails cases={cases} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-[100]">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
          <p className="text-white text-lg mt-4">Logging out...</p>
        </div>
      )}

      <Sidebar
        user={user}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isSidebarVisible={isSidebarVisible}
        handleLogout={handleLogout}
      />

      <main
        className={`transition-all duration-300 ${
          isSidebarVisible ? "ml-72" : "ml-0"
        }`}
      >
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <button
          onClick={toggleSidebar}
          className={`fixed top-4 bg-gray-800 text-white p-2 rounded-full z-50 transition-all duration-300 ${
            isSidebarVisible ? "left-72" : "left-4"
          }`}
        >
          {isSidebarVisible ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>

        <div className="pt-16 px-4 sm:px-6 md:px-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default JudgeDashboard;