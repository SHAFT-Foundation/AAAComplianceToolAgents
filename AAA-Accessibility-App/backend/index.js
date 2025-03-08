require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const pino = require('pino');
const pinoHttp = require('pino-http');

// Import routes
const contrastRoutes = require('./routes/contrastRoutes');
const altTextRoutes = require('./routes/altTextRoutes');
const textRoutes = require('./routes/textRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const ariaRoutes = require('./routes/ariaRoutes');

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload directory based on file type
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += 'audio/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath += 'video/';
    } else {
      uploadPath += 'other/';
    }
    
    // Create directory if it doesn't exist
    const fs = require('fs');
    fs.mkdirSync(path.join(__dirname, uploadPath), { recursive: true });
    
    cb(null, path.join(__dirname, uploadPath));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/contrast', contrastRoutes);
app.use('/api/alt-text', altTextRoutes);
app.use('/api/text', textRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/aria', ariaRoutes);

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  logger.info('File uploaded successfully');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return file information
  return res.status(200).json({
    message: 'File uploaded successfully',
    file: {
      id: path.basename(req.file.filename, path.extname(req.file.filename)),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${path.relative(path.join(__dirname, 'uploads'), req.file.path)}`,
    },
  });
});

// Upload multiple files
app.post('/api/upload/multiple', upload.array('files', 10), (req, res) => {
  logger.info('Multiple files uploaded successfully');
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  // Return files information
  return res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files.map(file => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${path.relative(path.join(__dirname, 'uploads'), file.path)}`,
    })),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  logger.info('Health check endpoint called');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'The uploaded file exceeds the size limit (50MB).',
      });
    }
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server',
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api`);
}); 