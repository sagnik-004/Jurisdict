import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Features = ({ darkMode }) => {
  const [featureIndex, setFeatureIndex] = useState(0);

  const features = [
    {
      title: "Predictive Analytics",
      description: "AI-powered case outcome predictions with 95% accuracy",
    },
    {
      title: "Document Automation",
      description: "Generate legal documents in seconds with smart templates",
    },
    {
      title: "Case Tracking",
      description: "Real-time updates and deadline management system",
    },
    {
      title: "Legal Research",
      description: "Access to comprehensive legal databases and precedents",
    },
    {
      title: "Client Management",
      description: "Efficiently manage client information and communications",
    },
    {
      title: "Bail Reckoner",
      description: "Calculate bail amounts with precision using AI algorithms",
    },
  ];

  const handleNextFeature = () => {
    setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrevFeature = () => {
    setFeatureIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  return (
    <section id="features" className="py-12 md:py-20 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16 text-slate-900 dark:text-slate-100">
          Core Features
        </h2>
        <div className="relative px-8 md:px-12">
          <button
            onClick={handlePrevFeature}
            className="absolute -left-1 md:-left-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-[#CFAE6D]/20 hover:bg-gradient-to-r hover:from-[#CFAE6D] hover:to-[#B8954D] text-white shadow-lg transition-all duration-200 z-50 focus:outline-none active:scale-95"
          >
            <ArrowLeft size={16} className="md:hidden" />
            <ArrowLeft size={20} className="hidden md:block" />
          </button>
          <button
            onClick={handleNextFeature}
            className="absolute -right-1 md:-right-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-[#CFAE6D]/20 hover:bg-gradient-to-r hover:from-[#CFAE6D] hover:to-[#B8954D] text-white shadow-lg transition-all duration-200 z-50 focus:outline-none active:scale-95"
          >
            <ArrowRight size={16} className="md:hidden" />
            <ArrowRight size={20} className="hidden md:block" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features
              .slice(featureIndex, featureIndex + 3)
              .map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                  }}
                  transition={{
                    // Initial animation
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    // Hover animations
                    scale: { duration: 0.2, ease: "easeOut" },
                    y: { duration: 0.2, ease: "easeOut" },
                  }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl cursor-pointer hover:shadow-2xl hover:border-[#CFAE6D] dark:hover:border-[#CFAE6D] transform-gpu ${
                    darkMode
                      ? "bg-slate-800/80 border-slate-700/50 hover:shadow-green-400/20 backdrop-blur-sm"
                      : "bg-white/90 border-slate-200/50 hover:shadow-green-400/25 backdrop-blur-sm"
                  } border-2 transition-[border-color,box-shadow,background] duration-200 min-h-[200px] flex flex-col justify-start hover:bg-gradient-to-br ${
                    darkMode
                      ? "hover:from-slate-800/90 hover:to-slate-700/90"
                      : "hover:from-white hover:to-green-50/40"
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 leading-tight">
                    {feature.title}
                  </h3>
                  <p
                    className={`text-base md:text-lg leading-relaxed ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Features;