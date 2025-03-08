const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directories exist
const audioDir = path.join(__dirname, '../uploads/audio');
const videoDir = path.join(__dirname, '../uploads/video');
fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

// Configure storage for media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, audioDir);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, videoDir);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept only audio and video files
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'), false);
    }
  },
});

/**
 * @route POST /api/media/generate-transcript
 * @desc Generate transcript for audio or video file
 * @access Public
 */
router.post('/generate-transcript', upload.single('media'), mediaController.generateTranscript);

/**
 * @route POST /api/media/generate-captions
 * @desc Generate synchronized captions for video
 * @access Public
 */
router.post('/generate-captions', upload.single('video'), mediaController.generateCaptions);

/**
 * @route POST /api/media/audio-description
 * @desc Generate extended audio descriptions for video
 * @access Public
 */
router.post('/audio-description', upload.single('video'), mediaController.generateAudioDescription);

/**
 * @route POST /api/media/sign-language
 * @desc Check if sign language is needed and provide guidance
 * @access Public
 */
router.post('/sign-language', upload.single('video'), mediaController.checkSignLanguageNeeds);

/**
 * @route POST /api/media/analyze
 * @desc Analyze media for accessibility issues
 * @access Public
 */
router.post('/analyze', upload.single('media'), mediaController.analyzeMedia);

module.exports = router; 