import express from "express";
const router = express.Router();
import rateLimit from 'express-rate-limit';
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";
import { login, signup, updateProfile } from "../Controllers/AuthController.js";
import { ensureAuthenticated } from "../Middlewares/Auth.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later'
});

// POST route for user login, with validation middleware
router.post("/login", loginValidation, login);

// POST route for user signup, with validation middleware
router.post("/signup", signupValidation, signup);

// Add the protected update profile route
// The frontend will now call this route.
router.put("/edit", ensureAuthenticated, updateProfile);

// You can remove the other /profile route since it's redundant.
// router.put("/profile", ensureAuthenticated, updateProfile);

// Export the router to be used in the main application
export default router;