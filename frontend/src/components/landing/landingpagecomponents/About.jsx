import React from "react";
import { motion } from "framer-motion";
import { Lock, Gavel, Scale, Sun } from "lucide-react";

const About = ({ darkMode }) => {
  return (
    <section
      id="about"
      className={`py-20 px-8 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          About JurisDict
        </h2>
        <div className="grid grid-cols-2 gap-12 items-center">
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
            <h3 className="text-2xl font-semibold mb-4 text-indigo-500">
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
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                title: "For Detainees",
                description:
                  "Quick and accurate bail predictions to reduce time in custody.",
                icon: <Lock size={24} className="text-indigo-500" />,
              },
              {
                title: "For Lawyers",
                description:
                  "Efficient case management and document automation tools.",
                icon: <Gavel size={24} className="text-indigo-500" />,
              },
              {
                title: "For Judges",
                description:
                  "Data-driven insights to make informed bail decisions.",
                icon: <Scale size={24} className="text-indigo-500" />,
              },
              {
                title: "AI-Powered",
                description:
                  "Advanced algorithms ensure fairness and accuracy in bail predictions.",
                icon: <Sun size={24} className="text-indigo-500" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-xl cursor-pointer transition-all ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 hover:bg-slate-800"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                } border`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {item.icon}
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                </div>
                <p
                  className={`${
                    darkMode ? "text-slate-400" : "text-slate-600"
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