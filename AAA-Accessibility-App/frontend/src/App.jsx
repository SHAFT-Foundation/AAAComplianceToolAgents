import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAccessibility } from './context/AccessibilityContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import RemediationPage from './pages/RemediationPage';
import ReportPage from './pages/ReportPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const { currentStep } = useAccessibility();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route 
            path="/upload" 
            element={<UploadPage />} 
          />
          
          <Route 
            path="/analysis" 
            element={
              currentStep === 'upload' 
                ? <Navigate to="/upload" replace /> 
                : <AnalysisPage />
            } 
          />
          
          <Route 
            path="/remediation" 
            element={
              currentStep === 'upload' || currentStep === 'analysis'
                ? <Navigate to={currentStep === 'upload' ? "/upload" : "/analysis"} replace /> 
                : <RemediationPage />
            } 
          />
          
          <Route 
            path="/report" 
            element={
              currentStep !== 'report'
                ? <Navigate to={`/${currentStep}`} replace /> 
                : <ReportPage />
            } 
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default App; 