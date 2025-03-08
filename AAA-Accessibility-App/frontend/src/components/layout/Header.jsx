import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  Build as RemediationIcon,
  Assessment as ReportIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../../context/AccessibilityContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { currentStep } = useAccessibility();

  const navigationItems = [
    { text: 'Home', path: '/', icon: <HomeIcon />, enabled: true },
    { text: 'Upload', path: '/upload', icon: <UploadIcon />, enabled: true },
    { text: 'Analysis', path: '/analysis', icon: <AnalyticsIcon />, enabled: currentStep !== 'upload' },
    { text: 'Remediation', path: '/remediation', icon: <RemediationIcon />, enabled: currentStep !== 'upload' && currentStep !== 'analysis' },
    { text: 'Report', path: '/report', icon: <ReportIcon />, enabled: currentStep === 'report' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path) => location.pathname === path;

  const renderNavItems = () => {
    return navigationItems.map((item) => {
      const NavButton = (
        <Button
          component={RouterLink}
          to={item.enabled ? item.path : '#'}
          color={isActive(item.path) ? 'secondary' : 'inherit'}
          sx={{
            mx: 1,
            fontWeight: isActive(item.path) ? 'bold' : 'normal',
            opacity: item.enabled ? 1 : 0.5,
            pointerEvents: item.enabled ? 'auto' : 'none',
            '&:focus': {
              outline: '2px solid white',
              outlineOffset: '2px',
            },
          }}
          startIcon={item.icon}
          key={item.text}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          {item.text}
        </Button>
      );

      return item.enabled ? (
        NavButton
      ) : (
        <Tooltip title={`Complete previous steps first`} key={item.text}>
          <span>{NavButton}</span>
        </Tooltip>
      );
    });
  };

  const renderDrawerItems = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            component={RouterLink}
            to={item.enabled ? item.path : '#'}
            key={item.text}
            disabled={!item.enabled}
            selected={isActive(item.path)}
            sx={{
              opacity: item.enabled ? 1 : 0.5,
              bgcolor: isActive(item.path) ? 'rgba(0, 100, 0, 0.1)' : 'transparent',
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccessibilityIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              '&:focus': {
                outline: '2px solid white',
                outlineOffset: '2px',
              },
            }}
          >
            AAA Accessibility Tool
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                AAA Tool
              </Typography>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {renderDrawerItems()}
              </Drawer>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              {renderNavItems()}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 