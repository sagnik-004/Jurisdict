import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import {
  WalletCards,
  Clock,
  Scale,
  HelpCircle,
  Gavel,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useMediaQuery,
  IconButton,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import { Balance, Brightness4, Brightness7 } from "@mui/icons-material";
import OngoingCases from "../detaineedashboardcomponents/OngoingCases.jsx";
import BailAppeals from "../detaineedashboardcomponents/BailAppeals.jsx";

const DetaineeDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Add Case");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [user, setUser] = useState(null);
  const [caseSummary, setCaseSummary] = useState("");
  const [cases, setCases] = useState([]);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [isMobile]);

  const themeColors = {
    background: isDarkTheme ? "#121212" : "#f0f4f8",
    text: isDarkTheme ? "#e0e0e0" : "#2c3e50",
    sidebarBg: isDarkTheme ? "#1a1a2e" : "#ffffff",
    buttonBg: isDarkTheme ? "#0f3460" : "#4a90e2",
    hoverBg: isDarkTheme ? "#0f346080" : "#4a90e280",
    inputBg: isDarkTheme ? "#1e1e1e" : "#ffffff",
    inputText: isDarkTheme ? "#e0e0e0" : "#2c3e50",
    cardBg: isDarkTheme ? "#1e1e1e" : "#ffffff",
    cardText: isDarkTheme ? "#e0e0e0" : "#2c3e50",
  };

  const menuItems = [
    { name: "Add Case", icon: <WalletCards /> },
    { name: "Ongoing Cases", icon: <Gavel /> },
    { name: "Track Bail Status", icon: <Clock /> },
    { name: "Bharatiya Nyaya Sanhita Laws", icon: <Scale /> },
    { name: "FAQ", icon: <HelpCircle /> },
  ];

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const getUserInitials = () => {
    if (!user?.name) return "DN";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/landing";
  };

  const handleCaseSummaryChange = (event) => {
    setCaseSummary(event.target.value);
  };

  const handleSubmit = () => {
    if (caseSummary.length < 250) {
      alert("Case Summary must be at least 250 words.");
      return;
    }
    const newCase = {
      caseId: "CASE-" + Math.floor(Math.random() * 10000),
      caseTitle: "Sample Case Title",
      bnsSection: "Sample BNS Section",
      courtName: "Sample Court Name",
      judgeId: "JUDGE-" + Math.floor(Math.random() * 1000),
      filingDate: new Date().toISOString().split("T")[0],
      hearingDate: new Date().toISOString().split("T")[0],
      policeStation: "Sample Police Station",
      caseSummary,
      detaineeId: "DETAINEE-" + Math.floor(Math.random() * 1000),
      bailFilingDate: new Date().toISOString().split("T")[0],
      groundsForBail: "Sample Grounds for Bail",
    };
    setCases([...cases, newCase]);
  };

  const faqs = [
    {
      question: "How do I add a new case?",
      answer: "Go to the 'Add Case' section and fill out the required details.",
    },
    {
      question: "How do I track bail status?",
      answer: "Go to the 'Track Bail Status' section to view the status of your bail applications.",
    },
    {
      question: "What is Bharatiya Nyaya Sanhita?",
      answer: "It is a set of laws governing the Indian legal system.",
    },
    {
      question: "How do I view ongoing cases?",
      answer: "Go to the 'Ongoing Cases' section to view all your active cases.",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        overflow: "hidden",
        backgroundColor: themeColors.background,
        fontFamily: "'Inter', sans-serif",
        color: themeColors.text,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: isCollapsed ? "0" : isMobile ? "100%" : "250px",
          backgroundColor: themeColors.sidebarBg,
          padding: isCollapsed ? "0" : "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          position: "relative",
          height: "100vh",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
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
                Themisync
              </h1>
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              onClick={() => {
                setSelectedMenu(item.name);
                if (isMobile) setIsCollapsed(true);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor:
                  selectedMenu === item.name
                    ? themeColors.buttonBg
                    : hoveredIndex === index
                    ? themeColors.hoverBg
                    : "transparent",
                color:
                  selectedMenu === item.name ? "#ffffff" : themeColors.text,
              }}
            >
              {item.icon}
              <span style={{ marginLeft: "15px", fontWeight: "500" }}>
                {!isCollapsed && item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <div
          style={{
            borderTop: `1px solid ${themeColors.text}20`,
            paddingTop: "20px",
            display: isCollapsed ? "none" : "block",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
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
                  {user ? user.name : "Detainee Name"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>
                  {user ? `@${user.username}` : "Case ID: #123456"}
                </p>
              </div>
            </div>
            <IconButton
              onClick={handleLogout}
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

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          marginLeft: isCollapsed ? 0 : isMobile ? 0 : "250px",
          transition: "margin 0.3s ease",
          overflowY: "auto",
          height: "100vh",
          backgroundColor: themeColors.background,
          boxSizing: "border-box",
        }}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            left: isCollapsed || isMobile ? "20px" : "270px",
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

        {/* Theme Toggle Button */}
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
            <Brightness7 style={{ color: themeColors.text }} />
          ) : (
            <Brightness4 style={{ color: themeColors.text }} />
          )}
        </IconButton>

        <h2
          style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "30px" }}
        >
          {selectedMenu}
        </h2>

        {/* Add Case Form */}
        {selectedMenu === "Add Case" && (
          <div
            style={{
              backgroundColor: themeColors.sidebarBg,
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <TextField
              fullWidth
              label="Case ID"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Case Title"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="BNS Section"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Court Name"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Judge ID"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Filing Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
                style: { color: themeColors.text },
              }}
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Hearing Dates"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
                style: { color: themeColors.text },
              }}
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Police Station"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Case Summary (Minimum 250 words)"
              multiline
              rows={6}
              value={caseSummary}
              onChange={handleCaseSummaryChange}
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Detainee ID"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Bail Filing Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
                style: { color: themeColors.text },
              }}
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <TextField
              fullWidth
              label="Grounds for Bail"
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
              }}
              InputLabelProps={{ style: { color: themeColors.text } }}
              InputProps={{ style: { color: themeColors.inputText } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ width: "100%", py: 2 }}
            >
              Submit Case
            </Button>
          </div>
        )}

        {/* Ongoing Cases */}
        {selectedMenu === "Ongoing Cases" && (
          <OngoingCases themeColors={themeColors} />
        )}

        {/* Track Bail Status */}
        {selectedMenu === "Track Bail Status" && (
          <BailAppeals themeColors={themeColors} />
        )}

        {/* FAQ */}
        {selectedMenu === "FAQ" && (
          <div
            style={{
              backgroundColor: themeColors.sidebarBg,
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            {faqs.map((faq, index) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  backgroundColor: themeColors.cardBg,
                  color: themeColors.cardText,
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
    </div>
  );
};

export default DetaineeDashboard;