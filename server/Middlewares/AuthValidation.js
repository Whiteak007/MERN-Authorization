// Middlewares/AuthValidation.js
import Joi from "joi";

// A reusable validation middleware function
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        // Map the Joi error details to a custom message
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({ message: errorMessage });
    }
    next();
};

const signupSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name cannot exceed 100 characters.',
            'string.empty': 'Name is required.',
            'any.required': 'Name is required.'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address.',
            'string.empty': 'Email is required.',
            'any.required': 'Email is required.'
        }),
    password: Joi.string()
        .min(4)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 4 characters long.',
            'string.max': 'Password cannot exceed 100 characters.',
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address.',
            'string.empty': 'Email is required.',
            'any.required': 'Email is required.'
        }),
    password: Joi.string()
        .min(4)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 4 characters long.',
            'string.max': 'Password cannot exceed 100 characters.',
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        })
});

export const signupValidation = validate(signupSchema);
export const loginValidation = validate(loginSchema);