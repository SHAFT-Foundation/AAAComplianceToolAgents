import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const AltTextAnalysis = ({ results }) => {
  const { updateUserModification } = useAccessibility();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // If no results or no issues
  if (!results || results.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>No Alt Text Issues Found</AlertTitle>
        All images have appropriate alternative text.
      </Alert>
    );
  }

  const handleStartEdit = (imageId, currentAlt) => {
    setEditingId(imageId);
    setEditText(currentAlt);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (imageId) => {
    console.log(`[AltTextAnalysis] Saving custom alt text for image ${imageId}:`, editText);
    updateUserModification('altText', imageId, {
      accepted: true,
      customText: editText,
    });
    setEditingId(null);
    setEditText('');
  };

  const handleAcceptSuggestion = (imageId, suggestedAlt) => {
    console.log(`[AltTextAnalysis] Accepting suggested alt text for image ${imageId}`);
    updateUserModification('altText', imageId, {
      accepted: true,
      customText: suggestedAlt,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Alt Text Issues ({results.length})
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>WCAG 2.1 Alt Text Requirements</AlertTitle>
        <Typography variant="body2">
          • All non-text content must have text alternatives that serve the equivalent purpose
        </Typography>
        <Typography variant="body2">
          • Decorative images should have empty alt text (alt="")
        </Typography>
        <Typography variant="body2">
          • Complex images (charts, diagrams) may need extended descriptions
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.imageId}>
            <Card variant="outlined">
              <CardMedia
                component="img"
                height="200"
                image={`https://via.placeholder.com/400x300?text=Image+${item.imageId}`}
                alt={item.suggestedAlt}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Image {item.imageId}
                    {item.currentAlt === '' && (
                      <Chip 
                        label="Missing Alt Text" 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Divider />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Alt Text:
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    bgcolor: 'grey.50',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: item.currentAlt ? 'flex-start' : 'center',
                    fontStyle: item.currentAlt ? 'normal' : 'italic',
                  }}
                >
                  {item.currentAlt || <Typography variant="body2" color="text.secondary">No alt text provided</Typography>}
                </Paper>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Suggested Alt Text:
                </Typography>
                {editingId === item.imageId ? (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
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
                        onClick={() => handleSaveEdit(item.imageId)}
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
                      p: 1.5, 
                      mb: 2, 
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      minHeight: '40px',
                    }}
                  >
                    {item.suggestedAlt}
                  </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleStartEdit(item.imageId, item.suggestedAlt)}
                    disabled={editingId === item.imageId}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcceptSuggestion(item.imageId, item.suggestedAlt)}
                    disabled={editingId === item.imageId}
                  >
                    Accept Suggestion
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Alert severity="warning">
          <AlertTitle>Important Note</AlertTitle>
          <Typography variant="body2">
            While AI can generate reasonable alt text, human review is essential to ensure accuracy and context.
            Consider the purpose of each image in your content and adjust the alt text accordingly.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default AltTextAnalysis; 