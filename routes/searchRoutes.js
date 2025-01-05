const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { searchProduct } = require('../controllers/searchController');
const router = express.Router();
            
router.get('/', protect, searchProduct)

module.exports = router