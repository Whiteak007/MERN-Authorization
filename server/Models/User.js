import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // User's name, a required string.
    name: {
        type: String,
        required: true
    },
    // User's email, a required and unique string to prevent duplicate accounts.
    email: {
        type: String,
        required: true,
        unique: true
    },
    // The user's hashed password, a required string.
    // Passwords should be hashed before saving to the database.
    password: {
        type: String,
        required: true
    }
});

// Create and export the Mongoose model based on the schema
const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
