import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Table, TableBody, TableCell, FormControl,
  TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, Pagination,
  useMediaQuery
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
  const [sortConfig, setSortConfig] = useState({ field: '', order: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLowStock, setShowLowStock] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchProducts = async (resetPage = false) => {
    try {
      if (resetPage) setCurrentPage(1);
      const query = new URLSearchParams({
        name: searchQuery,
        category: selectedCategory,
        sortBy: JSON.stringify(sortConfig),
        page: resetPage ? 1 : currentPage,
        onlyLowStock: showLowStock,
      }).toString();

      const response = await fetch(`http://localhost:5000/api/search?${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log(data);

      setProducts(data.products);
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error('Error fetching products.');
    }
  };

  const handleFilterChange = () => {
    fetchProducts(true)
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
  }, [searchQuery, selectedCategory, sortConfig, currentPage, showLowStock]);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId._id);
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
        toast.error('All fields are required');
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

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const toggleLowStock = () => {
    setShowLowStock(!showLowStock);
    setCurrentPage(1)
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant={isMobile ? 'h5' : 'h3'} sx={{ textAlign: 'center', mb: 3 }}>Products</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
        <Select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleFilterChange();
          }}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Search Product"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleFilterChange();
          }}
          fullWidth
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap:'20px' }}>
        <Button variant="contained" color="primary" onClick={toggleLowStock}>{showLowStock ? 'View All Products' : 'View Low Stock'}</Button>
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>Add Product</Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                Category
              </TableCell>
              <TableCell onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                Quantity {sortConfig.field === 'quantity' && (sortConfig.order === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price {sortConfig.field === 'price' && (sortConfig.order === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.image && <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{getCategoryNameById(product.category)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDialogOpen({ id: product._id, name: product.name, category: product.category._id, quantity: product.quantity, price: product.price, description: product.description, image: null })}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
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
            {currentProduct.image ? 'Image Uploaded' : 'Upload Image'}
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
