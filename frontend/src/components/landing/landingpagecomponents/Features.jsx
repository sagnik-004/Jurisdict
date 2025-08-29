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
    setFeatureIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <section id="features" className="py-20 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
        <div className="relative">
          <motion.button
            onClick={handlePrevFeature}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-500 text-white z-50"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <motion.button
            onClick={handleNextFeature}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-500 text-white z-50"
          >
            <ArrowRight size={16} />
          </motion.button>
          <div className="grid grid-cols-3 gap-8">
            {features
              .slice(featureIndex, featureIndex + 3)
              .map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-xl cursor-pointer transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}
                >
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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