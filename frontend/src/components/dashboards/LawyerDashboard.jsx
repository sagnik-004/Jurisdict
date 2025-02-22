import React, { useState } from "react";
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
} from "@mui/material";
import {
  AddCircleOutline,
  Assignment,
  TrackChanges,
  Gavel,
  HelpOutline,
  Balance,
  Brightness4, // Moon icon for dark mode
  Brightness7, // Sun icon for light mode
  Logout, // Logout icon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // For navigation

const LawyerDashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Add Case");
  const [caseSummary, setCaseSummary] = useState("");
  const [mode, setMode] = useState("light"); // State for light/dark mode
  const user = {
    firstName: "John",
    lastName: "Doe",
    username: "john_doe_123",
  };

  const navigate = useNavigate(); // Hook for navigation

  const getInitials = (firstName, lastName) => {
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
    // Submit logic here
    console.log("Case submitted successfully!");
  };

  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Handle logout
  const handleLogout = () => {
    // Perform logout logic (e.g., clear session/token)
    console.log("User logged out");
    // Redirect to landing page
    navigate("/");
  };

  // Create a theme based on the selected mode
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#1a237e" : "#90caf9", // Adjust primary color
      },
      background: {
        default: mode === "light" ? "#f8f9fa" : "#121212", // Background color
        paper: mode === "light" ? "#fff" : "#1e1e1e", // Paper color
      },
      text: {
        primary: mode === "light" ? "#000" : "#fff", // Text color
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
      width: "280px",
      backgroundColor: mode === "light" ? "#1a237e" : "#0d47a1", // Sidebar color
      color: "#fff",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "3px 0 10px rgba(0, 0, 0, 0.1)",
    },
    mainContent: {
      flex: 1,
      padding: "32px",
      backgroundColor: theme.palette.background.paper,
      overflowY: "auto",
    },
    buttonShape: {
      borderRadius: "8px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      cursor: "pointer",
    },
    listItem: {
      marginBottom: "12px",
      padding: "12px 16px",
      backgroundColor: mode === "light" ? "#1a237e" : "#0d47a1",
      "&:hover": {
        backgroundColor: mode === "light" ? "#3949ab" : "#1565c0",
      },
    },
    selectedListItem: {
      backgroundColor: "#fff !important",
      color: "#1a237e !important",
    },
    inputField: {
      marginBottom: "24px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: mode === "light" ? "#fff" : "#333", // Background for input fields
        color: mode === "light" ? "#000" : "#fff", // Text color for input fields
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: mode === "light" ? "#ccc" : "#555", // Border color for input fields
      },
    },
    button: {
      marginTop: "16px",
      borderRadius: "8px",
      padding: "12px 24px",
      fontWeight: "bold",
      textTransform: "none",
      cursor: "pointer",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      marginTop: "24px",
      padding: "12px",
      backgroundColor: mode === "light" ? "#3949ab" : "#0d47a1",
      borderRadius: "8px",
      cursor: "pointer",
    },
    avatar: {
      width: "48px",
      height: "48px",
      marginRight: "12px",
      border: "2px solid #fff",
      backgroundColor: "#ff5722",
      fontSize: "20px",
      fontWeight: "bold",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: "24px",
      color: theme.palette.text.primary,
    },
    textArea: {
      width: "100%",
      padding: "8px", // Reduced padding
      borderRadius: "8px",
      border: `1px solid ${mode === "light" ? "#ccc" : "#555"}`, // Border color
      fontSize: "14px", // Smaller font size
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: "100px", // Reduced height
      backgroundColor: mode === "light" ? "#fff" : "#333", // Background color
      color: mode === "light" ? "#000" : "#fff", // Text color
    },
    themisyncHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    },
    modeToggle: {
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: 1000,
    },
    bottomSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "24px",
    },
  };

  const menuItems = [
    { text: "Add Case", icon: <AddCircleOutline /> },
    { text: "Ongoing Cases", icon: <Assignment /> },
    { text: "Track Bail Status", icon: <TrackChanges /> },
    { text: "BNS", icon: <Gavel /> },
    { text: "FAQs", icon: <HelpOutline /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline styles */}
      <Box sx={styles.dashboard}>
        {/* Sidebar */}
        <Box sx={styles.sidebar}>
          <Box>
            {/* Themisync Header */}
            <Box sx={styles.themisyncHeader}>
              <Balance sx={{ fontSize: "32px", color: "#ff5722" }} /> {/* Icon */}
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
                Themisync
              </Typography>
            </Box>

            {/* Menu Items */}
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  component="div"
                  sx={{
                    ...styles.listItem,
                    ...styles.buttonShape,
                    ...(selectedItem === item.text && styles.selectedListItem),
                  }}
                  onClick={() => setSelectedItem(item.text)}
                >
                  <ListItemIcon sx={{ color: selectedItem === item.text ? "#1a237e" : "#fff" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Bottom Section: Username and Logout */}
          <Box sx={styles.bottomSection}>
            {/* Username Section */}
            <Box sx={{ ...styles.profileSection, ...styles.buttonShape }}>
              <Avatar sx={styles.avatar}>
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                  @{user.username}
                </Typography>
              </Box>
            </Box>

            {/* Logout Button */}
            <IconButton onClick={handleLogout} color="inherit">
              <Logout />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={styles.mainContent}>
          <Typography variant="h4" gutterBottom sx={styles.heading}>
            {selectedItem}
          </Typography>

          {/* Add Case Form */}
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
                  minRows={4} // Reduced number of rows
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
                sx={styles.button}
                onClick={handleSubmit}
              >
                Submit Case
              </Button>
            </Box>
          )}
        </Box>

        {/* Light/Dark Mode Toggle Button */}
        <IconButton sx={styles.modeToggle} onClick={toggleMode} color="inherit">
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>
    </ThemeProvider>
  );
};

export default LawyerDashboard;