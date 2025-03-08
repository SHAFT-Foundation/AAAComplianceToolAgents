import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  Build as RemediationIcon,
  Assessment as ReportIcon,
  Contrast as ContrastIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Videocam as VideoIcon,
  TextFields as TextIcon,
  AccessTime as TimeIcon,
  Notifications as NotificationsIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resetProcess } = useAccessibility();

  const handleStartNew = () => {
    resetProcess();
    navigate('/upload');
  };

  const wcagCategories = [
    { 
      title: 'Contrast (Enhanced)', 
      icon: <ContrastIcon />, 
      description: 'Ensures text and non-text content has sufficient contrast against its background.',
      criteria: ['1.4.6 Contrast (Enhanced)', '1.4.11 Non-text Contrast']
    },
    { 
      title: 'Images & Non-Text Content', 
      icon: <ImageIcon />, 
      description: 'Provides alternatives for non-text content to make it accessible.',
      criteria: ['1.1.1 Non-text Content', '1.4.5 Images of Text', '1.4.9 Images of Text (No Exception)']
    },
    { 
      title: 'Video & Audio', 
      icon: <VideoIcon />, 
      description: 'Ensures multimedia content is accessible with captions, transcripts, and descriptions.',
      criteria: ['1.2.6 Sign Language', '1.2.7 Extended Audio Description', '1.2.8 Media Alternative', '1.2.9 Audio-only']
    },
    { 
      title: 'Text & Readability', 
      icon: <TextIcon />, 
      description: 'Makes text content readable and understandable for all users.',
      criteria: ['3.1.3 Unusual Words', '3.1.4 Abbreviations', '3.1.5 Reading Level', '3.1.6 Pronunciation']
    },
    { 
      title: 'Time Limits & Audio', 
      icon: <TimeIcon />, 
      description: 'Ensures users have enough time to read and use content without interruptions.',
      criteria: ['2.2.3 No Timing', '2.2.4 Interruptions', '2.2.5 Re-authenticating', '1.4.7 Low or No Background Audio']
    },
    { 
      title: 'Interruptions & Distractions', 
      icon: <NotificationsIcon />, 
      description: 'Minimizes distractions and allows users to control dynamic content.',
      criteria: ['2.2.4 Interruptions', '2.3.2 Three Flashes', '2.3.3 Animation from Interactions']
    },
    { 
      title: 'ARIA & HTML', 
      icon: <CodeIcon />, 
      description: 'Ensures proper semantic structure and ARIA attributes for assistive technologies.',
      criteria: ['4.1.2 Name, Role, Value', '4.1.3 Status Messages']
    },
  ];

  const workflowSteps = [
    {
      title: 'Upload Content',
      icon: <UploadIcon fontSize="large" color="primary" />,
      description: 'Upload your HTML, images, audio, or video content for accessibility analysis.',
      path: '/upload',
    },
    {
      title: 'Analyze Compliance',
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
      description: 'Our AI analyzes your content against WCAG 2.1 AAA criteria and identifies issues.',
      path: '/analysis',
    },
    {
      title: 'Review & Remediate',
      icon: <RemediationIcon fontSize="large" color="primary" />,
      description: 'Review AI-suggested fixes and customize them to meet your needs.',
      path: '/remediation',
    },
    {
      title: 'Generate Report',
      icon: <ReportIcon fontSize="large" color="primary" />,
      description: 'Get a detailed compliance report and export your accessible content.',
      path: '/report',
    },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          WCAG 2.1 AAA Compliance Tool
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Analyze, fix, and ensure your digital content meets the highest accessibility standards
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<UploadIcon />}
          onClick={handleStartNew}
          sx={{ 
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:focus': {
              outline: '2px solid white',
              outlineOffset: '2px',
            },
          }}
        >
          Start New Analysis
        </Button>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {workflowSteps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                <Box sx={{ mb: 2 }}>{step.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  size="small" 
                  onClick={() => navigate(step.path)}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" component="h2" gutterBottom>
        WCAG 2.1 AAA Coverage
      </Typography>
      <Typography variant="body1" paragraph>
        Our tool helps you meet the following WCAG 2.1 AAA success criteria:
      </Typography>
      
      <Grid container spacing={3}>
        {wcagCategories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>{category.icon}</Box>
                  <Typography variant="h6" component="h3">
                    {category.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  Related Success Criteria:
                </Typography>
                <List dense disablePadding>
                  {category.criteria.map((criterion, idx) => (
                    <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText primary={criterion} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 