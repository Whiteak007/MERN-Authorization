// src/Routes/ProductRouter.js
import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../Middlewares/Auth.js";
import upload from '../Middlewares/Upload.js';
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} from "../Controllers/ProductController.js";

// All routes here require authentication
router.use(ensureAuthenticated);

// POST route to create a new product with image upload
router.post("/", upload.single('image'), createProduct);

// GET route to fetch all products
router.get("/", getAllProducts);

// PUT route to update a specific product by ID with optional new image
router.put("/:id", upload.single('image'), updateProduct);

// DELETE route to delete a specific product by ID
router.delete("/:id", deleteProduct);

export default router;