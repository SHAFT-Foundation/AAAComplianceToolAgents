import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AccessibilityContext = createContext();

// Custom hook to use the accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Provider component
export const AccessibilityProvider = ({ children }) => {
  // State for uploaded content
  const [uploadedContent, setUploadedContent] = useState({
    text: null,
    images: [],
    audio: null,
    video: null,
  });

  // State for analysis results
  const [analysisResults, setAnalysisResults] = useState({
    contrast: null,
    altText: [],
    transcripts: null,
    signLanguage: null,
    audioDescriptions: null,
    textSimplification: null,
    timeLimits: null,
    interruptions: null,
    ariaValidation: null,
    overallCompliance: null,
  });

  // State for user modifications to AI suggestions
  const [userModifications, setUserModifications] = useState({
    contrast: {},
    altText: {},
    transcripts: {},
    signLanguage: {},
    audioDescriptions: {},
    textSimplification: {},
  });

  // State for loading indicators
  const [loading, setLoading] = useState({
    upload: false,
    analysis: false,
    remediation: false,
  });

  // State for error messages
  const [errors, setErrors] = useState({
    upload: null,
    analysis: null,
    remediation: null,
  });

  // State for current step in the workflow
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analysis, remediation, report

  // Function to handle content upload
  const handleContentUpload = (type, content) => {
    console.log(`[AccessibilityContext] Uploading ${type} content:`, content);
    setLoading(prev => ({ ...prev, upload: true }));
    
    try {
      setUploadedContent(prev => ({
        ...prev,
        [type]: type === 'images' ? [...prev.images, ...content] : content,
      }));
      
      setErrors(prev => ({ ...prev, upload: null }));
    } catch (error) {
      console.error(`[AccessibilityContext] Error uploading ${type} content:`, error);
      setErrors(prev => ({ ...prev, upload: `Failed to upload ${type}: ${error.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  // Function to clear uploaded content
  const clearUploadedContent = (type = null) => {
    console.log(`[AccessibilityContext] Clearing ${type || 'all'} uploaded content`);
    if (type) {
      setUploadedContent(prev => ({
        ...prev,
        [type]: type === 'images' ? [] : null,
      }));
    } else {
      setUploadedContent({
        text: null,
        images: [],
        audio: null,
        video: null,
      });
    }
  };

  // Function to start content analysis
  const analyzeContent = async () => {
    console.log('[AccessibilityContext] Starting content analysis');
    setLoading(prev => ({ ...prev, analysis: true }));
    setErrors(prev => ({ ...prev, analysis: null }));
    
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a delay and set mock results
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockResults = {
        contrast: {
          issues: [
            { element: 'header', foreground: '#336699', background: '#FFFFFF', ratio: 4.5, required: 7, suggestion: '#0056b3' },
            { element: 'button', foreground: '#66CC66', background: '#FFFFFF', ratio: 3.2, required: 4.5, suggestion: '#006400' },
          ],
        },
        altText: [
          { imageId: 1, currentAlt: '', suggestedAlt: 'A person using a computer with accessibility features enabled' },
          { imageId: 2, currentAlt: 'logo', suggestedAlt: 'Company logo showing a blue shield with accessibility symbol' },
        ],
        // Other mock results would be added here
      };
      
      setAnalysisResults(mockResults);
      setCurrentStep('analysis');
    } catch (error) {
      console.error('[AccessibilityContext] Error analyzing content:', error);
      setErrors(prev => ({ ...prev, analysis: `Analysis failed: ${error.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  // Function to update user modifications
  const updateUserModification = (category, id, value) => {
    console.log(`[AccessibilityContext] Updating ${category} modification for ID ${id}:`, value);
    setUserModifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: value,
      },
    }));
  };

  // Function to apply all accepted modifications
  const applyModifications = async () => {
    console.log('[AccessibilityContext] Applying all accepted modifications');
    setLoading(prev => ({ ...prev, remediation: true }));
    
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to the report step
      setCurrentStep('report');
      setErrors(prev => ({ ...prev, remediation: null }));
    } catch (error) {
      console.error('[AccessibilityContext] Error applying modifications:', error);
      setErrors(prev => ({ ...prev, remediation: `Failed to apply modifications: ${error.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, remediation: false }));
    }
  };

  // Function to reset the entire process
  const resetProcess = () => {
    console.log('[AccessibilityContext] Resetting the entire process');
    setUploadedContent({
      text: null,
      images: [],
      audio: null,
      video: null,
    });
    setAnalysisResults({
      contrast: null,
      altText: [],
      transcripts: null,
      signLanguage: null,
      audioDescriptions: null,
      textSimplification: null,
      timeLimits: null,
      interruptions: null,
      ariaValidation: null,
      overallCompliance: null,
    });
    setUserModifications({
      contrast: {},
      altText: {},
      transcripts: {},
      signLanguage: {},
      audioDescriptions: {},
      textSimplification: {},
    });
    setErrors({
      upload: null,
      analysis: null,
      remediation: null,
    });
    setCurrentStep('upload');
  };

  // Value object to be provided by the context
  const value = {
    uploadedContent,
    analysisResults,
    userModifications,
    loading,
    errors,
    currentStep,
    handleContentUpload,
    clearUploadedContent,
    analyzeContent,
    updateUserModification,
    applyModifications,
    resetProcess,
    setCurrentStep,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 