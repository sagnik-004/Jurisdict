import React, { useState, useEffect } from "react";
import {
  Brightness4,
  Brightness7,
  Menu,
  ChevronLeft,
} from "@mui/icons-material";
import Sidebar from "./lawyerdashboardcomponents/Sidebar";
import AddCase from "../common/AddCase";
import OngoingCases from "./lawyerdashboardcomponents/OngoingCases";
import LawyerTrackBail from "./lawyerdashboardcomponents/LawyerTrackBail";
import FAQs from "./lawyerdashboardcomponents/FAQs";

const LawyerDashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Add Case");
  const [mode, setMode] = useState("light");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(mode === "light" ? "dark" : "light");
    root.classList.add(mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Add Case":
        return <AddCase />;
      case "Ongoing Cases":
        return <OngoingCases />;
      case "Track Bail Status":
        return <LawyerTrackBail />;
      case "FAQs":
        return <FAQs />;
      default:
        return <AddCase />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        user={user}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isSidebarVisible={isSidebarVisible}
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
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </button>
        </div>

        <button
          onClick={toggleSidebar}
          className={`fixed top-4 bg-gray-800 text-white p-2 rounded-full z-50 transition-all duration-300 ${
            isSidebarVisible ? "left-72" : "left-4"
          }`}
        >
          {isSidebarVisible ? <ChevronLeft /> : <Menu />}
        </button>

        <div className="pt-16 px-4 sm:px-6 md:px-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default LawyerDashboard;