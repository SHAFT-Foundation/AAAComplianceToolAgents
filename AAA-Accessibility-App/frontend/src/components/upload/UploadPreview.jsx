import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Videocam as VideoIcon,
} from '@mui/icons-material';

const UploadPreview = ({ content, onClear }) => {
  const { text, images, audio, video } = content;

  const handleClearItem = (type, index = null) => {
    if (index !== null) {
      // For arrays like images
      onClear(type, index);
    } else {
      // For single items like text, audio, video
      onClear(type);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Text Content Preview */}
        {text && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.100' }}>
                <CodeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  HTML/Text Content
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleClearItem('text')}
                  aria-label="Remove text content"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Divider />
              <CardContent>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    maxHeight: 200, 
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {text.length > 500 ? `${text.substring(0, 500)}...` : text}
                </Paper>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`${text.length} characters`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Images Preview */}
        {images && images.length > 0 && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.100' }}>
                <ImageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Images ({images.length})
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleClearItem('images')}
                  aria-label="Remove all images"
                >
                  Clear All
                </Button>
              </Box>
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card variant="outlined">
                        <CardMedia
                          component="img"
                          height="140"
                          image={image instanceof File ? URL.createObjectURL(image) : image}
                          alt={`Uploaded image ${index + 1}`}
                          sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
                        />
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" noWrap sx={{ maxWidth: '70%' }}>
                            {image instanceof File ? image.name : `Image ${index + 1}`}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleClearItem('images', index)}
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Audio Preview */}
        {audio && (
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.100' }}>
                <AudioIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Audio File
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleClearItem('audio')}
                  aria-label="Remove audio file"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Divider />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="body2" gutterBottom>
                    {audio instanceof File ? audio.name : 'Audio file'}
                  </Typography>
                  {audio instanceof File && (
                    <audio controls style={{ width: '100%', marginTop: 8 }}>
                      <source src={URL.createObjectURL(audio)} type={audio.type} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Video Preview */}
        {video && (
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.100' }}>
                <VideoIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Video File
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleClearItem('video')}
                  aria-label="Remove video file"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Divider />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="body2" gutterBottom>
                    {video instanceof File ? video.name : 'Video file'}
                  </Typography>
                  {video instanceof File && (
                    <video 
                      controls 
                      style={{ width: '100%', maxHeight: 240, marginTop: 8 }}
                    >
                      <source src={URL.createObjectURL(video)} type={video.type} />
                      Your browser does not support the video element.
                    </video>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* If no content is uploaded */}
      {!text && images.length === 0 && !audio && !video && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No content has been uploaded yet.
        </Typography>
      )}
    </Box>
  );
};

export default UploadPreview; 