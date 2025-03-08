import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Divider />
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AAA Accessibility Tool
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Helping you achieve WCAG 2.1 AAA compliance for all digital content.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link
              component="a"
              href="https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ display: 'block', mb: 1 }}
              underline="hover"
            >
              WCAG 2.1 AAA Guidelines
            </Link>
            <Link
              component="a"
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ display: 'block', mb: 1 }}
              underline="hover"
            >
              W3C Accessibility Initiative
            </Link>
            <Link
              component={RouterLink}
              to="/"
              color="primary"
              sx={{ display: 'block' }}
              underline="hover"
            >
              Help & Documentation
            </Link>
          </Box>
          
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Accessibility Statement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This application is designed to meet WCAG 2.1 AAA standards.
              If you encounter any accessibility issues, please contact us.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} AAA Accessibility Tool. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            |
            <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 