import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Contrast as ContrastIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Videocam as VideoIcon,
  TextFields as TextIcon,
  AccessTime as TimeIcon,
  Notifications as NotificationsIcon,
  Code as CodeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

// Import analysis components
import ContrastAnalysis from '../components/analysis/ContrastAnalysis';
import AltTextAnalysis from '../components/analysis/AltTextAnalysis';
import TextAnalysis from '../components/analysis/TextAnalysis';
import MediaAnalysis from '../components/analysis/MediaAnalysis';
import AriaAnalysis from '../components/analysis/AriaAnalysis';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { 
    analysisResults, 
    uploadedContent,
    loading, 
    errors,
    setCurrentStep
  } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleContinue = () => {
    console.log('[AnalysisPage] Continuing to remediation');
    setCurrentStep('remediation');
    navigate('/remediation');
  };

  // Define the tabs for different analysis categories
  const tabs = [
    { 
      label: 'Contrast', 
      icon: <ContrastIcon />, 
      id: 'contrast-tab',
      component: <ContrastAnalysis results={analysisResults.contrast} />,
      hasIssues: analysisResults.contrast && analysisResults.contrast.issues && analysisResults.contrast.issues.length > 0,
    },
    { 
      label: 'Alt Text', 
      icon: <ImageIcon />, 
      id: 'alt-text-tab',
      component: <AltTextAnalysis results={analysisResults.altText} />,
      hasIssues: analysisResults.altText && analysisResults.altText.length > 0,
    },
    { 
      label: 'Text & Readability', 
      icon: <TextIcon />, 
      id: 'text-tab',
      component: <TextAnalysis results={analysisResults.textSimplification} />,
      hasIssues: analysisResults.textSimplification && Object.keys(analysisResults.textSimplification).length > 0,
    },
    { 
      label: 'Media', 
      icon: <VideoIcon />, 
      id: 'media-tab',
      component: <MediaAnalysis 
        transcripts={analysisResults.transcripts} 
        signLanguage={analysisResults.signLanguage}
        audioDescriptions={analysisResults.audioDescriptions}
      />,
      hasIssues: (
        (analysisResults.transcripts && Object.keys(analysisResults.transcripts).length > 0) ||
        (analysisResults.signLanguage && Object.keys(analysisResults.signLanguage).length > 0) ||
        (analysisResults.audioDescriptions && Object.keys(analysisResults.audioDescriptions).length > 0)
      ),
    },
    { 
      label: 'ARIA & HTML', 
      icon: <CodeIcon />, 
      id: 'aria-tab',
      component: <AriaAnalysis results={analysisResults.ariaValidation} />,
      hasIssues: analysisResults.ariaValidation && Object.keys(analysisResults.ariaValidation).length > 0,
    },
  ];

  // Count total issues
  const totalIssues = tabs.filter(tab => tab.hasIssues).length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Accessibility Analysis Results
      </Typography>
      
      {errors.analysis && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.analysis}
        </Alert>
      )}

      {loading.analysis ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">
            Analyzing your content for WCAG 2.1 AAA compliance...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This may take a few moments depending on the content size.
          </Typography>
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Analysis Summary
              </Typography>
              <Chip 
                icon={totalIssues > 0 ? <WarningIcon /> : <CheckIcon />}
                label={totalIssues > 0 ? `${totalIssues} categories with issues` : 'No issues found'}
                color={totalIssues > 0 ? 'warning' : 'success'}
                variant="outlined"
              />
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              {tabs.map((tab, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: tab.hasIssues ? 'rgba(255, 152, 0, 0.08)' : 'rgba(76, 175, 80, 0.08)',
                    }}
                  >
                    <Box sx={{ mr: 2, color: tab.hasIssues ? 'warning.main' : 'success.main' }}>
                      {tab.hasIssues ? <WarningIcon /> : <CheckIcon />}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">
                        {tab.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tab.hasIssues ? 'Issues found' : 'No issues found'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Analysis category tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={tab.id}
                  icon={tab.icon} 
                  label={tab.label} 
                  id={tab.id}
                  aria-controls={`tabpanel-${index}`}
                  iconPosition="start"
                />
              ))}
            </Tabs>

            {tabs.map((tab, index) => (
              <Box 
                key={index}
                role="tabpanel" 
                hidden={activeTab !== index} 
                id={`tabpanel-${index}`} 
                aria-labelledby={tab.id}
                sx={{ p: 3 }}
              >
                {activeTab === index && tab.component}
              </Box>
            ))}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              sx={{ px: 4 }}
            >
              Continue to Remediation
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AnalysisPage; 