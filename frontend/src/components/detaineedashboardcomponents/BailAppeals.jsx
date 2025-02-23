import { useEffect, useState } from "react";
import {axiosInstance} from "../../lib/axios.js";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Grid,
  Collapse,
  IconButton,
  Button
} from "@mui/material";
import { HelpOutline, ExpandMore, ExpandLess } from "@mui/icons-material";
import AIPopup_lawyer from "../common/Aipopup_lawyer.jsx";

const BailAppeals = ({ themeColors }) => {
  const [bailCases, setBailCases] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiPopupOpen, setAiPopupOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBailCases = async () => {
      try {
        const response = await axiosInstance.get(
          `/detainee/bail-appeals/${user.username}`
        );
        setBailCases(response.data.data);
      } catch (error) {
        console.error("Error fetching bail cases:", error);
      }
    };
    fetchBailCases();
  }, [user.username]);

  const toggleExpand = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  const handleAskAI = async (caseId, groundsOfBail, caseSummary) => {
    setLoading(true);
    setError(null);
    setAiResponse(null);
    setAiPopupOpen(true);

    try {
      const response = await fetch("https://jurisdict-8nns.onrender.com/process_case_detainee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

  const handleCloseAiPopup = () => {
    setAiPopupOpen(false);
    setAiResponse(null);
    setError(null);
  };

  if (!bailCases) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ 
      backgroundColor: themeColors.sidebarBg, 
      borderRadius: "12px", 
      padding: "20px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    }}>
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            color: themeColors.text,
            fontSize: "0.9rem",
            textTransform: "capitalize"
          },
          "& .Mui-selected": {
            color: themeColors.buttonBg + "!important",
            fontWeight: "600"
          },
          "& .MuiTabs-indicator": {
            backgroundColor: themeColors.buttonBg
          }
        }}
      >
        <Tab label={`Pending to Judge (${bailCases.pendingToJudge.length})`} />
        <Tab label={`Pending to Lawyer (${bailCases.pendingToLawyer.length})`} />
      </Tabs>

      <Grid container spacing={3}>
        {activeTab === 0 && (
          <Grid item xs={12}>
            {bailCases.pendingToJudge.length === 0 ? (
              <Typography 
                variant="body1" 
                style={{ 
                  color: themeColors.text,
                  textAlign: "center",
                  padding: "20px"
                }}
              >
                No cases pending judicial review
              </Typography>
            ) : (
              bailCases.pendingToJudge.map((caseItem) => (
                <Card 
                  key={caseItem._id} 
                  sx={{ 
                    mb: 2, 
                    backgroundColor: themeColors.cardBg,
                    transition: "transform 0.2s",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" style={{ color: themeColors.cardText }}>
                        {caseItem.caseTitle}
                      </Typography>
                      <IconButton
                        onClick={() => toggleExpand(caseItem._id)}
                        sx={{ color: themeColors.cardText }}
                      >
                        {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    
                    <Collapse in={expandedCaseId === caseItem._id}>
                      <Box sx={{ mt: 2, position: 'relative', paddingBottom: '40px' }}>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Case ID:</strong> {caseItem.caseId}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Detainee Name:</strong> {caseItem.detaineeName}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Case Summary:</strong> {caseItem.caseSummary}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Status:</strong> {caseItem.status}
                        </Typography>
                        
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<HelpOutline />}
                          sx={{
                            position: 'absolute',
                            right: 16,
                            bottom: 0,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            padding: '6px 12px',
                            backgroundColor: themeColors.buttonBg,
                            '&:hover': {
                              backgroundColor: themeColors.buttonHoverBg
                            }
                          }}
                          onClick={() => handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Ask AI"}
                        </Button>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid item xs={12}>
            {bailCases.pendingToLawyer.length === 0 ? (
              <Typography 
                variant="body1" 
                style={{ 
                  color: themeColors.text,
                  textAlign: "center",
                  padding: "20px"
                }}
              >
                No cases pending lawyer review
              </Typography>
            ) : (
              bailCases.pendingToLawyer.map((caseItem) => (
                <Card 
                  key={caseItem._id} 
                  sx={{ 
                    mb: 2, 
                    backgroundColor: themeColors.cardBg,
                    transition: "transform 0.2s",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" style={{ color: themeColors.cardText }}>
                        {caseItem.caseTitle}
                      </Typography>
                      <IconButton
                        onClick={() => toggleExpand(caseItem._id)}
                        sx={{ color: themeColors.cardText }}
                      >
                        {expandedCaseId === caseItem._id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    
                    <Collapse in={expandedCaseId === caseItem._id}>
                      <Box sx={{ mt: 2, position: 'relative', paddingBottom: '40px' }}>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Case ID:</strong> {caseItem.caseId}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Detainee Name:</strong> {caseItem.detaineeName}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Grounds of Bail:</strong> {caseItem.groundsOfBail}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Case Summary:</strong> {caseItem.caseSummary}
                        </Typography>
                        <Typography variant="body2" style={{ color: themeColors.cardText }}>
                          <strong>Status:</strong> {caseItem.status}
                        </Typography>
                        
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<HelpOutline />}
                          sx={{
                            position: 'absolute',
                            right: 16,
                            bottom: 0,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            padding: '6px 12px',
                            backgroundColor: themeColors.buttonBg,
                            '&:hover': {
                              backgroundColor: themeColors.buttonHoverBg
                            }
                          }}
                          onClick={() => handleAskAI(caseItem._id, caseItem.groundsOfBail, caseItem.caseSummary)}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Ask AI"}
                        </Button>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        )}
      </Grid>

      <AIPopup_lawyer
        open={aiPopupOpen}
        onClose={handleCloseAiPopup}
        aiResponse={aiResponse}
        error={error}
      />
    </div>
  );
};

export default BailAppeals;