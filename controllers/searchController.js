const Product = require('../models/Product');

const searchProduct = async (req, res) => {
    try {
        const { name, category, sortBy, page=1, onlyLowStock } = req.query;

        let filter = {};
        if (name) filter.name = new RegExp(name, 'i');
        if (category) filter.category = category;
        if (onlyLowStock === 'true') filter.quantity = { $lt: 10 };

        let sortCriteria = {};
        if (sortBy) {
            const parsedSortBy = JSON.parse(sortBy);
            const sortByField = parsedSortBy.field || "name";
            const sortByOrder = parsedSortBy.order === "desc" ? -1 : 1;
            sortCriteria[sortByField] = sortByOrder;
        } else {
            sortCriteria.name = 1;
        }

        const limit = 6;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        
        const products = await Product.find(filter).skip(skip).limit(limit).populate('category').sort(sortCriteria);
        res.json({products, totalPages, currentPage: Number(page)});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { searchProduct };
