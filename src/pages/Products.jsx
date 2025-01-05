import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Table, TableBody, TableCell, FormControl,
  TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: '', name: '', category: '', quantity: '', price: '', description: '', image: null
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Error fetching products.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleDialogOpen = (product = { id: '', name: '', category: '', quantity: '', price: '', description: '', image: null }) => {
    setCurrentProduct(product);
    setIsEditMode(!!product.id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentProduct({ id: '', name: '', category: '', quantity: '', price: '', description: '', image: null });
  };

  const handleSaveProduct = async () => {
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `http://localhost:5000/api/products/${currentProduct.id}` : `http://localhost:5000/api/products`;

    const formData = new FormData();
    formData.append('name', currentProduct.name);
    formData.append('category', currentProduct.category);
    formData.append('quantity', currentProduct.quantity);
    formData.append('price', currentProduct.price);
    formData.append('description', currentProduct.description);
    if (currentProduct.image) {
      formData.append('image', currentProduct.image);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
        fetchProducts();
        handleDialogClose();
      } else {
        toast.error('All fields are required.');
      }
    } catch (error) {
      toast.error('Error saving product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Product deleted successfully!');
        fetchProducts();
      } else {
        toast.error('Error deleting product.');
      }
    } catch (error) {
      toast.error('Error deleting product.');
    }
  };

  const handleSortByPrice = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedProducts = [...products].sort((a, b) => {
      return newSortOrder === 'asc'
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    });
    setProducts(sortedProducts);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory ? product.category === selectedCategory : true)
  );

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 3 }}>Products</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </Box>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>Add Product</Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                onClick={handleSortByPrice}
              >
                Price {sortOrder === 'asc' ? '↓' : '↑'}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.image && <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{getCategoryNameById(product.category)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>Rs {product.price}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDialogOpen({ id: product._id, name: product.name, category: product.category, quantity: product.quantity, price: product.price, description: product.description , image: null })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} fullWidth margin="dense" />
          <TextField label="Quantity" value={currentProduct.quantity} onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })} fullWidth margin="dense" />
          <TextField label="Price" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} fullWidth margin="dense" />
          <TextField label="Description" value={currentProduct.description} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} fullWidth margin="dense" multiline rows={3} />
          <FormControl fullWidth margin="dense">
            <Select
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.files[0] })}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSaveProduct} color="primary" variant="contained">{isEditMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
};

export default Products;
