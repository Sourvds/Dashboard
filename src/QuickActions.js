// src/components/QuickActions.js
import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Box,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Refresh,
  Download,
  Upload,
  Settings,
  Notifications
} from '@mui/icons-material';

const QuickActions = () => {
  const actions = [
    { icon: <Add />, label: 'Add New', color: '#1976d2' },
    { icon: <Refresh />, label: 'Refresh', color: '#2e7d32' },
    { icon: <Download />, label: 'Export', color: '#ed6c02' },
    { icon: <Upload />, label: 'Import', color: '#9c27b0' },
    { icon: <Settings />, label: 'Settings', color: '#1976d2' },
    { icon: <Notifications />, label: 'Alerts', color: '#d32f2f' }
  ];

  return (
    <Paper sx={{ p: 3, flex: 1, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={4} key={index}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <IconButton sx={{ color: action.color, mb: 1 }}>
                  {action.icon}
                </IconButton>
                <Typography variant="body2" sx={{ color: action.color }}>
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;