import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Code as CodeIcon, TextFields as TextIcon, Send as SendIcon } from '@mui/icons-material';

const TextUploader = ({ onUpload, isLoading = false }) => {
  const [text, setText] = useState('');
  const [contentType, setContentType] = useState('html');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text content');
      return;
    }
    
    console.log('[TextUploader] Submitting text content:', { contentType, textLength: text.length });
    setError(null);
    onUpload(text, contentType);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (error) setError(null);
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Content Type</FormLabel>
        <RadioGroup
          row
          aria-label="content-type"
          name="content-type"
          value={contentType}
          onChange={handleContentTypeChange}
        >
          <FormControlLabel 
            value="html" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 0.5 }} />
                <span>HTML</span>
              </Box>
            } 
          />
          <FormControlLabel 
            value="plaintext" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextIcon sx={{ mr: 0.5 }} />
                <span>Plain Text</span>
              </Box>
            } 
          />
        </RadioGroup>
      </FormControl>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {contentType === 'html' ? 'Enter HTML Content' : 'Enter Plain Text Content'}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          placeholder={contentType === 'html' ? '<div>Your HTML content here...</div>' : 'Your text content here...'}
          value={text}
          onChange={handleTextChange}
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              fontFamily: contentType === 'html' ? 'monospace' : 'inherit',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {text.length} characters
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Content'}
        </Button>
      </Box>
    </Box>
  );
};

export default TextUploader; 