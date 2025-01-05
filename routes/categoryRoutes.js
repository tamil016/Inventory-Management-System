const express = require('express');
const { getCategories ,addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getCategories)
router.post('/', protect, addCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;