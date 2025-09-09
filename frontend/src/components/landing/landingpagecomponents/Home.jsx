import React from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import TypeWriter from "./Typewriter";

const Home = ({ darkMode }) => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-20 pb-8 relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mobile Layout - Logo and tagline first, then content */}
        <div className="lg:hidden flex flex-col items-center space-y-8">
          {/* Logo and Brand - Mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#CFAE6D] shadow-xl">
              <Scale size={40} className="text-white sm:hidden" />
              <Scale size={60} className="text-white hidden sm:block" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#0A2342] dark:text-white">
                JurisDict
              </h1>
              <div
                className={`flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
                  darkMode
                    ? "bg-[#CFAE6D]/15 text-[#CFAE6D] border border-[#CFAE6D]/25"
                    : "bg-[#0A2342]/10 text-[#0A2342] border border-[#0A2342]/20"
                }`}
              >
                <span className="font-medium">Get bailed out</span>
                <span className="text-[#ca6841] font-semibold">
                  ✨ real quick
                </span>
              </div>
            </div>
          </div>

          {/* Main content - Mobile */}
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#0A2342] dark:text-white">
                AI-Powered Legal
                <br />
                <span className="text-[#CFAE6D]">
                  <TypeWriter
                    words={["Case Management", "Bail Reckoner", "Case Predictor"]}
                  />
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Bail Decisions and Intelligent Case Management— Faster Than Ever
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={() => {
                  const element = document.getElementById("features");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-[#CFAE6D] hover:bg-[#B8954D] text-white text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 text-base sm:text-lg font-semibold transition-all duration-300 ${
                  darkMode
                    ? "border-[#2E222E] text-white hover:bg-[#2E222E] hover:border-[#CFAE6D]"
                    : "border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white"
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two columns */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
          {/* Left side - Logo and Brand */}
          <div className="flex flex-col items-center justify-center h-full">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="p-6 rounded-3xl bg-[#CFAE6D] shadow-xl">
                <Scale size={60} className="text-white" />
              </div>
              <div>
                <h1 className="text-6xl xl:text-7xl font-bold text-[#0A2342] dark:text-white">
                  JurisDict
                </h1>
                <div
                  className={`flex items-center justify-center gap-2 mt-3 px-5 py-2 rounded-full text-base ${
                    darkMode
                      ? "bg-[#CFAE6D]/15 text-[#CFAE6D] border border-[#CFAE6D]/25"
                      : "bg-[#0A2342]/10 text-[#0A2342] border border-[#0A2342]/20"
                  }`}
                >
                  <span className="font-medium">Get bailed out</span>
                  <span className="text-[#ca6841] font-semibold">
                    ✨ real quick
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Main content */}
          <div className="text-left space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl xl:text-6xl font-bold leading-tight text-[#0A2342] dark:text-white">
                AI-Powered Legal
                <br />
                <span className="text-[#CFAE6D]">
                  <TypeWriter
                    words={["Case Management", "Bail Reckoner", "Case Predictor"]}
                  />
                </span>
              </h2>

              <p
                className={`text-xl xl:text-2xl leading-relaxed max-w-2xl ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Bail Decisions and Intelligent Case Management— Faster Than Ever
              </p>
            </div>

            <div className="flex gap-4 justify-start">
              <button
                onClick={() => {
                  const element = document.getElementById("features");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-xl bg-[#CFAE6D] hover:bg-[#B8954D] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-8 py-4 rounded-xl border-2 text-lg font-semibold transition-all duration-300 ${
                  darkMode
                    ? "border-[#2E222E] text-white hover:bg-[#2E222E] hover:border-[#CFAE6D]"
                    : "border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white"
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;