import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/summary/dashboard-summary', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSummary(data);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetching dashboard:', error);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 5 }}>
        Unable to fetch dashboard data. Please try again later.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        padding: 2,
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
    >
      <Card
        sx={{
          width: 250,
          maxWidth: '100%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6">Total Products</Typography>
          <Typography variant="h4">{summary.totalProducts}</Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: 250,
          maxWidth: '100%',
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6">Total Categories</Typography>
          <Typography variant="h4">{summary.totalCategories}</Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: 250,
          maxWidth: '100%',
          bgcolor: 'success.main',
          color: 'success.contrastText',
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6">Stock Status</Typography>
          <Typography variant="h5">Low: {summary.stockStatus.lowStock}</Typography>
          <Typography variant="h5">In Stock: {summary.stockStatus.inStock}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
