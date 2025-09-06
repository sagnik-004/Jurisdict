import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, IconButton } from "@mui/material";
import {
  Menu,
  ChevronLeft,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { axiosInstance } from "../../lib/axios.js";
import Sidebar from "./detaineedashboardcomponents/Sidebar.jsx";
import AddCase from "../common/AddCase.jsx";
import OngoingCases from "./detaineedashboardcomponents/OngoingCases.jsx";
import TrackBailStatus from "./detaineedashboardcomponents/TrackBailStatus.jsx";
import DecidedCases from "./detaineedashboardcomponents/DecidedCases.jsx";
import FAQs from "./detaineedashboardcomponents/FAQs.jsx";

const DetaineeDashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Add Case");
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/landing");
    }
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [isMobile, navigate]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(isDarkTheme ? "light" : "dark");
    root.classList.add(isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await axiosInstance.post("/detainee/logout");
      } catch (error) {
        console.error("Server logout failed", error);
      }
      localStorage.clear();
      navigate("/landing");
    }, 1500);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const renderComponent = () => {
    switch (selectedItem) {
      case "Add Case":
        return <AddCase />;
      case "Ongoing Cases":
        return <OngoingCases />;
      case "Track Bail Status":
        return <TrackBailStatus />;
      case "Decided Cases":
        return <DecidedCases />;
      case "FAQs":
        return <FAQs />;
      default:
        return <AddCase />;
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
        isMobile={isMobile}
        setIsSidebarVisible={setSidebarVisible}
      />

      <main
        className={`transition-all duration-300 ${
          isSidebarVisible && !isMobile ? "ml-72" : "ml-0"
        }`}
      >
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
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

        <div
          className={
            selectedItem === "FAQs" ? "" : "pt-16 px-4 sm:px-6 md:px-8"
          }
        >
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default DetaineeDashboard;