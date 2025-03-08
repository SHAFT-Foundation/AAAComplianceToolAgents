/**
 * Blockchain Routes
 * API endpoints for Web3 and blockchain integration
 */

const express = require('express');
const { body, param } = require('express-validator');
const blockchainController = require('../controllers/blockchainController');

const router = express.Router();

/**
 * @route POST /api/blockchain/store
 * @desc Store accessibility report on IPFS and optionally verify on-chain
 * @access Public
 */
router.post(
  '/store',
  [
    body('report').notEmpty().withMessage('Report is required'),
    body('verifyOnChain').optional().isBoolean(),
    body('walletAddress').optional().isString().matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum address')
  ],
  blockchainController.storeAccessibilityReport
);

/**
 * @route GET /api/blockchain/report/:cid
 * @desc Retrieve accessibility report from IPFS
 * @access Public
 */
router.get(
  '/report/:cid',
  [
    param('cid').notEmpty().withMessage('IPFS CID is required')
  ],
  blockchainController.getAccessibilityReport
);

module.exports = router; 