// src/Controllers/ProductController.js
import ProductModel from "../Models/Products.js";
import { uploadToCloudinary } from "../Middlewares/Upload.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const file = req.file;

        if (!title || !description || !price || !file) {
            return res.status(400).json({ message: "All fields and an image are required", success: false });
        }

        const cloudinaryResult = await uploadToCloudinary(file);

        const newProduct = new ProductModel({
            title,
            description,
            price,
            imageUrl: cloudinaryResult.secure_url
        });
        await newProduct.save();

        res.status(201).json({ message: "Product created successfully", success: true, product: newProduct });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "An error occurred while creating the product", success: false });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get all products error:", error);
        res.status(500).json({ message: "An error occurred while fetching products", success: false });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;
        const file = req.file;
        let updateData = { title, description, price };

        if (file) {
            const cloudinaryResult = await uploadToCloudinary(file);
            updateData.imageUrl = cloudinaryResult.secure_url;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({ message: "Product updated successfully", success: true, product: updatedProduct });
    } catch (error) {
        console.error("Update product error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        res.status(500).json({ message: "An error occurred while updating the product", success: false });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "An error occurred while deleting the product", success: false });
    }
};