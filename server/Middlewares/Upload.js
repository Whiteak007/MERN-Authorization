// src/Middlewares/Upload.js
import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({}); // Use memory storage for temporary files

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only images are allowed!'), false);
        }
    }
});

export const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file.path, { folder: "products" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

export default upload;