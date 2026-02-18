import React from "react";
import { motion } from "framer-motion";
import { Lock, Gavel, Scale, Sun } from "lucide-react";

const About = ({ darkMode }) => {
  return (
    <section
      id="about"
      className={`relative py-12 md:py-20 px-4 md:px-8 overflow-hidden ${
        darkMode ? "bg-slate-800" : "bg-slate-50"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-slate-900/30 to-teal-900/10"
              : "bg-gradient-to-br from-teal-50/30 to-cyan-50/20"
          }`}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, ${
              darkMode ? "rgba(6, 182, 212, 0.1)" : "rgba(6, 182, 212, 0.05)"
            } 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${
              darkMode ? "rgba(20, 184, 166, 0.1)" : "rgba(20, 184, 166, 0.05)"
            } 0%, transparent 50%)`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          About JurisDict
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-8 rounded-xl ${
              darkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            } border ${
              darkMode
                ? "shadow-lg shadow-white/10"
                : "shadow-lg shadow-black/5"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-4 text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text">
              Simplifying the Bail Process
            </h3>
            <p
              className={`${
                darkMode ? "text-slate-400" : "text-slate-600"
              } leading-relaxed`}
            >
              JurisDict is an AI-powered platform designed to simplify the bail
              process for detainees, lawyers, and judges. By leveraging advanced
              AI algorithms, we provide accurate bail predictions, streamline
              legal workflows, and ensure fair and timely justice for all.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          >
            {[
              {
                title: "For Detainees",
                description:
                  "Quick and accurate bail predictions to reduce time in custody.",
                icon: <Lock size={24} className="text-teal-500" />,
              },
              {
                title: "For Lawyers",
                description:
                  "Efficient case management and document automation tools.",
                icon: <Gavel size={24} className="text-teal-500" />,
              },
              {
                title: "For Judges",
                description:
                  "Data-driven insights to make informed bail decisions.",
                icon: <Scale size={24} className="text-teal-500" />,
              },
              {
                title: "AI-Powered",
                description:
                  "Advanced algorithms ensure fairness and accuracy in bail predictions.",
                icon: <Sun size={24} className="text-teal-500" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-150 hover:scale-110 ${
                  darkMode
                    ? "bg-slate-900/80 border-slate-700 backdrop-blur-sm hover:bg-slate-800/90"
                    : "bg-white/80 border-slate-200 backdrop-blur-sm hover:bg-slate-50/90"
                } border`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {item.icon}
                  <h4 className="text-lg font-semibold text-teal-500">
                    {item.title}
                  </h4>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
