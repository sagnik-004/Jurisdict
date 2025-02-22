import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import AIPopup from "../common/AIPopup";
import {
  Avatar,
  IconButton,
  Collapse,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Search,
  Gavel,
  Scale,
  HelpCircle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import Balance from "@mui/icons-material/Balance";

const JudgeDashboard = () => {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [bailAppeals, setBailAppeals] = useState([]);
  const [decidedCases, setDecidedCases] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("cases");
  const [expandedCase, setExpandedCase] = useState(null);
  const [expandedBailAppeal, setExpandedBailAppeal] = useState(null);
  const [showCommentSection, setShowCommentSection] = useState({});
  const [aiPopupOpen, setAIPopupOpen] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState("");
  const [bailDecisionType, setBailDecisionType] = useState({});
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const themeColors = {
    background: isDarkTheme ? "#121212" : "#f0f4f8",
    text: isDarkTheme ? "#e0e0e0" : "#2c3e50",
    sidebarBg: isDarkTheme ? "#1a1a2e" : "#ffffff",
    buttonBg: isDarkTheme ? "#0f3460" : "#4a90e2",
    hoverBg: isDarkTheme ? "#0f346080" : "#4a90e280",
    cardBg: isDarkTheme ? "#1e1e1e" : "#ffffff",
    cardText: isDarkTheme ? "#e0e0e0" : "#2c3e50",
    divider: isDarkTheme ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    inputBg: isDarkTheme ? "#2d2d2d" : "#ffffff",
  };

  const faqs = [
    {
      question: "How do I view ongoing cases?",
      answer: "Go to the 'List of Cases' section.",
    },
    {
      question: "How do I process bail appeals?",
      answer: "Go to the 'Bail Appeals' section.",
    },
    {
      question: "What is the AI recommendation feature?",
      answer: "The AI provides recommendations based on case details.",
    },
    {
      question: "How do I view decided cases?",
      answer: "Go to the 'Decided Cases' section.",
    },
  ];

  useEffect(() => {
    const fetchedUser = JSON.parse(localStorage.getItem("user"));
    if (fetchedUser) setUser(fetchedUser);
  }, []);

  useEffect(() => {
    if (user) {
      axiosInstance
        .get(`/judge/cases/${user.username}`)
        .then((response) => setCases(response.data))
        .catch((err) => setError("Failed to fetch cases."));
      axiosInstance
        .get(`/judge/bail-appeals/${user.username}`)
        .then((response) => setBailAppeals(response.data))
        .catch((err) => setError("Failed to fetch bail appeals."));
      axiosInstance
        .get(`/judge/decided-cases/${user.username}`)
        .then((response) => setDecidedCases(response.data))
        .catch((err) => setError("Failed to fetch decided cases."));
    }
  }, [user]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const getUserInitials = () => {
    if (!user?.name) return "JD";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/judge/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/landing";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleBailAppealAction = (action, caseId, e) => {
    e.stopPropagation();
    setBailDecisionType({ ...bailDecisionType, [caseId]: action });
    setShowCommentSection({ ...showCommentSection, [caseId]: true });
    setExpandedBailAppeal(caseId);
  };

  const askAI = (caseId, e) => {
    e.stopPropagation();
    const caseItem = bailAppeals.find((item) => item._id === caseId);
    setAIRecommendation("Processing AI recommendation...");
    setAIPopupOpen(true);

    fetch("http://127.0.0.1:5000/process_case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId: caseItem.caseId,
        caseSummary: caseItem.caseSummary,
        groundsOfBail: caseItem.groundsOfBail,
        pastOffenses: caseItem.pastOffenses || [],
      }),
    })
      .then((response) => response.json())
      .then((data) => setAIRecommendation(data))
      .catch((err) =>
        setAIRecommendation("Failed to fetch AI recommendation.")
      );
  };

  const submitComment = async (caseId) => {
    const comment = document.getElementById(`comment${caseId}`).value;
    const status =
      bailDecisionType[caseId] === "approve" ? "Accepted" : "Declined";

    try {
      await axiosInstance.post("/judge/bail-decision", {
        caseId,
        status,
        comments: comment,
      });
      const response = await axiosInstance.get(
        `/judge/bail-appeals/${user.username}`
      );
      setBailAppeals(response.data);
      setShowCommentSection({ ...showCommentSection, [caseId]: false });
      setBailDecisionType({ ...bailDecisionType, [caseId]: null });
    } catch (err) {
      console.error("Error submitting bail decision:", err);
      setError("Failed to submit bail decision.");
    }
  };

  const filteredCases = cases.filter((caseItem) =>
    caseItem.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBailAppeals = bailAppeals.filter((bail) =>
    bail.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDecidedCases = decidedCases.filter((decided) =>
    decided.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: themeColors.background,
        fontFamily: "'Inter', sans-serif",
        color: themeColors.text,
      }}
    >
      <div
        style={{
          width: isCollapsed ? "0" : "250px",
          backgroundColor: themeColors.sidebarBg,
          padding: isCollapsed ? "0" : "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          position: "fixed",
          height: "100vh",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Balance style={{ fontSize: "32px", color: "#ff5722" }} />
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: themeColors.text,
                }}
              >
                JurisDict
              </h1>
            </div>
          </div>
          {["cases", "bail", "decided", "faq"].map((section) => (
            <div
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor:
                  activeSection === section
                    ? themeColors.buttonBg
                    : "transparent",
                color: activeSection === section ? "#ffffff" : themeColors.text,
              }}
            >
              {section === "cases" ? (
                <Gavel />
              ) : section === "bail" ? (
                <Scale />
              ) : section === "decided" ? (
                <FileText />
              ) : (
                <HelpCircle />
              )}
              <span style={{ marginLeft: "15px", fontWeight: "500" }}>
                {section === "cases"
                  ? "List of Cases"
                  : section === "bail"
                  ? "Bail Appeals"
                  : section === "decided"
                  ? "Decided Cases"
                  : "FAQ"}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${themeColors.divider}`,
            paddingTop: "20px",
            display: isCollapsed ? "none" : "block",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  marginRight: "15px",
                  border: `2px solid ${themeColors.buttonBg}`,
                  backgroundColor: themeColors.buttonBg,
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {getUserInitials()}
              </Avatar>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>
                  {user ? user.name : "Judge Name"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>
                  {user ? `@${user.username}` : "Username"}
                </p>
              </div>
            </div>
            <IconButton
              onClick={logout}
              style={{
                backgroundColor: "#ff4444",
                color: "#fff",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <LogOut size={20} />
            </IconButton>
          </div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: "40px",
          marginLeft: isCollapsed ? 0 : "250px",
          transition: "margin 0.3s ease",
          overflow: "auto",
          height: "100vh",
          background: themeColors.background,
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            left: isCollapsed ? "20px" : "270px",
            top: "20px",
            zIndex: 1000,
            padding: "8px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: themeColors.buttonBg,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
        <IconButton
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            color: themeColors.text,
          }}
        >
          {isDarkTheme ? (
            <Sun style={{ color: themeColors.text }} />
          ) : (
            <Moon style={{ color: themeColors.text }} />
          )}
        </IconButton>

        {activeSection === "cases" && (
          <div>
            <TextField
              fullWidth
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color={isDarkTheme ? "#fff" : "#2c3e50"} />
                  </InputAdornment>
                ),
                sx: {
                  color: themeColors.text,
                  "& .MuiInputBase-input": {
                    color: themeColors.text,
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: themeColors.divider,
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: themeColors.buttonBg,
                  },
                },
              }}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  backgroundColor: themeColors.inputBg,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  "&:focus-within": {
                    boxShadow: `0 0 0 2px ${themeColors.buttonBg}`,
                  },
                },
              }}
            />
            {filteredCases.length === 0 ? (
              <Typography variant="body1">No cases found.</Typography>
            ) : (
              filteredCases.map((caseItem) => (
                <motion.div
                  key={caseItem._id}
                  whileHover={{ scale: 1.02 }}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      backgroundColor: themeColors.cardBg,
                      color: themeColors.cardText,
                      transition: "all 0.3s ease",
                    }}
                    onClick={() =>
                      setExpandedCase(
                        expandedCase === caseItem._id ? null : caseItem._id
                      )
                    }
                  >
                    <CardContent>
                      <Typography variant="h6">{caseItem.caseTitle}</Typography>
                      <Collapse in={expandedCase === caseItem._id}>
                        <Typography variant="body2">
                          Case ID: {caseItem.caseId}
                        </Typography>
                        <Typography variant="body2">
                          Filing Date:{" "}
                          {new Date(caseItem.filingDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Case Summary: {caseItem.caseSummary}
                        </Typography>
                      </Collapse>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeSection === "bail" && (
          <div>
            <TextField
              fullWidth
              placeholder="Search bail appeals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color={isDarkTheme ? "#fff" : "#2c3e50"} />
                  </InputAdornment>
                ),
                sx: {
                  color: themeColors.text,
                  "& .MuiInputBase-input": {
                    color: themeColors.text,
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: themeColors.divider,
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: themeColors.buttonBg,
                  },
                },
              }}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  backgroundColor: themeColors.inputBg,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  "&:focus-within": {
                    boxShadow: `0 0 0 2px ${themeColors.buttonBg}`,
                  },
                },
              }}
            />
            {filteredBailAppeals.length === 0 ? (
              <Typography variant="body1">No bail appeals found.</Typography>
            ) : (
              filteredBailAppeals.map((caseItem) => (
                <motion.div
                  key={caseItem._id}
                  whileHover={{ scale: 1.02 }}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      backgroundColor: themeColors.cardBg,
                      color: themeColors.cardText,
                      transition: "all 0.3s ease",
                    }}
                    onClick={() =>
                      setExpandedBailAppeal(
                        expandedBailAppeal === caseItem._id
                          ? null
                          : caseItem._id
                      )
                    }
                  >
                    <CardContent>
                      <Typography variant="h6">{caseItem.caseTitle}</Typography>
                      <Collapse in={expandedBailAppeal === caseItem._id}>
                        <Typography variant="body2">
                          Case ID: {caseItem.caseId}
                        </Typography>
                        <Typography variant="body2">
                          Detainee: {caseItem.detaineeName}
                        </Typography>
                        <Typography variant="body2">
                          Grounds for Bail: {caseItem.groundsOfBail.join(", ")}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "16px",
                          }}
                        >
                          <div>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#388e3c",
                                marginRight: "8px",
                              }}
                              onClick={(e) =>
                                handleBailAppealAction(
                                  "approve",
                                  caseItem._id,
                                  e
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              style={{ backgroundColor: "#d32f2f" }}
                              onClick={(e) =>
                                handleBailAppealAction(
                                  "decline",
                                  caseItem._id,
                                  e
                                )
                              }
                            >
                              Decline
                            </Button>
                          </div>
                          <Button
                            variant="outlined"
                            onClick={(e) => askAI(caseItem._id, e)}
                            sx={{
                              borderColor: themeColors.buttonBg,
                              color: themeColors.buttonBg,
                            }}
                          >
                            Ask AI
                          </Button>
                        </div>
                        {showCommentSection[caseItem._id] && (
                          <div style={{ marginTop: "20px" }}>
                            <TextField
                              id={`comment${caseItem._id}`}
                              placeholder="Add your comment here"
                              fullWidth
                              multiline
                              rows={4}
                              sx={{
                                mb: 2,
                                "& .MuiInputBase-root": {
                                  backgroundColor: themeColors.inputBg,
                                  color: themeColors.text,
                                },
                              }}
                            />
                            <Button
                              variant="contained"
                              onClick={() => submitComment(caseItem._id)}
                              sx={{ backgroundColor: themeColors.buttonBg }}
                            >
                              Submit Comment
                            </Button>
                          </div>
                        )}
                      </Collapse>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeSection === "decided" && (
          <div>
            <TextField
              fullWidth
              placeholder="Search decided cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color={isDarkTheme ? "#fff" : "#2c3e50"} />
                  </InputAdornment>
                ),
                sx: {
                  color: themeColors.text,
                  "& .MuiInputBase-input": {
                    color: themeColors.text,
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: themeColors.divider,
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: themeColors.buttonBg,
                  },
                },
              }}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  backgroundColor: themeColors.inputBg,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  "&:focus-within": {
                    boxShadow: `0 0 0 2px ${themeColors.buttonBg}`,
                  },
                },
              }}
            />
            {filteredDecidedCases.length === 0 ? (
              <Typography variant="body1">No decided cases found.</Typography>
            ) : (
              filteredDecidedCases.map((caseItem) => (
                <motion.div
                  key={caseItem._id}
                  whileHover={{ scale: 1.02 }}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      mb: 3,
                      backgroundColor:
                        caseItem.bailStatus === "Accepted"
                          ? isDarkTheme
                            ? "#1B5E2080"
                            : "#e8f5e9"
                          : isDarkTheme
                          ? "#B71C1C80"
                          : "#ffebee",
                      color: themeColors.cardText,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() =>
                      setExpandedCase(
                        expandedCase === caseItem._id ? null : caseItem._id
                      )
                    }
                  >
                    <CardContent>
                      <Typography variant="h6">{caseItem.caseTitle}</Typography>
                      <Collapse in={expandedCase === caseItem._id}>
                        <Typography variant="body2">
                          Case ID: {caseItem.caseId}
                        </Typography>
                        <Typography variant="body2">
                          Filing Date:{" "}
                          {new Date(caseItem.filingDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Bail Status:{" "}
                          <span
                            style={{
                              color:
                                caseItem.bailStatus === "Accepted"
                                  ? isDarkTheme
                                    ? "#81c784"
                                    : "#2e7d32"
                                  : isDarkTheme
                                  ? "#ef9a9a"
                                  : "#c62828",
                            }}
                          >
                            {caseItem.bailStatus}
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          Judge Comments:{" "}
                          {caseItem.judgeComments?.join(", ") || "No comments"}
                        </Typography>
                      </Collapse>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeSection === "faq" && (
          <div>
            {faqs.map((faq, index) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  backgroundColor: themeColors.cardBg,
                  color: themeColors.cardText,
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setFaqOpenIndex(faqOpenIndex === index ? null : index)
                    }
                  >
                    <Typography variant="h6">{faq.question}</Typography>
                    {faqOpenIndex === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  <Collapse in={faqOpenIndex === index}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {faq.answer}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <AIPopup
        isOpen={aiPopupOpen}
        onClose={() => setAIPopupOpen(false)}
        aiRecommendation={aiRecommendation}
      />
    </div>
  );
};

export default JudgeDashboard;
