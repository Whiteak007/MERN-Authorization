// src/Models/Products.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product title is required"],
        trim: true,
        maxlength: [100, "Product title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Product price cannot be negative"]
    },
    imageUrl: {
        type: String,
        required: [true, "Product image is required"]
    }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;