const express = require('express');
const router = express.Router();
const ariaController = require('../controllers/ariaController');

/**
 * @route POST /api/aria/validate
 * @desc Validate HTML for ARIA and semantic correctness
 * @access Public
 */
router.post('/validate', ariaController.validateAria);

/**
 * @route POST /api/aria/fix
 * @desc Suggest fixes for ARIA and semantic issues
 * @access Public
 */
router.post('/fix', ariaController.suggestAriaFixes);

/**
 * @route POST /api/aria/status-messages
 * @desc Check for proper status message implementation
 * @access Public
 */
router.post('/status-messages', ariaController.checkStatusMessages);

/**
 * @route POST /api/aria/semantic-structure
 * @desc Analyze semantic structure of HTML
 * @access Public
 */
router.post('/semantic-structure', ariaController.analyzeSemanticStructure);

module.exports = router; 