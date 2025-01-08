import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDialogOpen = (category = { id: '', name: '', description: '' }) => {
    setCurrentCategory(category);
    setIsEditMode(!!category.id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentCategory({ id: '', name: '', description: '' });
  };

  const handleSaveCategory = async () => {
    if(!currentCategory.name && !currentCategory.description){
      toast.error('All fields are required')
      return
    }
    if(!currentCategory.name){
      toast.error('Name is required')
      return
    }
    if(!currentCategory.description){
      toast.error('Description is required')
      return
    }
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `http://localhost:5000/api/categories/${currentCategory.id}` : 'http://localhost:5000/api/categories';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentCategory)
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(isEditMode ? `Category updated successfully!` : `Category added successfully!`);
        fetchCategories();
        handleDialogClose();
      } else {
        toast.error(data.message || 'All fields are ');
      }
    } catch (error) {
      toast.error('Error saving category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated products will also be deleted.')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Category with associate products deleted successfully!');
      } else {
        toast.error(data.error || 'Error deleting category.');
      }
      fetchCategories();
    } catch (error) {
      toast.error('Error deleting category.');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>Categories</Typography>
      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}><Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        sx={{ mb: 3, display: 'block' }}
      >
        Add Category
      </Button></Box>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat._id} hover>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDialogOpen({ id: cat._id, name: cat.name, description: cat.description })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteCategory(cat._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" value={currentCategory.name} onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} fullWidth variant="outlined" />
          <TextField margin="dense" label="Description" value={currentCategory.description} onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })} fullWidth multiline rows={3} variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSaveCategory} color="primary" variant="contained">{isEditMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />
    </Box>
  );
};

export default Categories;