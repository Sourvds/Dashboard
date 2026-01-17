// src/components/Header.js
import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, NavigateNext } from '@mui/icons-material';

const Header = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
        <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>
    </Box>
  );
};

export default Header;