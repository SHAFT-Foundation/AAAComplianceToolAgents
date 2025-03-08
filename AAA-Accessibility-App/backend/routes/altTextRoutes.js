const express = require('express');
const router = express.Router();
const altTextController = require('../controllers/altTextController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/images'));
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * @route POST /api/alt-text/generate
 * @desc Generate alt text for an image
 * @access Public
 */
router.post('/generate', upload.single('image'), altTextController.generateAltText);

/**
 * @route POST /api/alt-text/analyze
 * @desc Analyze HTML content for images without alt text
 * @access Public
 */
router.post('/analyze', altTextController.analyzeImages);

/**
 * @route POST /api/alt-text/check
 * @desc Check if alt text is appropriate for an image
 * @access Public
 */
router.post('/check', altTextController.checkAltText);

module.exports = router; 