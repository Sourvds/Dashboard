import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {
  Dashboard as DashboardIcon,
  People,
  ShoppingCart,
  TrendingUp,
  Notifications,
  Settings
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Import components
import Sidebar from './Sidebar';
import Header from './Header';
import StatsGrid from './StatsGrid';
import Charts from './Charts';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import OrdersPage from './OrdersPage';
import AnalyticsPage from './AnalyticsPage';
import NotificationsPage from './NotificationsPage';
import UsersPage from './UsersPage';
const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function MainContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', active: location.pathname === '/' },
    { text: 'Users', icon: <People />, path: '/users', active: location.pathname === '/users' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/orders', active: location.pathname === '/orders' },
    { text: 'Analytics', icon: <TrendingUp />, path: '/analytics', active: location.pathname === '/analytics' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications', active: location.pathname === '/notifications' },
    { text: 'Settings', icon: <Settings />, path: '/settings', active: location.pathname === '/settings' },
  ];

  // const getPageTitle = () => {
  //   const currentItem = menuItems.find(item => item.path === location.pathname);
  //   return currentItem ? currentItem.text : 'Dashboard';
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        menuItems={menuItems}
        isMobile={isMobile}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {/*<Header title={getPageTitle()} />*/}
        
        <Routes>
          <Route path="/" element={
            <>
              <StatsGrid />
              <Charts />
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mt: 3 }}>
                <RecentActivities />
                <QuickActions />
              </Box>
            </>
          } />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage/>} />
          <Route path="/analytics" element={<AnalyticsPage/>} />
          <Route path="/notifications" element={<NotificationsPage/>} />
          <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;