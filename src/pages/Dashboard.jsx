import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowstock] = useState([])
  const navigate = useNavigate()

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

  const fetchLowStockProduct = async()=>{
    try {
      const response = await fetch('http://localhost:5000/api/products/low-stock',{
        method :'GET',
        headers :{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json()
      setLowstock(data)
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
    fetchLowStockProduct();
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

  const lowStockHandler = ()=>{
    navigate('/products')
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
          textAlign: 'center',
          border: '1px solid #ccc',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Products</Typography>
          <Typography variant="h4">{summary.totalProducts}</Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: 250,
          maxWidth: '100%',
          textAlign: 'center',
          border: '1px solid #ccc',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Categories</Typography>
          <Typography variant="h4">{summary.totalCategories}</Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: 250,
          maxWidth: '100%',
          textAlign: 'center',
          border: '1px solid #ccc',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Stock Status</Typography>
          <Typography>
            <Typography variant="h5" onClick = {()=> lowStockHandler()}
                sx={{cursor:'pointer'}}
              >Low: {lowStock.length}</Typography>
            <Typography variant="h5">In Stock: {summary.stockStatus.inStock}</Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
