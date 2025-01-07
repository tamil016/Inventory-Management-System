const Product = require('../models/Product');
const Category = require('../models/Category');

const dashboardCards = async(req, res)=>{
    try {
        const products = await Product.find();
        const totalProducts = products.length;
        const totalCategories = await Category.countDocuments();
        const lowStockProducts = products.filter(product => product.quantity < 10).length;

        const stockStatus = {
            lowStock: lowStockProducts,
            inStock: totalProducts - lowStockProducts,
        };

        res.json({
            totalProducts,
            totalCategories,
            stockStatus,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {dashboardCards}