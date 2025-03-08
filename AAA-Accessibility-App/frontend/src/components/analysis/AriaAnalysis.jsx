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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const AriaAnalysis = ({ results }) => {
  const { updateUserModification } = useAccessibility();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // If no results or no issues
  if (!results || Object.keys(results).length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>No ARIA or HTML Issues Found</AlertTitle>
        Your content meets WCAG 2.1 AAA requirements for robust markup and ARIA attributes.
      </Alert>
    );
  }

  // Mock data for demonstration
  const mockResults = {
    ariaIssues: [
      {
        id: 1,
        element: 'button',
        location: 'Header navigation, line 42',
        issue: 'Missing aria-label on icon-only button',
        severity: 'error',
        code: '<button class="menu-toggle"><i class="fa fa-bars"></i></button>',
        suggestion: '<button class="menu-toggle" aria-label="Toggle navigation menu"><i class="fa fa-bars"></i></button>',
        wcagCriteria: '4.1.2 Name, Role, Value (A)',
      },
      {
        id: 2,
        element: 'div',
        location: 'Main content, line 87',
        issue: 'Interactive element using incorrect role',
        severity: 'error',
        code: '<div role="button" tabindex="0" onclick="toggleSection()">Expand Section</div>',
        suggestion: '<button onclick="toggleSection()">Expand Section</button>',
        wcagCriteria: '4.1.2 Name, Role, Value (A)',
      },
      {
        id: 3,
        element: 'form',
        location: 'Contact form, line 156',
        issue: 'Form controls missing associated labels',
        severity: 'error',
        code: '<input type="text" name="email" placeholder="Enter your email">',
        suggestion: '<label for="email">Email</label>\n<input type="text" id="email" name="email" placeholder="Enter your email">',
        wcagCriteria: '3.3.2 Labels or Instructions (A)',
      },
    ],
    statusMessages: [
      {
        id: 1,
        element: 'div',
        location: 'Form submission, line 180',
        issue: 'Status message not announced to screen readers',
        severity: 'warning',
        code: '<div class="status">Form submitted successfully!</div>',
        suggestion: '<div class="status" role="status" aria-live="polite">Form submitted successfully!</div>',
        wcagCriteria: '4.1.3 Status Messages (AA)',
      },
      {
        id: 2,
        element: 'span',
        location: 'Search results, line 210',
        issue: 'Dynamic content update not announced',
        severity: 'warning',
        code: '<span class="results-count">5 results found</span>',
        suggestion: '<span class="results-count" aria-live="polite" role="status">5 results found</span>',
        wcagCriteria: '4.1.3 Status Messages (AA)',
      },
    ],
    semanticStructure: [
      {
        id: 1,
        element: 'section',
        location: 'Main content, line 65',
        issue: 'Section missing heading',
        severity: 'warning',
        code: '<section class="features">\n  <div>Feature 1</div>\n  <div>Feature 2</div>\n</section>',
        suggestion: '<section class="features" aria-labelledby="features-heading">\n  <h2 id="features-heading">Features</h2>\n  <div>Feature 1</div>\n  <div>Feature 2</div>\n</section>',
        wcagCriteria: '1.3.1 Info and Relationships (A)',
      },
      {
        id: 2,
        element: 'ul',
        location: 'Navigation, line 30',
        issue: 'List markup used for styling instead of semantics',
        severity: 'info',
        code: '<div class="nav-links">\n  <div class="nav-item">Home</div>\n  <div class="nav-item">About</div>\n</div>',
        suggestion: '<ul class="nav-links">\n  <li class="nav-item">Home</li>\n  <li class="nav-item">About</li>\n</ul>',
        wcagCriteria: '1.3.1 Info and Relationships (A)',
      },
    ],
  };

  const handleStartEdit = (id, originalCode) => {
    setEditingId(id);
    setEditText(originalCode);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (category, id) => {
    console.log(`[AriaAnalysis] Saving custom code for ${category} issue ${id}:`, editText);
    updateUserModification('ariaValidation', `${category}-${id}`, {
      accepted: true,
      customCode: editText,
    });
    setEditingId(null);
    setEditText('');
  };

  const handleAcceptSuggestion = (category, id, suggestedCode) => {
    console.log(`[AriaAnalysis] Accepting suggested code for ${category} issue ${id}`);
    updateUserModification('ariaValidation', `${category}-${id}`, {
      accepted: true,
      customCode: suggestedCode,
    });
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'warning':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'info':
        return <InfoIcon fontSize="small" color="info" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          ARIA & HTML Issues
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>WCAG 2.1 ARIA & HTML Requirements</AlertTitle>
        <Typography variant="body2">
          • Name, Role, Value (4.1.2): All UI components must have appropriate name, role, and value information for accessibility
        </Typography>
        <Typography variant="body2">
          • Status Messages (4.1.3): Status messages must be programmatically determined without receiving focus
        </Typography>
        <Typography variant="body2">
          • Info and Relationships (1.3.1): Information, structure, and relationships must be programmatically determined
        </Typography>
      </Alert>

      {/* ARIA Issues */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="aria-issues-content"
          id="aria-issues-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon sx={{ mr: 1 }} color="error" />
            <Typography variant="subtitle1">ARIA Issues ({mockResults.ariaIssues.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="ARIA issues table">
              <TableHead>
                <TableRow>
                  <TableCell>Severity</TableCell>
                  <TableCell>Element</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>WCAG Criteria</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockResults.ariaIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <Chip
                        icon={getSeverityIcon(issue.severity)}
                        label={issue.severity.toUpperCase()}
                        color={getSeverityColor(issue.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        <code>{issue.element}</code>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {issue.location}
                      </Typography>
                    </TableCell>
                    <TableCell>{issue.issue}</TableCell>
                    <TableCell>{issue.wcagCriteria}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleStartEdit(`aria-${issue.id}`, issue.code)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Dialog */}
          {editingId && editingId.startsWith('aria-') && (
            <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Issue Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Code:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: 'grey.50',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                    }}
                  >
                    {mockResults.ariaIssues.find(i => `aria-${i.id}` === editingId)?.code}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Suggested Code:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                    }}
                  >
                    {mockResults.ariaIssues.find(i => `aria-${i.id}` === editingId)?.suggestion}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Custom Code:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ 
                      mb: 2,
                      fontFamily: 'monospace',
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel as CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => setEditText(mockResults.ariaIssues.find(i => `aria-${i.id}` === editingId)?.suggestion)}
                        sx={{ mr: 1 }}
                      >
                        Use Suggestion
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveEdit('aria', editingId.split('-')[1])}
                        disabled={!editText.trim()}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Status Messages */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="status-messages-content"
          id="status-messages-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1 }} color="warning" />
            <Typography variant="subtitle1">Status Messages ({mockResults.statusMessages.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {mockResults.statusMessages.map((issue) => (
              <Grid item xs={12} key={issue.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {issue.element} - {issue.issue}
                      </Typography>
                      <Chip
                        icon={getSeverityIcon(issue.severity)}
                        label={issue.severity.toUpperCase()}
                        color={getSeverityColor(issue.severity)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      {issue.location} | {issue.wcagCriteria}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Current Code:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            mb: 2, 
                            bgcolor: 'grey.50',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {issue.code}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Suggested Code:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            mb: 2, 
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {issue.suggestion}
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleStartEdit(`status-${issue.id}`, issue.code)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAcceptSuggestion('status', issue.id, issue.suggestion)}
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

      {/* Semantic Structure */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="semantic-structure-content"
          id="semantic-structure-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} color="info" />
            <Typography variant="subtitle1">Semantic Structure ({mockResults.semanticStructure.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {mockResults.semanticStructure.map((issue) => (
              <Grid item xs={12} key={issue.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {issue.element} - {issue.issue}
                      </Typography>
                      <Chip
                        icon={getSeverityIcon(issue.severity)}
                        label={issue.severity.toUpperCase()}
                        color={getSeverityColor(issue.severity)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      {issue.location} | {issue.wcagCriteria}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Current Code:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            mb: 2, 
                            bgcolor: 'grey.50',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {issue.code}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Suggested Code:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 1.5, 
                            mb: 2, 
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {issue.suggestion}
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleStartEdit(`semantic-${issue.id}`, issue.code)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleAcceptSuggestion('semantic', issue.id, issue.suggestion)}
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

      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          <AlertTitle>Implementation Note</AlertTitle>
          <Typography variant="body2">
            Proper ARIA and semantic HTML are essential for assistive technologies to correctly interpret your content.
            Always test with actual screen readers and other assistive technologies after implementing these changes.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default AriaAnalysis; 