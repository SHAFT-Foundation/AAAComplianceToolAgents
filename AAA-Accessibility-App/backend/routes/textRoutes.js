const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

/**
 * @route POST /api/text/simplify
 * @desc Simplify complex text for better readability
 * @access Public
 */
router.post('/simplify', textController.simplifyText);

/**
 * @route POST /api/text/analyze-readability
 * @desc Analyze text readability level
 * @access Public
 */
router.post('/analyze-readability', textController.analyzeReadability);

/**
 * @route POST /api/text/unusual-words
 * @desc Identify unusual words and provide definitions
 * @access Public
 */
router.post('/unusual-words', textController.identifyUnusualWords);

/**
 * @route POST /api/text/abbreviations
 * @desc Identify abbreviations and provide expansions
 * @access Public
 */
router.post('/abbreviations', textController.identifyAbbreviations);

/**
 * @route POST /api/text/pronunciation
 * @desc Provide pronunciation guidance for words
 * @access Public
 */
router.post('/pronunciation', textController.providePronunciation);

module.exports = router; 