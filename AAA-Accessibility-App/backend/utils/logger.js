/**
 * Logger utility for consistent logging throughout the application
 */

const pino = require('pino');

// Initialize logger with pretty printing for development
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

module.exports = logger; 