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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactForm from "./ContactForm";

class TypeWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      wordIndex: 0,
      isDeleting: false,
      isWaiting: false,
    };
  }

  componentDidMount() {
    this.type();
  }

  componentWillUnmount() {
    clearTimeout(this.typeTimeout);
  }

  type = () => {
    const { wordIndex, isDeleting, text } = this.state;
    const currentIndex = wordIndex % this.props.words.length;
    const currentWord = this.props.words[currentIndex];

    this.setState({ isWaiting: false });

    if (isDeleting) {
      this.setState({
        text: currentWord.substring(0, text.length - 1),
      });
    } else {
      this.setState({
        text: currentWord.substring(0, text.length + 1),
      });
    }

    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2;
    }

    if (!isDeleting && text === currentWord) {
      typeSpeed = 1000;
      this.setState({
        isWaiting: true,
        isDeleting: true,
      });
    } else if (isDeleting && text === "") {
      this.setState({
        isDeleting: false,
        wordIndex: wordIndex + 1,
      });
      typeSpeed = 200;
    }

    this.typeTimeout = setTimeout(() => this.type(), typeSpeed);
  };

  render() {
    const { text, isWaiting } = this.state;
    return (
      <span className={`dynamic-text ${isWaiting ? "fade" : ""}`}>{text}</span>
    );
  }
}

