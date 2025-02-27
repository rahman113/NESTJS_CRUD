import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profiles'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files (jpg, jpeg, png) are allowed!'));
  }
  cb(null, true);
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
}).single('profilePicture'); // Ensure the field name matches frontend

// Middleware function
export function profilePictureUpload(req: Request, res: Response, next: NextFunction) {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err.message);
      return { success: false, message: err.message };
    }
    if (!req.file) {
      return { success: false, message: 'No file uploaded!' };
    }
    next();
  });
}
