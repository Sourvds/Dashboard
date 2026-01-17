// src/components/RecentActivities.js
import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import {
  PersonAdd,
  Payment,
  ShoppingCart,
  TrendingUp
} from '@mui/icons-material';

const activities = [
  {
    icon: <PersonAdd />,
    primary: 'New user registered',
    secondary: '5 minutes ago',
    color: '#1976d2'
  },
  {
    icon: <Payment />,
    primary: 'New order #1234',
    secondary: '1 hour ago',
    color: '#2e7d32'
  },
  {
    icon: <ShoppingCart />,
    primary: 'Order #1235 was delivered',
    secondary: '2 hours ago',
    color: '#ed6c02'
  },
  {
    icon: <TrendingUp />,
    primary: 'Sales report generated',
    secondary: '3 hours ago',
    color: '#9c27b0'
  },
  {
    icon: <PersonAdd />,
    primary: 'New customer onboarded',
    secondary: '5 hours ago',
    color: '#1976d2'
  }
];

const RecentActivities = () => {
  return (
    <Paper sx={{ p: 3, flex: 1, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activities
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: activity.color, width: 32, height: 32 }}>
                {activity.icon}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={activity.primary}
              secondary={activity.secondary}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Chip label="View All Activities" variant="outlined" clickable />
      </Box>
    </Paper>
  );
};

export default RecentActivities;