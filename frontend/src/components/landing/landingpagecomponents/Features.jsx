import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Features = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Triple the features for seamless infinite scroll
  const infiniteFeatures = [...features, ...features, ...features];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    }
    return 3; // default for SSR
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTranslateX = () => {
    const percentage = 100 / cardsPerView;
    return currentIndex * percentage;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="features"
      className={`py-12 md:py-20 px-4 md:px-8 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative"
      >
        <h2
          className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-6 md:mb-8 lg:mb-16 px-4 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Core Features
        </h2>

        <div className="relative py-4 md:py-8">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 z-20 focus:outline-none active:scale-95"
          >
            <ArrowLeft size={16} className="md:hidden" />
            <ArrowLeft size={20} className="hidden md:block" />
          </button>

          <button
            onClick={handleNext}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 z-20 focus:outline-none active:scale-95"
          >
            <ArrowRight size={16} className="md:hidden" />
            <ArrowRight size={20} className="hidden md:block" />
          </button>

          {/* Carousel Container with proper padding for shadows */}
          <div
            className="overflow-hidden px-4 md:px-8 py-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${getTranslateX()}%)`,
              }}
            >
              {infiniteFeatures.map((feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2 md:px-3"
                >
                  <div
                    className={`h-full p-4 md:p-6 lg:p-8 rounded-2xl border cursor-pointer transition-all duration-200 ease-out transform hover:-translate-y-2 hover:scale-[1.02] ${
                      darkMode
                        ? "bg-slate-800/90 border-slate-700/50 hover:border-teal-400/50 hover:bg-slate-700/90 shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-teal-500/25"
                        : "bg-white/95 border-slate-200/50 hover:border-teal-400/50 hover:bg-white shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-teal-500/20"
                    } backdrop-blur-sm`}
                  >
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent leading-tight">
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm md:text-base lg:text-lg leading-relaxed ${
                          darkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-6 md:mt-8 gap-1.5 md:gap-2 px-4">
            {Array.from({ length: features.length }, (_, i) => (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  i === currentIndex
                    ? "bg-gradient-to-r from-teal-400 to-cyan-500 w-6 md:w-8 shadow-md"
                    : darkMode
                    ? "bg-slate-600 hover:bg-slate-500 hover:scale-125 w-1.5 md:w-2"
                    : "bg-slate-300 hover:bg-slate-400 hover:scale-125 w-1.5 md:w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
