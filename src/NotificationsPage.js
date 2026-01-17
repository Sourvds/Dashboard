import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Error,
  Warning,
  Info,
  ShoppingCart,
  Person,
  Payment,
  LocalShipping,
  MarkEmailRead,
  Delete,
  Settings,
  FilterList,
  Search,
  MoreVert,
  NotificationsActive,
  NotificationsOff
} from '@mui/icons-material';

// Sample notifications data
const allNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-1234 has been placed by John Doe',
    timestamp: '2 minutes ago',
    read: false,
    priority: 'high',
    icon: <ShoppingCart />,
    color: '#1976d2'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of $249.99 for order #ORD-1234 was processed',
    timestamp: '15 minutes ago',
    read: false,
    priority: 'medium',
    icon: <Payment />,
    color: '#2e7d32'
  },
  {
    id: 3,
    type: 'system',
    title: 'System Update',
    message: 'Scheduled maintenance tonight at 2:00 AM EST',
    timestamp: '1 hour ago',
    read: true,
    priority: 'medium',
    icon: <Info />,
    color: '#ed6c02'
  },
  {
    id: 4,
    type: 'user',
    title: 'New User Registration',
    message: 'Jane Smith has created a new account',
    timestamp: '2 hours ago',
    read: true,
    priority: 'low',
    icon: <Person />,
    color: '#9c27b0'
  },
  {
    id: 5,
    type: 'shipping',
    title: 'Order Shipped',
    message: 'Order #ORD-1234 has been shipped to customer',
    timestamp: '3 hours ago',
    read: true,
    priority: 'medium',
    icon: <LocalShipping />,
    color: '#1976d2'
  },
  {
    id: 6,
    type: 'alert',
    title: 'Low Inventory Alert',
    message: 'Product "Widget X" is running low on stock',
    timestamp: '5 hours ago',
    read: true,
    priority: 'high',
    icon: <Warning />,
    color: '#d32f2f'
  },
  {
    id: 7,
    type: 'email',
    title: 'Newsletter Sent',
    message: 'Monthly newsletter was delivered to 12,451 subscribers',
    timestamp: '1 day ago',
    read: true,
    priority: 'low',
    icon: <MarkEmailRead />,
    color: '#0288d1'
  },
  {
    id: 8,
    type: 'system',
    title: 'Backup Completed',
    message: 'Nightly database backup was successful',
    timestamp: '2 days ago',
    read: true,
    priority: 'low',
    icon: <CheckCircle />,
    color: '#2e7d32'
  }
];

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'info'
};

const typeIcons = {
  order: <ShoppingCart />,
  payment: <Payment />,
  system: <Info />,
  user: <Person />,
  shipping: <LocalShipping />,
  alert: <Warning />,
  email: <MarkEmailRead />
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sound: false,
    desktop: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSettingsOpen = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleSettingToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = tabValue === 0 || 
                      (tabValue === 1 && !notification.read) || 
                      (tabValue === 2 && notification.read);
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || notification.type === filter;

    return matchesTab && matchesSearch && matchesFilter;
  });

  const notificationTypes = [...new Set(notifications.map(n => n.type))];

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your alerts and notifications
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Badge badgeContent={unreadCount} color="error">
              <IconButton color="primary" onClick={handleSettingsOpen}>
                <Settings />
              </IconButton>
            </Badge>
            <Button 
              variant="outlined" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Type"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {notificationTypes.map(type => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {typeIcons[type]}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {filteredNotifications.length} notifications
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="All Notifications" />
          <Tab label={
            <Badge badgeContent={unreadCount} color="error">
              Unread
            </Badge>
          } />
          <Tab label="Read" />
        </Tabs>
      </Paper>

      {/* Notifications List */}
      <Paper>
        <TabPanel value={tabValue} index={0}>
          <NotificationsList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <NotificationsList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <NotificationsList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
          />
        </TabPanel>
      </Paper>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 3 }}>
          <NotificationsOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No notifications found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            {searchTerm || filter !== 'all' ? 
              'Try adjusting your search or filter criteria' : 
              'You\'re all caught up! New notifications will appear here.'
            }
          </Typography>
          {(searchTerm || filter !== 'all') && (
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      )}

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        PaperProps={{ sx: { width: 300 } }}
      >
        <MenuItem>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notification Settings
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <NotificationsActive />
          </ListItemIcon>
          <ListItemText primary="Email Notifications" />
          <Switch
            checked={notificationSettings.email}
            onChange={() => handleSettingToggle('email')}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <NotificationsActive />
          </ListItemIcon>
          <ListItemText primary="Push Notifications" />
          <Switch
            checked={notificationSettings.push}
            onChange={() => handleSettingToggle('push')}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <NotificationsActive />
          </ListItemIcon>
          <ListItemText primary="Sound Alerts" />
          <Switch
            checked={notificationSettings.sound}
            onChange={() => handleSettingToggle('sound')}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <NotificationsActive />
          </ListItemIcon>
          <ListItemText primary="Desktop Notifications" />
          <Switch
            checked={notificationSettings.desktop}
            onChange={() => handleSettingToggle('desktop')}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

const NotificationsList = ({ notifications, onMarkAsRead, onDelete }) => (
  <List>
    {notifications.map((notification, index) => (
      <React.Fragment key={notification.id}>
        <ListItem
          sx={{
            backgroundColor: notification.read ? 'transparent' : 'action.hover',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
            py: 2
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: notification.color }}>
              {notification.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle1" component="span">
                  {notification.title}
                </Typography>
                <Chip
                  label={notification.priority}
                  size="small"
                  color={priorityColors[notification.priority]}
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.timestamp}
                </Typography>
              </>
            }
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {!notification.read && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <CheckCircle />
              </IconButton>
            )}
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
            >
              <Delete />
            </IconButton>
          </Box>
        </ListItem>
        {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
      </React.Fragment>
    ))}
  </List>
);

export default NotificationsPage;