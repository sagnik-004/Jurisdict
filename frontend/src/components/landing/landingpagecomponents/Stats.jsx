import React from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Users, Scale } from "lucide-react";

const Stats = ({ darkMode }) => {
  const comparisons = [
    {
      icon: Clock,
      title: "Processing Time",
      traditional: "3-7 days",
      withAI: "15 minutes",
      description: "From case filing to bail recommendation",
    },
    {
      icon: TrendingUp,
      title: "Decision Accuracy",
      traditional: "Variable",
      withAI: "Consistent",
      description: "Standardized analysis reduces human bias",
    },
    {
      icon: Users,
      title: "Workload Capacity",
      traditional: "8-12 cases/day",
      withAI: "40+ cases/day",
      description: "Automated analysis increases throughput",
    },
    {
      icon: Scale,
      title: "Fairness Score",
      traditional: "Subjective",
      withAI: "Objective",
      description: "Data-driven decisions ensure consistency",
    },
  ];

  return (
    <section
      id="stats"
      className={`py-16 md:py-24 px-4 md:px-8 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Why Choose AI-Powered Justice?
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Compare traditional bail processes with our intelligent system
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl border ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-teal-500/50"
                  : "bg-white/70 border-slate-200/50 backdrop-blur-sm hover:border-teal-400/50"
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500">
                  <item.icon className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-teal-500">{item.title}</h3>
              </div>

              <div className="space-y-4 mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-red-900/20 border border-red-500/30"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="text-sm text-red-500 font-medium mb-1">
                    Traditional
                  </div>
                  <div className="text-red-600 font-semibold">
                    {item.traditional}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-teal-900/20 border border-teal-500/30"
                      : "bg-teal-50 border border-teal-200"
                  }`}
                >
                  <div className="text-sm text-teal-500 font-medium mb-1">
                    With JurisDict
                  </div>
                  <div className="text-teal-600 font-semibold">
                    {item.withAI}
                  </div>
                </div>
              </div>

              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            <Scale size={20} className="text-teal-500" />
            <span>Transforming justice through intelligent automation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
