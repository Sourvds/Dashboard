import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Download,
  FilterList,
  CalendarToday,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { month: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { month: 'Mar', revenue: 2000, profit: 980, expenses: 1020 },
  { month: 'Apr', revenue: 2780, profit: 1908, expenses: 872 },
  { month: 'May', revenue: 1890, profit: 1200, expenses: 690 },
  { month: 'Jun', revenue: 2390, profit: 1800, expenses: 590 },
  { month: 'Jul', revenue: 3490, profit: 2500, expenses: 990 },
];

const trafficData = [
  { source: 'Direct', visitors: 4000, conversion: 12.4 },
  { source: 'Social', visitors: 3000, conversion: 8.2 },
  { source: 'Organic', visitors: 2000, conversion: 5.8 },
  { source: 'Email', visitors: 2780, conversion: 15.3 },
  { source: 'Referral', visitors: 1890, conversion: 9.7 },
];

const conversionData = [
  { day: 'Mon', conversion: 12.4 },
  { day: 'Tue', conversion: 8.2 },
  { day: 'Wed', conversion: 15.3 },
  { day: 'Thu', conversion: 9.7 },
  { day: 'Fri', conversion: 18.2 },
  { day: 'Sat', conversion: 22.1 },
  { day: 'Sun', conversion: 16.8 },
];

const topProducts = [
  { name: 'Product A', sales: 1242, growth: 12.4 },
  { name: 'Product B', sales: 856, growth: 8.2 },
  { name: 'Product C', sales: 742, growth: -2.1 },
  { name: 'Product D', sales: 623, growth: 15.7 },
  { name: 'Product E', sales: 512, growth: 5.3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, change, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography color="textSecondary" variant="overline" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Chip
              icon={change >= 0 ? <ArrowUpward /> : <ArrowDownward />}
              label={`${change >= 0 ? '+' : ''}${change}%`}
              size="small"
              color={change >= 0 ? 'success' : 'error'}
              variant="outlined"
            />
            <Typography variant="body2" sx={{ ml: 1, color: change >= 0 ? 'success.main' : 'error.main' }}>
              from last month
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, color: color }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [metric, setMetric] = useState('revenue');

  const kpiData = [
    {
      title: 'TOTAL REVENUE',
      value: '$24,852',
      change: 12.4,
      icon: <AttachMoney />,
      color: '#1976d2',
      subtitle: 'This month'
    },
    {
      title: 'CONVERSION RATE',
      value: '18.2%',
      change: 8.2,
      icon: <TrendingUp />,
      color: '#2e7d32',
      subtitle: 'Overall'
    },
    {
      title: 'ACTIVE USERS',
      value: '12,361',
      change: 15.7,
      icon: <People />,
      color: '#ed6c02',
      subtitle: 'Currently online'
    },
    {
      title: 'TOTAL ORDERS',
      value: '8,452',
      change: -2.1,
      icon: <ShoppingCart />,
      color: '#9c27b0',
      subtitle: 'This month'
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track and analyze your business performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                startAdornment={<CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Metric</InputLabel>
              <Select
                value={metric}
                label="Metric"
                onChange={(e) => setMetric(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="revenue">Revenue</MenuItem>
                <MenuItem value="conversion">Conversion</MenuItem>
                <MenuItem value="users">Users</MenuItem>
                <MenuItem value="orders">Orders</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<Download />}>
              Export Report
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Revenue & Profit Trend</Typography>
              <Chip label="Last 7 months" variant="outlined" />
            </Box>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#2e7d32" fill="#2e7d32" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Traffic Sources */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Traffic Sources
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Conversion Rate */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Conversion Rate Trend
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversion" stroke="#9c27b0" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Traffic by Source */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Traffic by Source
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors" fill="#1976d2" />
                <Bar dataKey="conversion" fill="#ed6c02" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Top Products */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Products
            </Typography>
            <List>
              {topProducts.map((product, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.sales} units sold`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        icon={product.growth >= 0 ? <TrendingUp /> : <TrendingDown />}
                        label={`${product.growth >= 0 ? '+' : ''}${product.growth}%`}
                        size="small"
                        color={product.growth >= 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Website Load Time</Typography>
                <Typography variant="body2">1.2s</Typography>
              </Box>
              <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Server Uptime</Typography>
                <Typography variant="body2">99.9%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={99} color="success" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">API Response Time</Typography>
                <Typography variant="body2">180ms</Typography>
              </Box>
              <LinearProgress variant="determinate" value={92} color="warning" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Error Rate</Typography>
                <Typography variant="body2">0.2%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={98} color="error" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;