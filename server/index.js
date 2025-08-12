// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from 'helmet';
import connectDB from "./Config/db_connect.js";
import AuthRouter from "./Routes/AuthRouter.js";
import ProductRouter from './Routes/ProductRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        
        // Middleware
        // Use built-in Express middleware instead of bodyParser
        app.use(express.json()); // For parsing application/json
        app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
        
        // Remove the old body-parser middleware:
        // app.use(bodyParser.json()); 
        
        app.use(cors());
        app.use(helmet());

        // API Routes
        app.use("/api/auth", AuthRouter);
        app.use("/api/products", ProductRouter);

        app.get("/", (req, res) => {
            res.send("Hello! from Backend");
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();