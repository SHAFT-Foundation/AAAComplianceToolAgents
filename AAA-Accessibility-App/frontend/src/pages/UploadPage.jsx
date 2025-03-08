import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Videocam as VideoIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

// Import custom components
import FileUploader from '../components/upload/FileUploader';
import TextUploader from '../components/upload/TextUploader';
import UploadPreview from '../components/upload/UploadPreview';

const UploadPage = () => {
  const navigate = useNavigate();
  const { 
    uploadedContent, 
    handleContentUpload, 
    clearUploadedContent, 
    analyzeContent, 
    loading, 
    errors 
  } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState(0);
  const [htmlText, setHtmlText] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleHtmlSubmit = () => {
    if (htmlText.trim()) {
      handleContentUpload('text', htmlText);
    }
  };

  const handleStartAnalysis = async () => {
    console.log('[UploadPage] Starting analysis');
    await analyzeContent();
    navigate('/analysis');
  };

  const hasUploadedContent = () => {
    return (
      uploadedContent.text || 
      uploadedContent.images.length > 0 || 
      uploadedContent.audio || 
      uploadedContent.video
    );
  };

  // Define the tabs for different content types
  const tabs = [
    { label: 'HTML/Text', icon: <CodeIcon />, id: 'html-tab' },
    { label: 'Images', icon: <ImageIcon />, id: 'images-tab' },
    { label: 'Audio', icon: <AudioIcon />, id: 'audio-tab' },
    { label: 'Video', icon: <VideoIcon />, id: 'video-tab' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Content
      </Typography>
      <Typography variant="body1" paragraph>
        Upload your digital content for accessibility analysis. You can upload HTML, images, audio, or video files.
      </Typography>

      {errors.upload && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.upload}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Content type tabs"
          sx={{ mb: 3 }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={tab.id}
              icon={tab.icon} 
              label={tab.label} 
              id={tab.id}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>

        <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="html-tab">
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Enter HTML or Text Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                placeholder="Paste your HTML or text content here..."
                value={htmlText}
                onChange={(e) => setHtmlText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={handleHtmlSubmit}
                disabled={!htmlText.trim() || loading.upload}
              >
                {loading.upload ? <CircularProgress size={24} /> : 'Submit Text'}
              </Button>
            </Box>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="images-tab">
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>
              <FileUploader 
                acceptedFileTypes="image/*"
                maxFiles={10}
                maxSize={5 * 1024 * 1024} // 5MB
                onUpload={(files) => handleContentUpload('images', files)}
                isLoading={loading.upload}
              />
            </Box>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2" aria-labelledby="audio-tab">
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upload Audio
              </Typography>
              <FileUploader 
                acceptedFileTypes="audio/*"
                maxFiles={1}
                maxSize={20 * 1024 * 1024} // 20MB
                onUpload={(files) => handleContentUpload('audio', files[0])}
                isLoading={loading.upload}
              />
            </Box>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 3} id="tabpanel-3" aria-labelledby="video-tab">
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upload Video
              </Typography>
              <FileUploader 
                acceptedFileTypes="video/*"
                maxFiles={1}
                maxSize={50 * 1024 * 1024} // 50MB
                onUpload={(files) => handleContentUpload('video', files[0])}
                isLoading={loading.upload}
              />
            </Box>
          )}
        </Box>
      </Paper>

      {hasUploadedContent() && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Uploaded Content Preview
          </Typography>
          <UploadPreview 
            content={uploadedContent} 
            onClear={clearUploadedContent} 
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleStartAnalysis}
              disabled={loading.analysis}
              sx={{ px: 4 }}
            >
              {loading.analysis ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Start Analysis'
              )}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default UploadPage; 