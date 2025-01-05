const Product = require('../models/Product');

const searchProduct = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, minQuantity, maxQuantity } = req.query;

        let filter = {};

        if (name) filter.name = new RegExp(name, 'i');

        if (category) filter.category = category;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minQuantity || maxQuantity) {
            filter.quantity = {};
            if (minQuantity) filter.quantity.$gte = Number(minQuantity);
            if (maxQuantity) filter.quantity.$lte = Number(maxQuantity);
        }

        const products = await Product.find(filter).populate('category');

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { searchProduct }