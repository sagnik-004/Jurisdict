import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Avatar,
  ListItemIcon,
  TextareaAutosize,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import {
  AddCircleOutline,
  Assignment,
  TrackChanges,
  Gavel,
  HelpOutline,
  Balance,
  Brightness4,
  Brightness7,
  Logout,
  ExpandMore,
  Menu,
  ChevronLeft,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import LawyerTrackBail from "../lawyerdashboardcomponents/LawyerTrackBail.jsx";

const LawyerDashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Add Case");
  const [caseSummary, setCaseSummary] = useState("");
  const [mode, setMode] = useState("light");
  const [ongoingCases, setOngoingCases] = useState([]);
  const [expandedCase, setExpandedCase] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State for sidebar visibility
  const user = JSON.parse(localStorage.getItem("user")); // Fetch user object from local storage

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleCaseSummaryChange = (event) => {
    setCaseSummary(event.target.value);
  };

  const handleSubmit = () => {
    if (caseSummary.length < 250) {
      alert("Case Summary must be at least 250 words.");
      return;
    }
    console.log("Case submitted successfully!");
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/lawyer/logout");
      localStorage.removeItem("user");
      navigate("/landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev); // Toggle sidebar visibility
  };

  useEffect(() => {
    const fetchOngoingCases = async () => {
      try {
        const response = await axiosInstance.get(`/lawyer/ongoing-cases/${user.lawyerId}`);
        setOngoingCases(response.data.cases);
      } catch (error) {
        console.error("Error fetching ongoing cases:", error);
      }
    };

    if (selectedItem === "Ongoing Cases") {
      fetchOngoingCases();
    }
  }, [selectedItem, user?.lawyerId]);

  const toggleCaseDescription = (caseId) => {
    setExpandedCase((prev) => (prev === caseId ? null : caseId));
  };

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#1a237e" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#f8f9fa" : "#121212",
        paper: mode === "light" ? "#fff" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#000" : "#fff",
      },
    },
  });

  const styles = {
    dashboard: {
      display: "flex",
      height: "100vh",
      backgroundColor: theme.palette.background.default,
    },
    sidebar: {
      width: isSidebarVisible ? "280px" : "0", // Hide sidebar when collapsed
      backgroundColor: mode === "light" ? "#1a237e" : "#0d47a1",
      color: "#fff",
      padding: isSidebarVisible ? "24px" : "0", // Remove padding when collapsed
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "3px 0 10px rgba(0, 0, 0, 0.1)",
      transition: "width 0.3s ease, padding 0.3s ease", // Smooth transition for width and padding
      height: "100vh", // Full height
      position: "fixed", // Fixed position
      left: 0,
      top: 0,
      overflow: "hidden", // Hide overflow when collapsed
      zIndex: 1200, // Ensure sidebar is above other content
    },
    mainContent: {
      flex: 1,
      padding: "32px",
      backgroundColor: theme.palette.background.paper,
      overflowY: "auto",
      marginLeft: isSidebarVisible ? "280px" : "0", // Adjust margin based on sidebar visibility
      transition: "margin-left 0.3s ease", // Smooth transition for main content
      paddingLeft: isSidebarVisible ? "32px" : "64px", // Add extra padding for collapse button
      paddingTop: "64px", // Add blank space at the top
    },
    inputField: {
      marginBottom: "24px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: mode === "light" ? "#fff" : "#333",
        color: mode === "light" ? "#000" : "#fff",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: mode === "light" ? "#ccc" : "#555",
      },
    },
    caseItem: {
      backgroundColor: theme.palette.background.paper,
      padding: "16px",
      marginBottom: "8px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    caseDetails: {
      marginTop: "8px",
      padding: "8px",
      backgroundColor: theme.palette.background.default,
      borderRadius: "4px",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      marginTop: "24px",
      padding: "12px",
      backgroundColor: mode === "light" ? "#3949ab" : "#0d47a1",
      borderRadius: "8px",
      gap: "12px",
    },
    avatar: {
      width: "48px",
      height: "48px",
      border: "2px solid #fff",
      backgroundColor: "#ff5722",
      fontSize: "20px",
      fontWeight: "bold",
    },
    textArea: {
      width: "100%",
      padding: "8px",
      borderRadius: "8px",
      border: `1px solid ${mode === "light" ? "#ccc" : "#555"}`,
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: "100px",
      backgroundColor: mode === "light" ? "#fff" : "#333",
      color: mode === "light" ? "#000" : "#fff",
    },
    faqSection: {
      marginTop: "24px",
    },
    faqItem: {
      marginBottom: "8px",
    },
    collapseButton: {
      position: "fixed",
      top: 16,
      left: isSidebarVisible ? "280px" : "16px", // Adjust position based on sidebar visibility
      zIndex: 1300, // Ensure button is above other content
      transition: "left 0.3s ease", // Smooth transition for button position
      backgroundColor: mode === "light" ? "#1a237e" : "#0d47a1", // Highlight button background
      color: "#fff", // Highlight button text color
      borderRadius: "50%", // Circular button
      padding: "8px", // Padding for better appearance
      "&:hover": {
        backgroundColor: mode === "light" ? "#3949ab" : "#1565c0", // Hover effect
      },
    },
  };

  const menuItems = [
    { text: "Add Case", icon: <AddCircleOutline /> },
    { text: "Ongoing Cases", icon: <Assignment /> },
    { text: "Track Bail Status", icon: <TrackChanges /> },
    { text: "BNS", icon: <Gavel /> },
    { text: "FAQs", icon: <HelpOutline /> },
  ];

  const faqs = [
    {
      question: "How do I add a new case?",
      answer: "To add a new case, navigate to the 'Add Case' section and fill in the required details such as Case ID, Case Title, BNS Section, Court Name, and other relevant information. Once all fields are filled, click 'Submit Case' to save the case.",
    },
    {
      question: "How can I track the status of a bail application?",
      answer: "You can track the status of a bail application by navigating to the 'Track Bail Status' section. Enter the relevant case details to view the current status of the bail application.",
    },
    {
      question: "What information is required to file a new case?",
      answer: "To file a new case, you need to provide details such as Case ID, Case Title, BNS Section, Court Name, Judge ID, Filing Date, Hearing Dates, Police Station, Case Summary, Detainee ID, Bail Filing Date, and Grounds for Bail.",
    },
    {
      question: "How do I view my ongoing cases?",
      answer: "You can view your ongoing cases by navigating to the 'Ongoing Cases' section. This section will display a list of all your active cases along with their details.",
    },
    {
      question: "Can I edit a case after submitting it?",
      answer: "Currently, once a case is submitted, it cannot be edited. Please ensure all details are correct before submitting the case.",
    },
    {
      question: "How do I log out of the dashboard?",
      answer: "To log out, click on the logout icon located in the bottom-right corner of the sidebar. This will log you out of the dashboard and redirect you to the landing page.",
    },
    {
      question: "What is the BNS section?",
      answer: "The BNS section refers to the Bharatiya Nyaya Sanhita, which is a code of criminal law in India. You can use this section to reference relevant legal provisions for your cases.",
    },
    {
      question: "How do I change the theme of the dashboard?",
      answer: "You can switch between light and dark themes by clicking on the theme toggle icon located at the top-right corner of the dashboard.",
    },
    {
      question: "What should I do if I encounter an error?",
      answer: "If you encounter an error, please try refreshing the page. If the issue persists, contact the support team for assistance.",
    },
    {
      question: "How do I navigate between different sections of the dashboard?",
      answer: "You can navigate between different sections by clicking on the respective menu items in the sidebar. Each section is designed to help you manage different aspects of your cases.",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={styles.dashboard}>
        {isSidebarVisible && ( // Render sidebar only when visible
          <Box sx={styles.sidebar}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Balance sx={{ fontSize: 32, color: "#ff5722" }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  JurisDict {/* Changed from "Themisync" to "JurisDict" */}
                </Typography>
              </Box>

              <List>
                {menuItems.map((item) => (
                  <ListItem
                    key={item.text}
                    component="div"
                    sx={{
                      borderRadius: "8px",
                      mb: 1,
                      padding: "12px 16px",
                      backgroundColor: selectedItem === item.text 
                        ? "#fff" 
                        : (mode === "light" ? "#1a237e" : "#0d47a1"),
                      "&:hover": {
                        backgroundColor: selectedItem === item.text 
                          ? "#fff" 
                          : (mode === "light" ? "#3949ab" : "#1565c0")
                      },
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onClick={() => setSelectedItem(item.text)}
                  >
                    <ListItemIcon sx={{ 
                      color: selectedItem === item.text 
                        ? "#1a237e" 
                        : "#fff" 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        color: selectedItem === item.text 
                          ? "#1a237e" 
                          : "#fff" 
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={styles.profileSection}>
              <Avatar sx={styles.avatar}>{getInitials(user.name)}</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                  @{user.username} {/* Display username from user object */}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleLogout} 
                color="inherit"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <Logout />
              </IconButton>
            </Box>
          </Box>
        )}

        <Box sx={styles.mainContent}>
          {/* Removed the heading for the selected item */}
          {selectedItem === "Add Case" && (
            <Box>
              <TextField
                fullWidth
                label="Case ID"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Case Title"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="BNS Section"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Court Name"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Judge ID"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Filing Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Hearing Dates"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Police Station"
                variant="outlined"
                sx={styles.inputField}
              />
              <Box sx={{ marginBottom: "24px" }}>
                <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                  Case Summary (Minimum 250 words)
                </Typography>
                <TextareaAutosize
                  minRows={4}
                  placeholder="Enter case summary..."
                  value={caseSummary}
                  onChange={handleCaseSummaryChange}
                  style={styles.textArea}
                />
              </Box>
              <TextField
                fullWidth
                label="Detainee ID"
                variant="outlined"
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Bail Filing Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={styles.inputField}
              />
              <TextField
                fullWidth
                label="Grounds for Bail"
                variant="outlined"
                sx={styles.inputField}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ 
                  marginTop: "16px",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                onClick={handleSubmit}
              >
                Submit Case
              </Button>
            </Box>
          )}

          {selectedItem === "Ongoing Cases" && (
            <Box>
              {ongoingCases.length > 0 ? (
                ongoingCases.map((caseItem) => (
                  <Box
                    key={caseItem._id}
                    sx={styles.caseItem}
                    onClick={() => toggleCaseDescription(caseItem._id)}
                  >
                    <Typography variant="h6">{caseItem.caseTitle}</Typography>
                    <Typography variant="body2">Case ID: {caseItem.caseId}</Typography>
                    
                    {expandedCase === caseItem._id && (
                      <Box sx={styles.caseDetails}>
                        <Typography variant="body2">
                          <strong>Court:</strong> {caseItem.courtName}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Filing Date:</strong> {new Date(caseItem.filingDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Judge ID:</strong> {caseItem.judgeId}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Summary:</strong> {caseItem.caseSummary}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body1">No ongoing cases found</Typography>
              )}
            </Box>
          )}

          {selectedItem === "Track Bail Status" && (
            <LawyerTrackBail />
          )}

          {selectedItem === "FAQs" && (
            <Box sx={styles.faqSection}>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={styles.faqItem}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>

        <IconButton
          sx={styles.collapseButton}
          onClick={toggleSidebar}
          color="inherit"
        >
          {isSidebarVisible ? <ChevronLeft /> : <Menu />}
        </IconButton>

        <IconButton
          sx={{ position: "fixed", top: 16, right: 16 }}
          onClick={toggleMode}
          color="inherit"
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>
    </ThemeProvider>
  );
};

export default LawyerDashboard;