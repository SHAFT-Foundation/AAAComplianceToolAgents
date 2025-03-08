const express = require('express');
const router = express.Router();
const contrastController = require('../controllers/contrastController');

/**
 * @route POST /api/contrast/analyze
 * @desc Analyze color contrast in content
 * @access Public
 */
router.post('/analyze', contrastController.analyzeContrast);

/**
 * @route POST /api/contrast/suggest
 * @desc Suggest color improvements for better contrast
 * @access Public
 */
router.post('/suggest', contrastController.suggestColors);

/**
 * @route POST /api/contrast/check
 * @desc Check contrast ratio between two colors
 * @access Public
 */
router.post('/check', contrastController.checkContrastRatio);

module.exports = router; 