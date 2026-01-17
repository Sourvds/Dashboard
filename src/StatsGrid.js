// src/components/StatsGrid.js
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, change, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      background: `linear-gradient(45deg, ${color}30, ${color}10)`,
      borderLeft: `4px solid ${color}`,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography color="textSecondary" gutterBottom variant="overline">
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: change >= 0 ? 'success.main' : 'error.main' }}>
          {change >= 0 ? '+' : ''}{change}% from last month
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}20`,
          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
);

const StatsGrid = () => {
  const stats = [
    {
      title: 'TOTAL USERS',
      value: '12,361',
      change: 12.4,
      icon: <PeopleIcon sx={{ color: '#1976d2' }} />,
      color: '#1976d2'
    },
    {
      title: 'TOTAL ORDERS',
      value: '8,452',
      change: 8.2,
      icon: <ShoppingCartIcon sx={{ color: '#2e7d32' }} />,
      color: '#2e7d32'
    },
    {
      title: 'TOTAL REVENUE',
      value: '$24,852',
      change: -2.1,
      icon: <MoneyIcon sx={{ color: '#ed6c02' }} />,
      color: '#ed6c02'
    },
    {
      title: 'GROWTH RATE',
      value: '24.3%',
      change: 15.7,
      icon: <TrendingUpIcon sx={{ color: '#9c27b0' }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;