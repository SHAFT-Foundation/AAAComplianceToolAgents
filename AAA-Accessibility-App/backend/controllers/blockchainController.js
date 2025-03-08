/**
 * Blockchain Controller
 * Handles Web3-related API endpoints for blockchain integration
 */

const { validationResult } = require('express-validator');
const crypto = require('crypto');
const logger = require('../utils/logger');
const web3Service = require('../blockchain/web3Service');

/**
 * Store accessibility report on IPFS and optionally verify on-chain
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function storeAccessibilityReport(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { report, verifyOnChain, walletAddress } = req.body;

    // Generate content hash for the report
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(report))
      .digest('hex');

    // Store metadata on IPFS
    const cid = await web3Service.storeMetadataOnIPFS({
      contentHash,
      report,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });

    let verificationResult = null;

    // Verify on-chain if requested
    if (verifyOnChain && walletAddress) {
      verificationResult = await web3Service.verifyComplianceOnChain(
        contentHash,
        {
          reportCid: cid,
          timestamp: Date.now(),
          wcagLevel: 'AAA'
        },
        walletAddress
      );
    }

    // Return results
    res.status(200).json({
      success: true,
      data: {
        contentHash,
        ipfsCid: cid,
        ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
        verificationResult
      }
    });

    logger.info({ contentHash, cid }, 'Accessibility report stored successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to store accessibility report');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to store accessibility report'
    });
  }
}

/**
 * Retrieve accessibility report from IPFS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAccessibilityReport(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cid } = req.params;

    // Retrieve metadata from IPFS
    const metadata = await web3Service.getMetadataFromIPFS(cid);

    // Return results
    res.status(200).json({
      success: true,
      data: metadata
    });

    logger.info({ cid }, 'Accessibility report retrieved successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to retrieve accessibility report');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve accessibility report'
    });
  }
}

module.exports = {
  storeAccessibilityReport,
  getAccessibilityReport
}; 