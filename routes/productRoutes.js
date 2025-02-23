const express = require('express');
const {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
} = require('../controllers/productController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', protect, getProduct)
router.post('/', protect, upload.single('image'), addProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/low-stock', protect, getLowStockProducts);

module.exports = router;
