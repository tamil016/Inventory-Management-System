const Category = require('../models/Category');
const Product = require('../models/Product')

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({
            message: "Category added successfully!",
            category
        });
    } catch (error) {
        res.status(500).json({ 
            message: "An error occurred while adding the category.",
            error: error.message 
        });
    }
};


const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({
            message: "Category updated successfully!",
            category
        });
    } catch (error) {
        res.status(500).json({ 
            message: "An error occurred while updating the category.",
            error: error.message 
        });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        await Product.deleteMany({category: id})
        await category.deleteOne()
        res.json({ message: 'Category deleted with associate product successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCategories ,addCategory, updateCategory, deleteCategory };
