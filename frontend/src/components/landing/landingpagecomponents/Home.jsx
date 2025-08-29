import React from "react";
import { motion } from "framer-motion";
import TypeWriter from "./Typewriter";

const Home = ({ darkMode }) => {
  return (
    <section
      id="home"
      className="h-[calc(100vh-4.5rem)] flex items-center justify-center px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-full mb-4 ${
            darkMode ? "bg-indigo-500/10" : "bg-indigo-100"
          }`}
        >
          <span className="text-indigo-500 text-sm">Get bailed out</span>
          <span className="text-pink-500 text-sm">✨ real quick</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl font-bold leading-tight mb-8"
        >
          AI-Powered Legal
          <br />
          <span className="text-indigo-500">
            <TypeWriter
              words={["Case Management", "Bail Reckoner", "Case Predictor"]}
            />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`text-xl max-w-2xl mx-auto mb-12 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Bail Decisions and Intelligent Case Management- Faster Than Ever
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            onClick={() => {
              const element = document.getElementById("features");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-md bg-indigo-500 text-white text-lg font-medium"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Home;