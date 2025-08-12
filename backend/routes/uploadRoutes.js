const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

const router = express.Router();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to store uploaded files in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload buffer to Cloudinary using streams, returns a Promise
function streamUpload(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    // Convert buffer to stream and pipe to Cloudinary uploader
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// POST /api/upload
// Uploads a single image file to Cloudinary and returns the secure URL
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the file buffer to Cloudinary
    const result = await streamUpload(req.file.buffer);

    // Return the secure URL of the uploaded image
    return res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    // Send server error response
    return res.status(500).json({ message: 'Server error during image upload' });
  }
});

module.exports = router;
