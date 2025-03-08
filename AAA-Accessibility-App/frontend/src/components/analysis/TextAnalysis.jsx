import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  TextFields as TextFieldsIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Spellcheck as SpellcheckIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const TextAnalysis = ({ results }) => {
  const { updateUserModification } = useAccessibility();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // If no results or no issues
  if (!results || Object.keys(results).length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>No Text Readability Issues Found</AlertTitle>
        Your text content meets WCAG 2.1 AAA readability requirements.
      </Alert>
    );
  }

  // Mock data for demonstration
  const mockResults = {
    readabilityIssues: [
      {
        id: 1,
        original: "The utilization of complex terminology may impede comprehension for individuals with cognitive disabilities or those who are not domain experts.",
        simplified: "Using complex words can make it hard for people with cognitive disabilities or non-experts to understand.",
        readingLevel: {
          original: "College",
          simplified: "Grade 6",
        },
      },
      {
        id: 2,
        original: "The aforementioned implementation methodology necessitates rigorous adherence to established protocols to mitigate potential vulnerabilities.",
        simplified: "This method requires following set rules carefully to reduce possible security problems.",
        readingLevel: {
          original: "Post-graduate",
          simplified: "Grade 5",
        },
      },
    ],
    unusualWords: [
      {
        id: 1,
        word: "paradigm",
        context: "This represents a new paradigm in accessibility design.",
        explanation: "A typical example or pattern of something; a model.",
      },
      {
        id: 2,
        word: "mitigate",
        context: "These controls help mitigate accessibility barriers.",
        explanation: "Make less severe, serious, or painful; reduce the impact of something.",
      },
    ],
    abbreviations: [
      {
        id: 1,
        abbreviation: "WCAG",
        expansion: "Web Content Accessibility Guidelines",
        context: "This tool helps achieve WCAG 2.1 AAA compliance.",
      },
      {
        id: 2,
        abbreviation: "a11y",
        expansion: "accessibility",
        context: "The a11y features of this website are comprehensive.",
      },
    ],
    pronunciationIssues: [
      {
        id: 1,
        word: "read",
        context: "I read [red] the book yesterday, and I will read [reed] another one tomorrow.",
        pronunciation: "Past tense: 'red', Future tense: 'reed'",
      },
      {
        id: 2,
        word: "content",
        context: "The content [KON-tent] of the article made me content [kun-TENT].",
        pronunciation: "Noun: 'KON-tent', Adjective: 'kun-TENT'",
      },
    ],
  };

  const handleStartEdit = (id, originalText) => {
    setEditingId(id);
    setEditText(originalText);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id) => {
    console.log(`[TextAnalysis] Saving custom text for issue ${id}:`, editText);
    updateUserModification('textSimplification', id, {
      accepted: true,
      customText: editText,
    });
    setEditingId(null);
    setEditText('');
  };

  const handleAcceptSuggestion = (id, suggestedText) => {
    console.log(`[TextAnalysis] Accepting suggested text for issue ${id}`);
    updateUserModification('textSimplification', id, {
      accepted: true,
      customText: suggestedText,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Text & Readability Issues
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>WCAG 2.1 AAA Text Requirements</AlertTitle>
        <Typography variant="body2">
          • Reading Level (3.1.5): Content should be understandable by people with lower secondary education level
        </Typography>
        <Typography variant="body2">
          • Unusual Words (3.1.3): Provide definitions for words used in an unusual way
        </Typography>
        <Typography variant="body2">
          • Abbreviations (3.1.4): Provide expansions or definitions of abbreviations
        </Typography>
        <Typography variant="body2">
          • Pronunciation (3.1.6): Provide pronunciation for words where meaning depends on pronunciation
        </Typography>
      </Alert>

      {/* Readability Issues */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="readability-content"
          id="readability-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextFieldsIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle1">Readability Issues ({mockResults.readabilityIssues.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {mockResults.readabilityIssues.map((issue) => (
              <Grid item xs={12} key={issue.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          Text Simplification #{issue.id}
                        </Typography>
                        <Chip 
                          label={`Reading Level: ${issue.readingLevel.original}`} 
                          color="warning" 
                          size="small" 
                        />
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original Text:
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        bgcolor: 'grey.50',
                      }}
                    >
                      {issue.original}
                    </Paper>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Simplified Text:
                    </Typography>
                    {editingId === issue.id ? (
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
                            onClick={() => handleSaveEdit(issue.id)}
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
                        {issue.simplified}
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={`Reading Level: ${issue.readingLevel.simplified}`} 
                            color="success" 
                            size="small" 
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Paper>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleStartEdit(issue.id, issue.simplified)}
                        disabled={editingId === issue.id}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAcceptSuggestion(issue.id, issue.simplified)}
                        disabled={editingId === issue.id}
                      >
                        Accept Suggestion
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Unusual Words */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unusual-words-content"
          id="unusual-words-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SpellcheckIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle1">Unusual Words ({mockResults.unusualWords.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {mockResults.unusualWords.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {item.word}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Context:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                      {item.context}
                    </Paper>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Explanation:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      {item.explanation}
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Abbreviations */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="abbreviations-content"
          id="abbreviations-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextFieldsIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle1">Abbreviations ({mockResults.abbreviations.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {mockResults.abbreviations.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {item.abbreviation}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Context:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                      {item.context}
                    </Paper>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expansion:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      {item.expansion}
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Pronunciation Issues */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="pronunciation-content"
          id="pronunciation-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RecordVoiceOverIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle1">Pronunciation Issues ({mockResults.pronunciationIssues.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {mockResults.pronunciationIssues.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {item.word}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Context:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                      {item.context}
                    </Paper>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Pronunciation:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      {item.pronunciation}
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3 }}>
        <Alert severity="warning">
          <AlertTitle>Important Note</AlertTitle>
          <Typography variant="body2">
            Text simplification should preserve the original meaning while making content more accessible.
            Always review AI-suggested simplifications to ensure accuracy and appropriate context.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default TextAnalysis; 