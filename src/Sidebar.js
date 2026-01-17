import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle, menuItems, isMobile }) => {
  const drawer = (
    <div>
      <Box sx={{ p: 0, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ 
    fontWeight: 'bold',
    backgroundColor: 'primary.main', 
    color: 'white', 
    padding: 2, 
    borderRadius: 0,
    height:65,
    top:0,
    left:0
  }}>
          Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              backgroundColor: item.active ? 'primary.main' : 'transparent',
              color: item.active ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: item.active ? 'primary.dark' : 'action.hover',
              },
              mb: 1,
              mx: 1,
              borderRadius: 1,
              textDecoration: 'none',
            }}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <ListItemIcon sx={{ color: item.active ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;