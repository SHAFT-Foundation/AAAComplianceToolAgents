import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  Done as DoneIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

const RemediationPage = () => {
  const navigate = useNavigate();
  const { 
    analysisResults, 
    userModifications,
    applyModifications,
    loading, 
    errors,
    setCurrentStep
  } = useAccessibility();
  
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    console.log('[RemediationPage] Applying all modifications');
    await applyModifications();
    navigate('/report');
  };

  // Count accepted modifications
  const countAcceptedModifications = () => {
    let count = 0;
    Object.keys(userModifications).forEach(category => {
      count += Object.keys(userModifications[category]).length;
    });
    return count;
  };

  // Count total issues
  const countTotalIssues = () => {
    let count = 0;
    
    // Count contrast issues
    if (analysisResults.contrast && analysisResults.contrast.issues) {
      count += analysisResults.contrast.issues.length;
    }
    
    // Count alt text issues
    if (analysisResults.altText) {
      count += analysisResults.altText.length;
    }
    
    // Count text simplification issues
    if (analysisResults.textSimplification) {
      count += Object.keys(analysisResults.textSimplification).length;
    }
    
    // Count media issues
    if (analysisResults.transcripts) {
      count += Object.keys(analysisResults.transcripts).length;
    }
    if (analysisResults.signLanguage) {
      count += Object.keys(analysisResults.signLanguage).length;
    }
    if (analysisResults.audioDescriptions) {
      count += Object.keys(analysisResults.audioDescriptions).length;
    }
    
    // Count ARIA issues
    if (analysisResults.ariaValidation) {
      count += Object.keys(analysisResults.ariaValidation).length;
    }
    
    return count;
  };

  const acceptedCount = countAcceptedModifications();
  const totalIssues = countTotalIssues();

  // Define remediation steps
  const steps = [
    {
      label: 'Review Issues',
      description: 'Review all identified accessibility issues and their suggested fixes.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              We've identified {totalIssues} accessibility issues in your content. 
              Review each category and accept the suggested fixes or provide your own.
            </Typography>
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ContrastIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Contrast
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Color contrast issues that need to be fixed to meet the 7:1 ratio requirement for AAA compliance.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/analysis')}
                  >
                    Review Issues
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ImageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Alt Text
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Images missing appropriate alternative text descriptions for screen readers.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/analysis')}
                  >
                    Review Issues
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Text & Readability
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Text content that needs simplification, pronunciation guides, or definition of unusual terms.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/analysis')}
                  >
                    Review Issues
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VideocamIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Media
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Audio and video content requiring transcripts, captions, sign language, or audio descriptions.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/analysis')}
                  >
                    Review Issues
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      ARIA & HTML
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Markup issues related to semantic structure, ARIA attributes, and status messages.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/analysis')}
                  >
                    Review Issues
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Confirm Changes',
      description: 'Review and confirm all the changes you want to apply.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity={acceptedCount > 0 ? "info" : "warning"} 
            sx={{ mb: 3 }}
          >
            <Typography variant="body1">
              {acceptedCount > 0 
                ? `You've accepted ${acceptedCount} out of ${totalIssues} suggested fixes.` 
                : "You haven't accepted any suggested fixes yet. Go back to the Analysis page to review and accept suggestions."}
            </Typography>
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary of Changes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {Object.keys(userModifications).map((category) => {
                const count = Object.keys(userModifications[category]).length;
                if (count === 0) return null;
                
                let icon;
                let label;
                
                switch(category) {
                  case 'contrast':
                    icon = <ContrastIcon color="primary" />;
                    label = 'Contrast Fixes';
                    break;
                  case 'altText':
                    icon = <ImageIcon color="primary" />;
                    label = 'Alt Text Improvements';
                    break;
                  case 'textSimplification':
                    icon = <TextIcon color="primary" />;
                    label = 'Text Simplifications';
                    break;
                  case 'transcripts':
                  case 'captions':
                    icon = <AudioIcon color="primary" />;
                    label = 'Transcripts & Captions';
                    break;
                  case 'signLanguage':
                    icon = <VideocamIcon color="primary" />;
                    label = 'Sign Language Options';
                    break;
                  case 'audioDescriptions':
                    icon = <VideocamIcon color="primary" />;
                    label = 'Audio Descriptions';
                    break;
                  case 'ariaValidation':
                    icon = <CodeIcon color="primary" />;
                    label = 'ARIA & HTML Fixes';
                    break;
                  default:
                    icon = <InfoIcon color="primary" />;
                    label = category;
                }
                
                return (
                  <ListItem key={category}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText 
                      primary={label} 
                      secondary={`${count} ${count === 1 ? 'change' : 'changes'} to be applied`} 
                    />
                    <Chip 
                      label={count} 
                      color="primary" 
                      size="small" 
                    />
                  </ListItem>
                );
              })}
              
              {acceptedCount === 0 && (
                <ListItem>
                  <ListItemIcon><InfoIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="No changes selected" 
                    secondary="Return to the Analysis page to select changes to apply" 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          
          {acceptedCount > 0 && (
            <Alert severity="warning">
              <Typography variant="body2">
                Please review all selected changes carefully before proceeding. 
                Once applied, these changes will modify your content to improve accessibility.
              </Typography>
            </Alert>
          )}
        </Box>
      ),
    },
    {
      label: 'Apply Changes',
      description: 'Apply all confirmed changes to your content.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              Ready to apply {acceptedCount} accessibility improvements to your content.
              Click "Apply Changes" to proceed.
            </Typography>
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            {loading.remediation ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6">
                  Applying accessibility improvements...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This may take a few moments depending on the number of changes.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {acceptedCount > 0 
                    ? "Ready to apply all accessibility improvements" 
                    : "No changes selected to apply"}
                </Typography>
                <Typography variant="body1" paragraph>
                  {acceptedCount > 0 
                    ? "Click the button below to apply all selected changes to your content." 
                    : "Please go back and select changes to apply."}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<DoneIcon />}
                  onClick={handleFinish}
                  disabled={acceptedCount === 0 || loading.remediation}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Apply Changes
                </Button>
              </Box>
            )}
          </Paper>
          
          {errors.remediation && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {errors.remediation}
            </Alert>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Remediation
      </Typography>
      <Typography variant="body1" paragraph>
        Review and apply the suggested accessibility improvements to make your content WCAG 2.1 AAA compliant.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography variant="subtitle1">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                {step.content}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                  )}
                  {index < steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={index === 1 && acceptedCount === 0}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default RemediationPage; 