import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Divider,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Audiotrack as AudiotrackIcon,
  Videocam as VideocamIcon,
  ClosedCaption as ClosedCaptionIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  AccessibilityNew as AccessibilityNewIcon,
  Subtitles as SubtitlesIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const MediaAnalysis = ({ transcripts, signLanguage, audioDescriptions }) => {
  const { updateUserModification } = useAccessibility();
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // If no results or no issues
  if (
    (!transcripts || Object.keys(transcripts).length === 0) &&
    (!signLanguage || Object.keys(signLanguage).length === 0) &&
    (!audioDescriptions || Object.keys(audioDescriptions).length === 0)
  ) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>No Media Accessibility Issues Found</AlertTitle>
        Your media content meets WCAG 2.1 AAA accessibility requirements or no media content was detected.
      </Alert>
    );
  }

  // Mock data for demonstration
  const mockData = {
    transcripts: {
      audio: {
        id: 'audio-1',
        fileName: 'welcome-message.mp3',
        duration: '1:45',
        transcript: `Welcome to our accessibility tool. This application helps you identify and fix accessibility issues in your digital content. By using this tool, you can ensure that your website, documents, and media are accessible to everyone, including people with disabilities.`,
      },
      video: {
        id: 'video-1',
        fileName: 'tutorial.mp4',
        duration: '3:22',
        captions: [
          { start: '00:00:00', end: '00:00:05', text: 'Welcome to the WCAG 2.1 AAA Compliance Tutorial' },
          { start: '00:00:06', end: '00:00:10', text: 'In this video, we will explore how to make your content accessible' },
          { start: '00:00:11', end: '00:00:15', text: 'Let\'s start by looking at the key principles of accessibility' },
          // More captions would be here
        ],
      },
    },
    signLanguage: {
      id: 'sign-1',
      videoId: 'video-1',
      status: 'required',
      message: 'This video contains speech and requires sign language interpretation for WCAG 2.1 AAA compliance.',
      options: [
        { id: 'option-1', name: 'Add sign language video overlay' },
        { id: 'option-2', name: 'Provide separate sign language version' },
      ],
    },
    audioDescriptions: {
      id: 'audiodesc-1',
      videoId: 'video-1',
      status: 'required',
      message: 'This video contains visual information that is not conveyed through audio and requires extended audio descriptions.',
      suggestedDescriptions: [
        { 
          timeCode: '00:00:20', 
          description: 'The screen shows a diagram of the four WCAG principles: Perceivable, Operable, Understandable, and Robust, arranged in a circle.' 
        },
        { 
          timeCode: '00:01:05', 
          description: 'A demonstration of color contrast checking is shown, with a tool highlighting low-contrast text on a webpage.' 
        },
        { 
          timeCode: '00:02:30', 
          description: 'A person using a screen reader navigates through a properly structured webpage with headings and landmarks.' 
        },
      ],
    },
  };

  const handleStartEdit = (id, originalText) => {
    setEditingId(id);
    setEditText(originalText);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (category, id) => {
    console.log(`[MediaAnalysis] Saving custom ${category} for item ${id}:`, editText);
    updateUserModification(category, id, {
      accepted: true,
      customText: editText,
    });
    setEditingId(null);
    setEditText('');
  };

  const handleAcceptSuggestion = (category, id, suggestedText) => {
    console.log(`[MediaAnalysis] Accepting suggested ${category} for item ${id}`);
    updateUserModification(category, id, {
      accepted: true,
      customText: suggestedText,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Media Accessibility Issues
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>WCAG 2.1 AAA Media Requirements</AlertTitle>
        <Typography variant="body2">
          • Sign Language (1.2.6): Provide sign language interpretation for all prerecorded audio content
        </Typography>
        <Typography variant="body2">
          • Extended Audio Description (1.2.7): Provide extended audio descriptions for all prerecorded video content
        </Typography>
        <Typography variant="body2">
          • Media Alternative (1.2.8): Provide an alternative for time-based media for all prerecorded video content
        </Typography>
        <Typography variant="body2">
          • Audio-only (1.2.9): Provide alternatives for live audio-only content
        </Typography>
      </Alert>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Media accessibility tabs"
        >
          <Tab 
            icon={<ClosedCaptionIcon />} 
            label="Transcripts & Captions" 
            id="media-tab-0"
            aria-controls="media-tabpanel-0"
          />
          <Tab 
            icon={<AccessibilityNewIcon />} 
            label="Sign Language" 
            id="media-tab-1"
            aria-controls="media-tabpanel-1"
          />
          <Tab 
            icon={<RecordVoiceOverIcon />} 
            label="Audio Descriptions" 
            id="media-tab-2"
            aria-controls="media-tabpanel-2"
          />
        </Tabs>

        {/* Transcripts & Captions Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="media-tabpanel-0"
          aria-labelledby="media-tab-0"
          sx={{ p: 3 }}
        >
          {activeTab === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Transcripts & Captions
              </Typography>
              
              {/* Audio Transcript */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="audio-transcript-content"
                  id="audio-transcript-header"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AudiotrackIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2">
                      Audio Transcript - {mockData.transcripts.audio.fileName} ({mockData.transcripts.audio.duration})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <audio 
                      controls 
                      style={{ width: '100%', marginBottom: 16 }}
                    >
                      <source src="#" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Generated Transcript:
                    </Typography>
                    
                    {editingId === mockData.transcripts.audio.id ? (
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          variant="outlined"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={handleCancelEdit}
                            sx={{ mr: 1 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSaveEdit('transcripts', mockData.transcripts.audio.id)}
                            disabled={!editText.trim()}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                        }}
                      >
                        {mockData.transcripts.audio.transcript}
                      </Paper>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleStartEdit(mockData.transcripts.audio.id, mockData.transcripts.audio.transcript)}
                        disabled={editingId === mockData.transcripts.audio.id}
                      >
                        Edit Transcript
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAcceptSuggestion('transcripts', mockData.transcripts.audio.id, mockData.transcripts.audio.transcript)}
                        disabled={editingId === mockData.transcripts.audio.id}
                      >
                        Accept Transcript
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              
              {/* Video Captions */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="video-captions-content"
                  id="video-captions-header"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VideocamIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2">
                      Video Captions - {mockData.transcripts.video.fileName} ({mockData.transcripts.video.duration})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <video 
                      controls 
                      style={{ width: '100%', maxHeight: 300, marginBottom: 16 }}
                    >
                      <source src="#" type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Generated Captions:
                    </Typography>
                    
                    <Paper variant="outlined" sx={{ mb: 2 }}>
                      <List dense>
                        {mockData.transcripts.video.captions.map((caption, index) => (
                          <ListItem key={index} divider={index < mockData.transcripts.video.captions.length - 1}>
                            <ListItemIcon sx={{ minWidth: 100 }}>
                              <Chip 
                                label={`${caption.start} - ${caption.end}`} 
                                size="small" 
                                variant="outlined"
                              />
                            </ListItemIcon>
                            <ListItemText primary={caption.text} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Edit Captions
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAcceptSuggestion('captions', mockData.transcripts.video.id, 'captions')}
                      >
                        Accept Captions
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>

        {/* Sign Language Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="media-tabpanel-1"
          aria-labelledby="media-tab-1"
          sx={{ p: 3 }}
        >
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Sign Language Interpretation
              </Typography>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Sign Language Required</AlertTitle>
                <Typography variant="body2">
                  {mockData.signLanguage.message}
                </Typography>
              </Alert>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Video: {mockData.transcripts.video.fileName}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <video 
                        controls 
                        style={{ width: '100%', maxHeight: 250 }}
                      >
                        <source src="#" type="video/mp4" />
                        Your browser does not support the video element.
                      </video>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: 'grey.100',
                          minHeight: 250,
                        }}
                      >
                        <AccessibilityNewIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          Sign language interpretation placeholder
                        </Typography>
                        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          In a production environment, this would be replaced with actual sign language video
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                    Options:
                  </Typography>
                  <List>
                    {mockData.signLanguage.options.map((option) => (
                      <ListItem key={option.id}>
                        <ListItemIcon>
                          <SubtitlesIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleAcceptSuggestion('signLanguage', option.id, option.name)}
                        >
                          Select
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
              
              <Alert severity="info">
                <AlertTitle>Implementation Note</AlertTitle>
                <Typography variant="body2">
                  For WCAG 2.1 AAA compliance, sign language interpretation must be provided for all prerecorded audio content in synchronized media.
                  This typically requires working with professional sign language interpreters.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>

        {/* Audio Descriptions Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 2}
          id="media-tabpanel-2"
          aria-labelledby="media-tab-2"
          sx={{ p: 3 }}
        >
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Extended Audio Descriptions
              </Typography>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Audio Descriptions Required</AlertTitle>
                <Typography variant="body2">
                  {mockData.audioDescriptions.message}
                </Typography>
              </Alert>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Video: {mockData.transcripts.video.fileName}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <video 
                    controls 
                    style={{ width: '100%', maxHeight: 300, marginBottom: 16 }}
                  >
                    <source src="#" type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Suggested Audio Descriptions:
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ mb: 2 }}>
                    <List>
                      {mockData.audioDescriptions.suggestedDescriptions.map((desc, index) => (
                        <ListItem key={index} divider={index < mockData.audioDescriptions.suggestedDescriptions.length - 1}>
                          <ListItemIcon sx={{ minWidth: 80 }}>
                            <Chip 
                              label={desc.timeCode} 
                              size="small" 
                              variant="outlined"
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={desc.description} 
                            secondary={
                              <Button 
                                size="small" 
                                startIcon={<EditIcon />}
                                onClick={() => handleStartEdit(`audiodesc-${index}`, desc.description)}
                                sx={{ mt: 1 }}
                              >
                                Edit
                              </Button>
                            }
                          />
                          {editingId === `audiodesc-${index}` ? (
                            <Box sx={{ width: '100%', ml: 2 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                sx={{ mb: 1 }}
                              />
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  size="small"
                                  startIcon={<CancelIcon />}
                                  onClick={handleCancelEdit}
                                  sx={{ mr: 1 }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  startIcon={<SaveIcon />}
                                  onClick={() => handleSaveEdit('audioDescriptions', `audiodesc-${index}`)}
                                  disabled={!editText.trim()}
                                >
                                  Save
                                </Button>
                              </Box>
                            </Box>
                          ) : null}
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckIcon />}
                      onClick={() => handleAcceptSuggestion('audioDescriptions', mockData.audioDescriptions.id, 'descriptions')}
                    >
                      Accept All Descriptions
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
              <Alert severity="info">
                <AlertTitle>Implementation Note</AlertTitle>
                <Typography variant="body2">
                  Extended audio descriptions involve pausing the video when necessary to provide additional descriptions
                  of visual content that cannot be described during natural pauses in the audio.
                  This is required for WCAG 2.1 AAA compliance when the existing audio does not provide enough time
                  to describe important visual details.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MediaAnalysis; 