import { Request, Response, NextFunction } from 'express';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export async function processProfilePicture(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const newFileName = `resized-${req.file.filename}`;
  const newFilePath = path.join(path.dirname(filePath), newFileName);

  try {
    await sharp(filePath)
      .resize(300, 300) // Resize to 300x300 pixels
      .toFormat('jpeg')
      .jpeg({ quality: 80 }) // Compress with 80% quality
      .toFile(newFilePath);

    // Remove the original file
    fs.unlinkSync(filePath);

    // Update req.file with the new filename
    req.file.filename = newFileName;
    req.file.path = newFilePath;

    next();
  } catch (error) {
    return { message: 'Image processing failed', error: error.message };
  }
}