const Landing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonHover, setButtonHover] = useState({});
  const [featureIndex, setFeatureIndex] = useState(0);
  const menuRef = useRef(null);

  const roles = [
    { name: "Lawyer", icon: <Gavel size={16} /> },
    { name: "Judge", icon: <Scale size={16} /> },
    { name: "Detainee", icon: <Lock size={16} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
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

  const colors = {
    primary: "#6366F1",
    secondary: "#EC4899",
    background: darkMode ? "#0F172A" : "#FFFFFF",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    muted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#2D3748" : "#E2E8F0",
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "stats", label: "Stats" },
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoleNavigation = (role) => {
    const path = `/${role.charAt(0).toLowerCase()}/register`;
    navigate(path);
    setShowRegisterMenu(false);
  };

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
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: isScrolled
            ? darkMode
              ? "rgba(15, 23, 42, 0.95)"
              : "rgba(255, 255, 255, 0.95)"
            : "transparent",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${
            isScrolled ? colors.border : "transparent"
          }`,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Scale size={28} color={colors.primary} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}
            >
              JurisDict
            </motion.h1>
            <div style={{ display: "flex", gap: 24 }}>
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color:
                      activeSection === link.id ? colors.primary : colors.text,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: 8,
                    backgroundColor:
                      activeSection === link.id
                        ? darkMode
                          ? "rgba(99, 102, 241, 0.1)"
                          : "rgba(99, 102, 241, 0.05)"
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${darkMode ? "#FFFFFF" : colors.border}`,
                background: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {darkMode ? (
                <Sun size={18} color="#FFFFFF" />
              ) : (
                <Moon size={18} />
              )}
            </motion.button>

            <div ref={menuRef} style={{ position: "relative" }}>
              <motion.button
                onMouseEnter={() => setButtonHover({ register: true })}
                onMouseLeave={() => setButtonHover({ register: false })}
                onClick={() => setShowRegisterMenu(!showRegisterMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: buttonHover.register ? "#4F46E5" : colors.primary,
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
                <ChevronDown size={16} />
              </motion.button>

              <AnimatePresence>
                {showRegisterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      top: 48,
                      right: 0,
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: 8,
                      width: 200,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                    }}
                  >
                    {roles.map((role, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleRoleNavigation(role.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 8,
                          background: "none",
                          border: "none",
                          color: colors.text,
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "all 0.2s ease",
                          ":hover": {
                            backgroundColor: darkMode ? "#2D3748" : "#F1F5F9",
                          },
                        }}
                      >
                        {role.icon}
                        {role.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <section
        id="home"
        style={{
          height: "100vh",
          padding: "16px 32px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 1024, textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              padding: "12px 20px",
              borderRadius: 24,
              backgroundColor: darkMode ? "rgba(99, 102, 241, 0.1)" : "#EEF2FF",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: -60,
            }}
          >
            <span style={{ color: colors.primary, fontSize: 14 }}>
              Get bailed out
            </span>
            <span style={{ color: colors.secondary, fontSize: 14 }}>
              ✨ real quick
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            AI-Powered Legal
            <br />
            <span style={{ color: colors.primary }}>
              <TypeWriter
                words={["Case Management", "Bail Reckoner", "Case Predictor"]}
              />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              fontSize: 20,
              color: colors.muted,
              maxWidth: 720,
              margin: "0 auto 48px",
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: "inline-block" }}>
              Bail Decisions and Intelligent Case Management- Faster Than Ever
            </div>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <motion.button
              onClick={() => scrollToSection("features")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "16px 32px",
                borderRadius: 8,
                background: colors.primary,
                color: "white",
                border: "none",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <section
        id="stats"
        style={{
          padding: "80px 32px",
          backgroundColor: darkMode ? "#1E293B" : "#F8FAFC",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Proven Results
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
            }}
          >
            {[
              { value: "95%", label: "Model Accuracy", color: "#10B981" },
              { value: "500K+", label: "Cases Analyzed", color: "#3B82F6" },
              { value: "2.4M", label: "Legal Documents", color: "#8B5CF6" },
              { value: "98%", label: "User Satisfaction", color: "#EC4899" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                style={{
                  padding: 32,
                  borderRadius: 16,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: stat.color,
                    marginBottom: 16,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 18, color: colors.muted }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="features" style={{ padding: "80px 32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Core Features
          </h2>
          <div style={{ position: "relative" }}>
            <motion.button
              onClick={handlePrevFeature}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                left: -24,
                top: "50%",
                transform: "translateY(-50%)",
                padding: 8,
                borderRadius: "50%",
                background: colors.primary,
                border: "none",
                color: "white",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              <ArrowLeft size={16} />
            </motion.button>
            <motion.button
              onClick={handleNextFeature}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                right: -24,
                top: "50%",
                transform: "translateY(-50%)",
                padding: 8,
                borderRadius: "50%",
                background: colors.primary,
                border: "none",
                color: "white",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              <ArrowRight size={16} />
            </motion.button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 32,
              }}
            >
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
                    style={{
                      padding: 32,
                      borderRadius: 16,
                      backgroundColor: darkMode ? "#1E293B" : "#FFFFFF",
                      border: `1px solid ${colors.border}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        marginBottom: 16,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: colors.muted }}>{feature.description}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="about"
        style={{
          padding: "80px 32px",
          backgroundColor: darkMode ? "#1E293B" : "#F8FAFC",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            About JurisDict
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 48,
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                padding: 32,
                borderRadius: 16,
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                boxShadow: darkMode
                  ? "0 8px 24px rgba(255, 255, 255, 0.1)"
                  : "0 8px 24px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  marginBottom: 16,
                  color: colors.primary,
                }}
              >
                Simplifying the Bail Process
              </h3>
              <p style={{ color: colors.muted, lineHeight: 1.6 }}>
                JurisDict is an AI-powered platform designed to simplify the
                bail process for detainees, lawyers, and judges. By leveraging
                advanced AI algorithms, we provide accurate bail predictions,
                streamline legal workflows, and ensure fair and timely justice
                for all.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
              }}
            >
              {[
                {
                  title: "For Detainees",
                  description:
                    "Quick and accurate bail predictions to reduce time in custody.",
                  icon: <Lock size={24} color={colors.primary} />,
                },
                {
                  title: "For Lawyers",
                  description:
                    "Efficient case management and document automation tools.",
                  icon: <Gavel size={24} color={colors.primary} />,
                },
                {
                  title: "For Judges",
                  description:
                    "Data-driven insights to make informed bail decisions.",
                  icon: <Scale size={24} color={colors.primary} />,
                },
                {
                  title: "AI-Powered",
                  description:
                    "Advanced algorithms ensure fairness and accuracy in bail predictions.",
                  icon: <Sun size={24} color={colors.primary} />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {item.icon}
                    <h4
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p style={{ color: colors.muted }}>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="contact" style={{ padding: "80px 32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Contact Us
          </h2>
          <ContactForm darkMode={darkMode} colors={colors} />
        </motion.div>
      </section>

      <footer
        style={{
          backgroundColor: darkMode ? "#1E293B" : "#F8FAFC",
          padding: "80px 32px 32px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              JurisDict
            </h3>
            <p style={{ color: colors.muted, lineHeight: 1.6 }}>
              Bail Decisions and Intelligent Case Management—Faster Than Ever
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Product
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Features", "Pricing", "Docs"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    color: colors.muted,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    ":hover": { color: colors.primary },
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Company
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["About", "Blog", "Careers", "Contact"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    color: colors.muted,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    ":hover": { color: colors.primary },
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Legal
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Privacy", "Terms", "Security", "GDPR"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    color: colors.muted,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    ":hover": { color: colors.primary },
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: `1px solid ${colors.border}`,
            textAlign: "center",
            color: colors.muted,
          }}
        >
          © {new Date().getFullYear()} JurisDict. All rights reserved.
        </motion.div>
      </footer>
    </div>
  );
};

export default Landing;
