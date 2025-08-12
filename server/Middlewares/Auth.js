// Middlewares/Auth.js
import jwt from 'jsonwebtoken';

export const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check for Authorization header
    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized: JWT token is required." });
    }

    // Split the header to get the token (expecting "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Unauthorized: Token format is invalid." });
    }

    try {
        // Verify the token using the secret key
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedJwt;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized: Invalid or expired token." });
    }
};