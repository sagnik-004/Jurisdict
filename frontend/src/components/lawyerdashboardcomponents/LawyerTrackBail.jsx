import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import { HelpOutline, ExpandMore, ExpandLess } from "@mui/icons-material";
import { axiosInstance } from "../../lib/axios.js";
import AIPopup_lawyer from "../common/Aipopup_lawyer.jsx";

const LawyerTrackBail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appeals, setAppeals] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null); // To manage expanded state
  const [aiResponse, setAiResponse] = useState(null); // To store AI response
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To handle errors
  const [aiPopupOpen, setAiPopupOpen] = useState(false); // To manage AI popup visibility
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosInstance.get(`/lawyer/bail-appeals/${user.lawyerId}`);
        setAppeals(response.data.appeals);

        const pendingResponse = await axiosInstance.get(`/lawyer/pending-bails/${user.lawyerId}`);
        setPendingCases(pendingResponse.data.pendingCases);
      } catch (error) {
        console.error("Error fetching bail cases:", error);
      }
    };

    fetchCases();
  }, [user.lawyerId]);

  const handleAskAI = async (caseId, groundsOfBail, caseSummary) => {
  setLoading(true);
  setError(null);
  setAiResponse(null);
  setAiPopupOpen(true);

  console.log("API Endpoint:", "https://jurisdict-8nns.onrender.com/process_case_lawyer");
  console.log("Request Body:", { caseId, groundsOfBail, caseSummary });

  try {
    const response = await fetch("https://jurisdict-8nns.onrender.com/process_case_lawyer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId,  // <-- Ensure caseId is included
        groundsOfBail,
        caseSummary,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI response");
    }

    const data = await response.json();
    setAiResponse(data);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    setError("Failed to fetch AI response. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const handleCloseAiPopup = () => {
    setAiPopupOpen(false);
    setAiResponse(null);
    setError(null);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Appeals from Detainee" />
        <Tab label="Pending to Judge" />
      </Tabs>

      {activeTab === 0 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            New Bail Appeals ({appeals.length})
          </Typography>
          <List>
            {appeals.map((caseItem) => (
              <ListItem
                key={caseItem._id}
                sx={{
                  bgcolor: "background.paper",
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  position: "relative", // For positioning the Ask AI button
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <ListItemText primary={caseItem.caseTitle} />
                  <Collapse in={expandedCaseId === caseItem._id}>
                    <Box sx={{ mt: 1, position: "relative", paddingBottom: "40px" }}>
                      <Typography variant="body2">
                        <strong>Detainee Username:</strong> {caseItem.detaineeUsername}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Judge Comments:</strong>{" "}
                        {caseItem.judgeComments?.join(", ") || "No comments"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Case Summary:</strong> {caseItem.caseSummary}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {caseItem.status}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<HelpOutline />}
                        sx={{
                          position: "absolute",
                          right: 16,
                          bottom: 0,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "0.875rem",
                          padding: "6px 12px",
                        }}
                        onClick={() =>
                          handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)
                        }
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Ask AI"}
                      </Button>
                    </Box>
                  </Collapse>
                </Box>
                <IconButton
                  onClick={() => toggleExpand(caseItem._id)}
                  sx={{ position: "absolute", right: 16, top: 16 }}
                >
                  {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 1 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Pending with Judge ({pendingCases.length})
          </Typography>
          <List>
            {pendingCases.map((caseItem) => (
              <ListItem
                key={caseItem._id}
                sx={{
                  bgcolor: "background.paper",
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  position: "relative", // For positioning the Ask AI button
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <ListItemText primary={caseItem.caseTitle} />
                  <Collapse in={expandedCaseId === caseItem._id}>
                    <Box sx={{ mt: 1, position: "relative", paddingBottom: "40px" }}>
                      <Typography variant="body2">
                        <strong>Detainee Name:</strong> {caseItem.detaineeName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Detainee Username:</strong> {caseItem.detaineeUsername}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Judge Comments:</strong>{" "}
                        {caseItem.judgeComments?.join(", ") || "No comments"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Case Summary:</strong> {caseItem.caseSummary}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {caseItem.status}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<HelpOutline />}
                        sx={{
                          position: "absolute",
                          right: 16,
                          bottom: 0,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "0.875rem",
                          padding: "6px 12px",
                        }}
                        onClick={() =>
                          handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)
                        }
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Ask AI"}
                      </Button>
                    </Box>
                  </Collapse>
                </Box>
                <IconButton
                  onClick={() => toggleExpand(caseItem._id)}
                  sx={{ position: "absolute", right: 16, top: 16 }}
                >
                  {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* AI Popup */}
      <AIPopup_lawyer
        open={aiPopupOpen}
        onClose={handleCloseAiPopup}
        aiResponse={aiResponse}
        error={error}
      />
    </Box>
  );
};

export default LawyerTrackBail;
