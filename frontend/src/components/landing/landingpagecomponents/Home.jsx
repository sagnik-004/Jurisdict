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
      <div className="absolute inset-0 bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-transparent to-cyan-50/20 dark:from-teal-900/10 dark:via-transparent dark:to-cyan-900/5"></div>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, teal 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:hidden flex flex-col items-center space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-2 pb-4">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-xl shadow-teal-500/25">
              <Scale
                size={40}
                className="text-white sm:hidden drop-shadow-sm"
              />
              <Scale
                size={60}
                className="text-white hidden sm:block drop-shadow-sm"
              />
            </div>
            <div className="text-center sm:text-left overflow-visible py-2">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent leading-relaxed py-1">
                JurisDict
              </h1>
              <div
                className={`flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-body ${
                  darkMode
                    ? "bg-gradient-to-r from-teal-400/15 to-cyan-400/15 text-teal-300 border border-teal-400/20"
                    : "bg-gradient-to-r from-teal-50/80 to-cyan-50/80 text-teal-700 border border-teal-200/50 shadow-sm"
                }`}
              >
                <span className="font-medium">Get bailed out</span>
                <span className="font-medium text-rose-400 dark:text-rose-300">
                  <span className="text-yellow-400">✨</span> real quick
                </span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight">
                <span
                  className={`${
                    darkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  AI-Powered Legal
                </span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text">
                  <TypeWriter
                    words={[
                      "Case Management",
                      "Bail Reckoner",
                      "Case Predictor",
                    ]}
                  />
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-body ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Bail Decisions and Intelligent Case Management— Faster Than Ever
              </p>
            </div>

            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-xs mx-auto">
              <button
                onClick={() => {
                  const element = document.getElementById("features");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 min-w-0 px-4 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white text-base sm:text-lg font-body font-semibold transition-all duration-150"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 min-w-0 px-4 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-teal-400 dark:border-teal-500 bg-transparent text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-body font-semibold transition-all duration-150 shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>

        {/* Desktop Layout - Two columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden lg:grid grid-cols-2 gap-12 items-center py-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full pb-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-6 px-4 pb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-xl shadow-teal-500/25">
                <Scale size={60} className="text-white drop-shadow-sm" />
              </div>
              <div className="overflow-visible py-4">
                <h1 className="text-6xl xl:text-7xl font-heading font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent leading-loose py-3 mb-2">
                  JurisDict
                </h1>
                <div
                  className={`flex items-center justify-center gap-2 mt-3 px-5 py-2 rounded-full text-base backdrop-blur-sm font-body ${
                    darkMode
                      ? "bg-gradient-to-r from-teal-400/15 to-cyan-400/15 text-teal-300 border border-teal-400/20"
                      : "bg-gradient-to-r from-teal-50/80 to-cyan-50/80 text-teal-700 border border-teal-200/50 shadow-sm"
                  }`}
                >
                  <span className="font-medium">Get bailed out</span>
                  <span className="font-medium text-rose-400 dark:text-rose-400">
                    <span className="text-yellow-400">✨</span> real quick
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            <div className="space-y-8">
              <h2 className="text-5xl xl:text-6xl font-heading font-bold leading-tight">
                <span
                  className={`${
                    darkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  AI-Powered Legal
                </span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text mt-2 block">
                  <TypeWriter
                    words={[
                      "Case Management",
                      "Bail Reckoner",
                      "Case Predictor",
                    ]}
                  />
                </span>
              </h2>

              <p
                className={`text-xl xl:text-2xl leading-relaxed max-w-2xl font-body ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Bail Decisions and Intelligent Case Management— Faster Than Ever
              </p>
            </div>

            <div className="flex gap-4 justify-start pt-2">
              <button
                onClick={() => {
                  const element = document.getElementById("features");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white text-lg font-body font-semibold transition-all duration-150"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-xl border-2 border-teal-400 dark:border-teal-500 bg-transparent text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-body font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
