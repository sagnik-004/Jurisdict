import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  UserPlus,
  ChevronDown,
  Gavel,
  Scale,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactForm from "./landingpagecomponents/ContactForm";
import Home from "./landingpagecomponents/Home";
import Stats from "./landingpagecomponents/Stats";
import Features from "./landingpagecomponents/Features";
import About from "./landingpagecomponents/About";

const Landing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (!isUserScrolling) {
        const sections = document.querySelectorAll("section[id]");
        const scrollPosition = window.scrollY + 200;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const sectionId = section.getAttribute("id");
            if (sectionId !== activeSection) {
              setActiveSection(sectionId);
            }
          }
        });
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowRegisterMenu(false);
      }

      const mobileMenuButton = event.target.closest(
        "[data-mobile-menu-button]"
      );
      const mobileMenu = event.target.closest("[data-mobile-menu]");

      if (!mobileMenuButton && !mobileMenu && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(scrollTimeout);
    };
  }, [activeSection, isUserScrolling, showMobileMenu]);

  const scrollToSection = (id) => {
    setShowRegisterMenu(false);
    setShowMobileMenu(false);

    setIsUserScrolling(true);
    setActiveSection(id);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRoleNavigation = (role) => {
    const path = `/${role.charAt(0).toLowerCase()}/register`;
    navigate(path);
    setShowRegisterMenu(false);
  };

  const roles = [
    { name: "Lawyer", icon: <Gavel size={16} />, path: "/l/register" },
    { name: "Judge", icon: <Scale size={16} />, path: "/j/register" },
    { name: "Detainee", icon: <Lock size={16} />, path: "/d/register" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-b border-slate-200/20 dark:border-slate-800/20 shadow-lg shadow-black/5"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[4.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isScrolled ? 1 : 0,
                scale: isScrolled ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <Scale size={28} className="text-teal-500" />
              <h1 className="text-xl md:text-2xl font-heading font-bold text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text">
                JurisDict
              </h1>
            </motion.div>
          </div>

          <div
            className={`hidden md:flex items-center gap-2 transition-all duration-300 ${
              isScrolled ? "" : "absolute left-4 md:left-8"
            }`}
          >
            {["home", "stats", "features", "about", "contact"].map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className={`text-sm font-body font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === link
                    ? "bg-teal-600/20 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 font-semibold border border-teal-600/20 dark:border-teal-400/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              data-mobile-menu-button
              className="md:hidden p-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowRegisterMenu(!showRegisterMenu)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white transition-all duration-150 text-sm md:text-base font-body font-medium"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Sign Up</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showRegisterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 rounded-xl p-2 shadow-xl z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {roles.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => handleRoleNavigation(role.name)}
                        className="w-full px-4 py-3 rounded-md text-left flex items-center gap-3 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-700/70"
                      >
                        {React.cloneElement(role.icon, {
                          className: "text-teal-500",
                        })}
                        <span>{role.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[4.5rem] left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/20 dark:border-slate-800/20 shadow-lg"
            data-mobile-menu
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {["home", "stats", "features", "about", "contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    scrollToSection(link);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === link
                      ? "bg-teal-500/90 text-white font-semibold shadow-lg backdrop-blur-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Home darkMode={darkMode} />
        <Stats darkMode={darkMode} />
        <Features darkMode={darkMode} />
        <About darkMode={darkMode} />
        <section
          id="contact"
          className="py-12 md:py-20 px-4 md:px-8 bg-white dark:bg-slate-900"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
              Contact Us
            </h2>
            <ContactForm darkMode={darkMode} />
          </div>
        </section>
      </main>

      <footer className="py-12 md:py-20 px-4 md:px-8 border-t bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale size={24} className="text-teal-500" />
              <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text">
                JurisDict
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Bail Decisions and Intelligent Case Management—Faster Than Ever
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0A2342] dark:text-white">
              Product
            </h3>
            <div className="flex flex-col gap-2">
              {["Features", "Pricing", "Docs"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500 hover:bg-clip-text transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0A2342] dark:text-white">
              Company
            </h3>
            <div className="flex flex-col gap-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500 hover:bg-clip-text transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0A2342] dark:text-white">
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              {["Privacy", "Terms", "Security", "GDPR"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500 hover:bg-clip-text transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-200 dark:border-slate-700 text-center text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} JurisDict. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
