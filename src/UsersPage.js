import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Badge,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Visibility,
  FilterList,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  MoreVert,
  Block,
  CheckCircle,
  Warning,
  PersonAdd,
  Refresh,
  Download,
  Security,
  AdminPanelSettings,
  PersonOff
} from '@mui/icons-material';

// Sample users data
const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/static/images/avatar/1.jpg',
    status: 'active',
    role: 'admin',
    location: 'New York, USA',
    joinDate: '2023-03-15',
    lastActive: '2 hours ago',
    orders: 42,
    spent: '$2,450.00'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    avatar: '/static/images/avatar/2.jpg',
    status: 'active',
    role: 'customer',
    location: 'Los Angeles, USA',
    joinDate: '2023-05-20',
    lastActive: '5 minutes ago',
    orders: 18,
    spent: '$890.50'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 (555) 456-7890',
    avatar: '/static/images/avatar/3.jpg',
    status: 'inactive',
    role: 'customer',
    location: 'Chicago, USA',
    joinDate: '2023-01-10',
    lastActive: '2 weeks ago',
    orders: 7,
    spent: '$345.75'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1 (555) 234-5678',
    avatar: '/static/images/avatar/4.jpg',
    status: 'active',
    role: 'moderator',
    location: 'Miami, USA',
    joinDate: '2023-06-05',
    lastActive: '1 hour ago',
    orders: 29,
    spent: '$1,567.30'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    phone: '+1 (555) 876-5432',
    avatar: '/static/images/avatar/5.jpg',
    status: 'suspended',
    role: 'customer',
    location: 'Seattle, USA',
    joinDate: '2023-02-28',
    lastActive: '1 month ago',
    orders: 3,
    spent: '$120.00'
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    phone: '+1 (555) 345-6789',
    avatar: '/static/images/avatar/6.jpg',
    status: 'active',
    role: 'customer',
    location: 'Boston, USA',
    joinDate: '2023-04-12',
    lastActive: '30 minutes ago',
    orders: 56,
    spent: '$3,210.45'
  },
  {
    id: 7,
    name: 'Edward Davis',
    email: 'edward.davis@example.com',
    phone: '+1 (555) 765-4321',
    avatar: '/static/images/avatar/7.jpg',
    status: 'active',
    role: 'vendor',
    location: 'Austin, USA',
    joinDate: '2023-07-18',
    lastActive: '3 hours ago',
    orders: 0,
    spent: '$0.00'
  },
  {
    id: 8,
    name: 'Fiona Miller',
    email: 'fiona.miller@example.com',
    phone: '+1 (555) 654-3210',
    avatar: '/static/images/avatar/8.jpg',
    status: 'inactive',
    role: 'customer',
    location: 'Denver, USA',
    joinDate: '2023-08-22',
    lastActive: '1 week ago',
    orders: 12,
    spent: '$678.90'
  }
];

const statusColors = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
  pending: 'warning'
};

const roleColors = {
  admin: 'error',
  moderator: 'warning',
  vendor: 'info',
  customer: 'success'
};

const roleIcons = {
  admin: <AdminPanelSettings />,
  moderator: <Security />,
  vendor: <Person />,
  customer: <Person />
};

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(usersData);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleOpenNewUser = () => {
    setOpenNewUserDialog(true);
  };

  const handleCloseNewUser = () => {
    setOpenNewUserDialog(false);
  };

  const handleActionMenuOpen = (event, userId) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    handleActionMenuClose();
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    handleActionMenuClose();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your users and their permissions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Refresh />}>
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<Download />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenNewUser}>
              Add User
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="textSecondary">
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Inactive
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {stats.suspended}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Suspended
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.admins}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {stats.customers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
                <MenuItem value="vendor">Vendor</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">
              {filteredUsers.length} users found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Spent</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{user.email}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={statusColors[user.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={roleIcons[user.role]}
                      label={user.role}
                      color={roleColors[user.role]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.location}</Typography>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.lastActive}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {user.orders}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {user.spent}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewUser(user)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={(e) => handleActionMenuOpen(e, user.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* User Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={selectedUser.avatar}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  >
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Chip
                    label={selectedUser.role}
                    color={roleColors[selectedUser.role]}
                    sx={{ mb: 1 }}
                  />
                  <Chip
                    label={selectedUser.status}
                    color={statusColors[selectedUser.status]}
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography variant="body2">{selectedUser.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Phone</Typography>
                    <Typography variant="body2">{selectedUser.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body2">{selectedUser.location}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Join Date</Typography>
                    <Typography variant="body2">{selectedUser.joinDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Last Active</Typography>
                    <Typography variant="body2">{selectedUser.lastActive}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Total Orders</Typography>
                    <Typography variant="body2">{selectedUser.orders}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Total Spent</Typography>
                    <Typography variant="h6" color="primary">
                      {selectedUser.spent}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained">Edit Profile</Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange(selectedUserId, 'active')}>
          <ListItemIcon>
            <CheckCircle color="success" />
          </ListItemIcon>
          <ListItemText>Activate User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(selectedUserId, 'inactive')}>
          <ListItemIcon>
            <PersonOff color="disabled" />
          </ListItemIcon>
          <ListItemText>Deactivate User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(selectedUserId, 'suspended')}>
          <ListItemIcon>
            <Block color="error" />
          </ListItemIcon>
          <ListItemText>Suspend User</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteUser(selectedUserId)}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>

      {/* New User Dialog (Placeholder) */}
      <Dialog open={openNewUserDialog} onClose={handleCloseNewUser} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            User creation form would go here with fields for name, email, role, etc.
          </Typography>
          <LinearProgress />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewUser}>Cancel</Button>
          <Button variant="contained" disabled>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;