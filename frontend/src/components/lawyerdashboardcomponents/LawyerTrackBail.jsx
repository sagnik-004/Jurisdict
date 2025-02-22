import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";
import { axiosInstance } from "../../lib/axios.js";

const LawyerTrackBail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appeals, setAppeals] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
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
              <ListItem key={caseItem._id} sx={{ 
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1
              }}>
                <ListItemText
                  primary={caseItem.caseTitle}
                  secondary={
                    <>
                      <Typography variant="body2">Case ID: {caseItem.caseId}</Typography>
                      <Typography variant="body2">Detainee: {caseItem.detaineeName}</Typography>
                      <Typography variant="body2">
                        Filed on: {new Date(caseItem.bailFilingDate).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
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
              <ListItem key={caseItem._id} sx={{ 
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1
              }}>
                <ListItemText
                  primary={caseItem.caseTitle}
                  secondary={
                    <>
                      <Typography variant="body2">Case ID: {caseItem.caseId}</Typography>
                      <Typography variant="body2">Judge: {caseItem.judgeName}</Typography>
                      <Typography variant="body2">
                        Last updated: {new Date(caseItem.updatedAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default LawyerTrackBail;