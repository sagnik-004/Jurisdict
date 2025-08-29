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
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.getAttribute("id");
        }
      });
      setActiveSection(currentSection);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowRegisterMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
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
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-[4.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Scale size={28} className="text-indigo-500" />
            <h1 className="text-2xl font-bold text-indigo-500">JurisDict</h1>
            <div className="hidden md:flex gap-2 ml-6">
              {["home", "stats", "features", "about", "contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    activeSection === link
                      ? "text-indigo-500 bg-indigo-500/10"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowRegisterMenu(!showRegisterMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showRegisterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 rounded-xl p-2 shadow-xl z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {roles.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => handleRoleNavigation(role.name)}
                        className="w-full px-4 py-3 rounded-md text-left flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {role.icon}
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

      <main>
        <Home darkMode={darkMode} />
        <Stats darkMode={darkMode} />
        <Features darkMode={darkMode} />
        <About darkMode={darkMode} />
        <section id="contact" className="py-20 px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
            <ContactForm darkMode={darkMode} />
          </div>
        </section>
      </main>

      <footer className="py-20 px-8 border-t bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">JurisDict</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Bail Decisions and Intelligent Case Management—Faster Than Ever
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <div className="flex flex-col gap-2">
              {["Features", "Pricing", "Docs"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <div className="flex flex-col gap-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="flex flex-col gap-2">
              {["Privacy", "Terms", "Security", "GDPR"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
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