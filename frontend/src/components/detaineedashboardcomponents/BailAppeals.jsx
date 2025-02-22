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
  Grid
} from "@mui/material";

const BailAppeals = ({ themeColors }) => {
  const [bailCases, setBailCases] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
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
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateX(5px)"
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" style={{ color: themeColors.cardText }}>
                      {caseItem.caseTitle}
                    </Typography>
                    <Typography variant="body2" style={{ color: themeColors.cardText }}>
                      Case ID: {caseItem.caseId}
                    </Typography>
                    <Typography variant="caption" style={{ color: themeColors.cardText }}>
                      Last Updated: {new Date(caseItem.updatedAt).toLocaleDateString()}
                    </Typography>
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
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateX(5px)"
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" style={{ color: themeColors.cardText }}>
                      {caseItem.caseTitle}
                    </Typography>
                    <Typography variant="body2" style={{ color: themeColors.cardText }}>
                      Case ID: {caseItem.caseId}
                    </Typography>
                    <Typography variant="caption" style={{ color: themeColors.cardText }}>
                      Filed: {new Date(caseItem.filingDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default BailAppeals;