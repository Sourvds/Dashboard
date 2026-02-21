import React, { useState } from 'react';
import {
  Box,
  Paper,
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
  Typography,
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Visibility,
  FilterList
} from '@mui/icons-material';

// Sample order data
const ordersData = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2024-01-15',
    status: 'completed',
    amount: '$120.00',
    payment: 'Credit Card',
    items: 3
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-01-14',
    status: 'processing',
    amount: '$89.50',
    payment: 'PayPal',
    items: 2
  },
  {
    id: '#ORD-003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    date: '2024-01-13',
    status: 'pending',
    amount: '$245.75',
    payment: 'Credit Card',
    items: 5
  },
  {
    id: '#ORD-004',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    date: '2024-01-12',
    status: 'completed',
    amount: '$67.30',
    payment: 'Stripe',
    items: 1
  },
  {
    id: '#ORD-005',
    customer: 'Charlie Wilson',
    email: 'charlie@example.com',
    date: '2024-01-11',
    status: 'cancelled',
    amount: '$156.90',
    payment: 'PayPal',
    items: 4
  }
];

const statusColors = {
  completed: 'success',
  processing: 'warning',
  pending: 'info',
  cancelled: 'error'
};

const steps = ['Customer Information', 'Order Details', 'Payment', 'Confirmation'];

const OrdersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [orders, setOrders] = useState(ordersData);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customer: '',
    email: '',
    items: '',
    amount: '',
    payment: 'Credit Card',
    status: 'pending'
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleOpenNewOrder = () => {
    setOpenNewOrderDialog(true);
    setActiveStep(0);
    setNewOrder({
      customer: '',
      email: '',
      items: '',
      amount: '',
      payment: 'Credit Card',
      status: 'pending'
    });
  };

  const handleCloseNewOrder = () => {
    setOpenNewOrderDialog(false);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setNewOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateOrder = () => {
    // Generate a new order ID
    const newOrderId = `#ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const orderToAdd = {
      ...newOrder,
      id: newOrderId,
      date: today,
      amount: `$${parseFloat(newOrder.amount).toFixed(2)}`,
      items: parseInt(newOrder.items)
    };

    // Add the new order
    setOrders(prev => [orderToAdd, ...prev]);
    
    // Show success message
    setSnackbar({
      open: true,
      message: `Order ${newOrderId} created successfully!`,
      severity: 'success'
    });

    // Close the dialog
    handleCloseNewOrder();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newOrder.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newOrder.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Items"
                type="number"
                value={newOrder.items}
                onChange={(e) => handleInputChange('items', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount"
                type="number"
                value={newOrder.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={newOrder.payment}
                  label="Payment Method"
                  onChange={(e) => handleInputChange('payment', e.target.value)}
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                  <MenuItem value="Stripe">Stripe</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={newOrder.status}
                  label="Order Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Customer:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{newOrder.customer}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Email:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{newOrder.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Items:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{newOrder.items}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Amount:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">${newOrder.amount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Payment:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{newOrder.payment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Status:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={newOrder.status}
                    color={statusColors[newOrder.status]}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      {/* Header Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" component="h2">
            Orders Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleOpenNewOrder}
          >
            New Order
          </Button>
        </Box>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search orders..."
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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {filteredOrders.length} orders found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{order.customer}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{order.amount}</Typography>
                  </TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
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
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Customer Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedOrder.customer}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedOrder.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Order Information</Typography>
                <Typography variant="body2"><strong>Date:</strong> {selectedOrder.date}</Typography>
                <Typography variant="body2"><strong>Status:</strong> 
                  <Chip
                    label={selectedOrder.status}
                    color={statusColors[selectedOrder.status]}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Payment Details</Typography>
                <Typography variant="body2"><strong>Amount:</strong> {selectedOrder.amount}</Typography>
                <Typography variant="body2"><strong>Method:</strong> {selectedOrder.payment}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Order Summary</Typography>
                <Typography variant="body2"><strong>Items:</strong> {selectedOrder.items}</Typography>
                <Typography variant="body2"><strong>Order ID:</strong> {selectedOrder.id}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Print Invoice
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog open={openNewOrderDialog} onClose={handleCloseNewOrder} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add />
            Create New Order
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseNewOrder}>Cancel</Button>
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleCreateOrder}>
              Create Order
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersPage;