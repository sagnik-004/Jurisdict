import React from "react";
import { motion } from "framer-motion";

const Stats = ({ darkMode }) => {
  return (
    <section
      id="stats"
      className={`py-20 px-8 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Proven Results</h2>
        <div className="grid grid-cols-4 gap-8">
          {[
            {
              value: "95%",
              label: "Model Accuracy",
              color: "text-emerald-500",
            },
            { value: "500K+", label: "Cases Analyzed", color: "text-blue-500" },
            {
              value: "2.4M",
              label: "Legal Documents",
              color: "text-purple-500",
            },
            {
              value: "98%",
              label: "User Satisfaction",
              color: "text-pink-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl text-center ${
                darkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              } border`}
            >
              <div className={`text-5xl font-bold mb-4 ${stat.color}`}>
                {stat.value}
              </div>
              <div
                className={`text-lg ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;