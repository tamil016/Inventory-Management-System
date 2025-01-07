const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        minlength: [3, 'Product name must be at least 3 characters long'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image : {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
