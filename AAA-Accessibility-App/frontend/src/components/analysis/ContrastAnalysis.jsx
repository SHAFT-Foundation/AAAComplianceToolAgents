import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Info as InfoIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const ContrastAnalysis = ({ results }) => {
  const { updateUserModification } = useAccessibility();
  const [showOriginal, setShowOriginal] = useState(true);

  // If no results or no issues
  if (!results || !results.issues || results.issues.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>No Contrast Issues Found</AlertTitle>
        All text and non-text elements meet WCAG 2.1 AAA contrast requirements.
      </Alert>
    );
  }

  const toggleView = () => {
    setShowOriginal(!showOriginal);
  };

  const handleAcceptSuggestion = (issueIndex) => {
    console.log(`[ContrastAnalysis] Accepting suggestion for issue ${issueIndex}`);
    updateUserModification('contrast', issueIndex, {
      accepted: true,
      color: results.issues[issueIndex].suggestion,
    });
  };

  const getContrastStatus = (ratio, required) => {
    if (ratio >= required) {
      return {
        icon: <CheckIcon fontSize="small" />,
        color: 'success',
        text: 'Passes AAA',
      };
    } else if (ratio >= required * 0.7) {
      return {
        icon: <WarningIcon fontSize="small" />,
        color: 'warning',
        text: 'Passes AA only',
      };
    } else {
      return {
        icon: <ErrorIcon fontSize="small" />,
        color: 'error',
        text: 'Fails',
      };
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Contrast Issues ({results.issues.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={showOriginal ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={toggleView}
        >
          {showOriginal ? 'Show Suggested Colors' : 'Show Original Colors'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>WCAG 2.1 AAA Contrast Requirements</AlertTitle>
        <Typography variant="body2">
          • Normal text: 7:1 contrast ratio minimum
        </Typography>
        <Typography variant="body2">
          • Large text (18pt or 14pt bold): 4.5:1 contrast ratio minimum
        </Typography>
        <Typography variant="body2">
          • Non-text elements (icons, boundaries): 3:1 contrast ratio minimum
        </Typography>
      </Alert>

      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="contrast issues table">
          <TableHead>
            <TableRow>
              <TableCell>Element</TableCell>
              <TableCell>Colors</TableCell>
              <TableCell>Contrast Ratio</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.issues.map((issue, index) => {
              const status = getContrastStatus(issue.ratio, issue.required);
              
              return (
                <TableRow key={index}>
                  <TableCell>{issue.element}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: showOriginal ? issue.foreground : issue.suggestion,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">
                          {showOriginal ? issue.foreground : issue.suggestion}
                        </Typography>
                      </Box>
                      on
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: issue.background,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">
                          {issue.background}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {showOriginal ? issue.ratio : (issue.suggestion ? '7.1+' : issue.ratio)}
                  </TableCell>
                  <TableCell>{issue.required}:1</TableCell>
                  <TableCell>
                    <Chip
                      icon={status.icon}
                      label={status.text}
                      color={status.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAcceptSuggestion(index)}
                      disabled={!showOriginal}
                    >
                      {showOriginal ? 'View Suggestion' : 'Accept'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Preview:
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {results.issues.map((issue, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {issue.element}
                      </Typography>
                      <Divider />
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Box sx={{ flex: 1, p: 2, mr: 1 }}>
                        <Typography variant="body2" gutterBottom align="center">
                          Original
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: issue.background,
                            color: issue.foreground,
                            borderRadius: 1,
                            textAlign: 'center',
                          }}
                        >
                          Sample Text
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, p: 2, ml: 1 }}>
                        <Typography variant="body2" gutterBottom align="center">
                          Suggested
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: issue.background,
                            color: issue.suggestion,
                            borderRadius: 1,
                            textAlign: 'center',
                          }}
                        >
                          Sample Text
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAcceptSuggestion(index)}
                      >
                        Accept Suggestion
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ContrastAnalysis; 