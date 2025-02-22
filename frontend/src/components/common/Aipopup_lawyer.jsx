import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIPopup_lawyer = ({ open, onClose, aiResponse, error }) => {
  // Function to render key points with proper formatting
  const renderKeyPoints = (keyPoints) => {
    if (!keyPoints) return null;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Key Legal Points
        </Typography>
        <List dense>
          {Object.entries(keyPoints).map(([key, value]) => (
            <ListItem key={key} sx={{ py: 0.5 }}>
              <ListItemText
                primary={<Typography variant="body2"><strong>{key}:</strong></Typography>}
                secondary={
                  Array.isArray(value) ? (
                    value.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        sx={{ m: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2">{value}</Typography>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  // Function to render additional information
  const renderAdditionalInfo = (additionalInfo) => {
    if (!additionalInfo) return null;
    return (
      <Box sx={{ mt: 2, backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Important Notes
        </Typography>
        {Object.entries(additionalInfo).map(([key, value]) => (
          <Typography key={key} variant="body2" paragraph>
            <strong>{key}:</strong> {value}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
        AI Legal Analysis Report
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1">
              <strong>Error:</strong> {error}
            </Typography>
          </Alert>
        ) : aiResponse ? (
          <Box sx={{ padding: 2 }}>
            {/* Decision Status */}
            <Chip
              label={aiResponse.decision}
              color={
                aiResponse.decision.toLowerCase().includes('provided') 
                ? 'success' 
                : 'warning'
              }
              sx={{ mb: 2 }}
            />

            {/* Main Analysis Content */}
            <Typography variant="h5" gutterBottom>
              Detailed Legal Analysis
            </Typography>
            <Box sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 2,
              mb: 2
            }}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <Typography variant="h4" {...props} />,
                  h2: ({node, ...props}) => <Typography variant="h5" {...props} />,
                  h3: ({node, ...props}) => <Typography variant="h6" {...props} />,
                  p: ({node, ...props}) => <Typography variant="body1" paragraph {...props} />
                }}
              >
                {aiResponse.detailedAnalysis}
              </ReactMarkdown>
            </Box>

            {/* Key Points */}
            {renderKeyPoints(aiResponse.keyPoints)}

            {/* Additional Information */}
            {renderAdditionalInfo(aiResponse.additionalInfo)}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
            No analysis available for this case.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
          variant="contained"
          sx={{ mr: 2, mb: 2 }}
        >
          Close Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIPopup_lawyer;