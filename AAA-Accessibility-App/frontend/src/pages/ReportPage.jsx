import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Link,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
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
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Import Web3 components
import BlockchainVerification from '../components/web3/BlockchainVerification';
import { checkWeb3Availability } from '../services/blockchainService';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const ReportPage = () => {
  const navigate = useNavigate();
  const { 
    analysisResults, 
    userModifications,
    uploadedContent,
    resetProcess
  } = useAccessibility();
  
  const [showDetails, setShowDetails] = useState(false);
  const [web3Available, setWeb3Available] = useState(false);
  const [showWeb3Verification, setShowWeb3Verification] = useState(false);

  // Check if Web3 features are available
  useEffect(() => {
    const checkWeb3 = async () => {
      const available = await checkWeb3Availability();
      setWeb3Available(available);
    };
    
    checkWeb3();
  }, []);

  const handleStartNew = () => {
    resetProcess();
    navigate('/');
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
  const compliancePercentage = totalIssues > 0 ? Math.round((acceptedCount / totalIssues) * 100) : 100;

  // Prepare chart data
  const chartData = {
    labels: ['Fixed Issues', 'Remaining Issues'],
    datasets: [
      {
        data: [acceptedCount, totalIssues - acceptedCount],
        backgroundColor: ['#4caf50', '#ff9800'],
        borderColor: ['#388e3c', '#f57c00'],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for WCAG criteria compliance
  const wcagCriteria = [
    { id: '1.4.6', name: 'Contrast (Enhanced)', level: 'AAA', status: 'pass', category: 'Perceivable' },
    { id: '1.4.9', name: 'Images of Text (No Exception)', level: 'AAA', status: 'pass', category: 'Perceivable' },
    { id: '2.1.3', name: 'Keyboard (No Exception)', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.2.3', name: 'No Timing', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.2.4', name: 'Interruptions', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.2.5', name: 'Re-authenticating', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.3.2', name: 'Three Flashes', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.4.8', name: 'Location', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.4.9', name: 'Link Purpose (Link Only)', level: 'AAA', status: 'not-applicable', category: 'Operable' },
    { id: '2.4.10', name: 'Section Headings', level: 'AAA', status: 'pass', category: 'Operable' },
    { id: '3.1.3', name: 'Unusual Words', level: 'AAA', status: 'pass', category: 'Understandable' },
    { id: '3.1.4', name: 'Abbreviations', level: 'AAA', status: 'pass', category: 'Understandable' },
    { id: '3.1.5', name: 'Reading Level', level: 'AAA', status: 'pass', category: 'Understandable' },
    { id: '3.1.6', name: 'Pronunciation', level: 'AAA', status: 'pass', category: 'Understandable' },
    { id: '3.2.5', name: 'Change on Request', level: 'AAA', status: 'not-applicable', category: 'Understandable' },
    { id: '3.3.5', name: 'Help', level: 'AAA', status: 'not-applicable', category: 'Understandable' },
    { id: '3.3.6', name: 'Error Prevention (All)', level: 'AAA', status: 'not-applicable', category: 'Understandable' },
  ];

  // Filter criteria by status
  const passedCriteria = wcagCriteria.filter(c => c.status === 'pass');
  const notApplicableCriteria = wcagCriteria.filter(c => c.status === 'not-applicable');
  const failedCriteria = wcagCriteria.filter(c => c.status === 'fail');

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckIcon fontSize="small" color="success" />;
      case 'fail':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'not-applicable':
        return <InfoIcon fontSize="small" color="disabled" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'not-applicable':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pass':
        return 'Passes';
      case 'fail':
        return 'Fails';
      case 'not-applicable':
        return 'Not Applicable';
      default:
        return status;
    }
  };

  // Prepare report data for blockchain verification
  const prepareReportForVerification = () => {
    return {
      contentSummary: {
        title: "Accessibility Compliance Report",
        timestamp: new Date().toISOString(),
        compliancePercentage,
        issuesFixed: acceptedCount,
        totalIssues,
      },
      wcagCompliance: {
        level: "AAA",
        passedCriteria: passedCriteria.map(c => c.id),
        notApplicableCriteria: notApplicableCriteria.map(c => c.id),
        failedCriteria: failedCriteria.map(c => c.id),
      },
      modifications: userModifications,
    };
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Accessibility Compliance Report
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: compliancePercentage >= 90 ? 'success.light' : 'warning.light',
          color: 'text.primary',
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              {compliancePercentage >= 90 
                ? "Excellent! Your content is highly accessible." 
                : "Your content has improved accessibility."}
            </Typography>
            <Typography variant="body1" paragraph>
              {compliancePercentage === 100 
                ? "All identified accessibility issues have been fixed. Your content now meets WCAG 2.1 AAA standards." 
                : `${acceptedCount} out of ${totalIssues} identified issues have been fixed (${compliancePercentage}% compliance).`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Compliance Level:
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={compliancePercentage} 
                sx={{ 
                  flexGrow: 1, 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: compliancePercentage >= 90 ? 'success.main' : 'warning.main',
                  }
                }} 
              />
              <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold' }}>
                {compliancePercentage}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ maxWidth: 200, mx: 'auto' }}>
              <Pie data={chartData} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              WCAG 2.1 AAA Compliance Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: 'success.light' }}>
                  <CardContent>
                    <Typography variant="h4" color="success.dark">
                      {passedCriteria.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Criteria Passed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: 'error.light' }}>
                  <CardContent>
                    <Typography variant="h4" color="error.dark">
                      {failedCriteria.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Criteria Failed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: 'grey.100' }}>
                  <CardContent>
                    <Typography variant="h4" color="text.secondary">
                      {notApplicableCriteria.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Not Applicable
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Button
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              sx={{ mb: 3 }}
            >
              {showDetails ? "Hide Detailed Criteria" : "Show Detailed Criteria"}
            </Button>
            
            {showDetails && (
              <TableContainer component={Paper} variant="outlined">
                <Table aria-label="WCAG criteria table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Criterion</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wcagCriteria.map((criterion) => (
                      <TableRow key={criterion.id}>
                        <TableCell>
                          <Link 
                            href={`https://www.w3.org/WAI/WCAG21/quickref/#${criterion.id.toLowerCase().replace('.', '-')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {criterion.id}
                          </Link>
                        </TableCell>
                        <TableCell>{criterion.name}</TableCell>
                        <TableCell>{criterion.category}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(criterion.status)}
                            label={getStatusText(criterion.status)}
                            color={getStatusColor(criterion.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Applied Accessibility Improvements
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
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
                      secondary={`${count} ${count === 1 ? 'improvement' : 'improvements'} applied`} 
                    />
                    <Chip 
                      label={count} 
                      color="success" 
                      size="small" 
                    />
                  </ListItem>
                );
              })}
              
              {acceptedCount === 0 && (
                <ListItem>
                  <ListItemIcon><InfoIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="No improvements applied" 
                    secondary="No accessibility fixes were applied to the content" 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DownloadIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Download Report" 
                  secondary="Save this report as PDF" 
                />
                <Button variant="outlined" size="small">
                  Download
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <DownloadIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Export Content" 
                  secondary="Download your accessible content" 
                />
                <Button variant="outlined" size="small">
                  Export
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PrintIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Print Report" 
                  secondary="Print a physical copy of this report" 
                />
                <Button variant="outlined" size="small">
                  Print
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <ShareIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Share Report" 
                  secondary="Share this report with others" 
                />
                <Button variant="outlined" size="small">
                  Share
                </Button>
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Next Steps
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Manual Testing Recommended</AlertTitle>
              <Typography variant="body2">
                While our tool has helped improve accessibility, we recommend conducting manual testing with real users and assistive technologies.
              </Typography>
            </Alert>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Test with Screen Readers" 
                  secondary="Verify content works with NVDA, JAWS, or VoiceOver" 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Keyboard Navigation Test" 
                  secondary="Ensure all functionality is accessible via keyboard" 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="User Testing" 
                  secondary="Test with users who have disabilities" 
                />
              </ListItem>
            </List>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={handleStartNew}
              sx={{ mt: 2 }}
            >
              Start New Analysis
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Download and Share Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 4 }}>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<HomeIcon />} 
            onClick={handleStartNew}
            sx={{ mr: 2 }}
          >
            Start New Analysis
          </Button>
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            sx={{ mr: 2 }}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            sx={{ mr: 2 }}
          >
            Download PDF
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
          >
            Share Report
          </Button>
        </Box>
      </Box>
      
      {/* Web3 Verification Section */}
      {web3Available && (
        <Box sx={{ mt: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showWeb3Verification}
                onChange={(e) => setShowWeb3Verification(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VerifiedIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Enable Web3 Verification</Typography>
              </Box>
            }
          />
          
          {showWeb3Verification && (
            <BlockchainVerification report={prepareReportForVerification()} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReportPage; 