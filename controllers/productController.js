const Product = require('../models/Product');

const addProduct = async (req, res) => {
    try {
        const { name, category, quantity, price, description } = req.body;
        const image = req.file ? req.file.filename : null;

        const product = new Product({ name, category, quantity, price, description, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, quantity, price, description } = req.body;
        const image = req.file ? req.file.filename : null;

        const updatedFields = { name, category, quantity, price, description };
        if (image) updatedFields.image = image;

        const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $lt: 10 } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, updateProduct, deleteProduct, getLowStockProducts };
