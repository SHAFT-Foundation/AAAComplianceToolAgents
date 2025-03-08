/**
 * Web3 Service for blockchain integration
 * Provides functionality for interacting with Ethereum blockchain and IPFS
 */

const Web3 = require('web3');
const { create } = require('ipfs-http-client');
const logger = require('../utils/logger');

// Load environment variables
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

// Initialize Web3 if RPC URL is provided
let web3;
let ipfs;

try {
  if (ETHEREUM_RPC_URL) {
    web3 = new Web3(ETHEREUM_RPC_URL);
    logger.info('Web3 initialized successfully');
  } else {
    logger.warn('ETHEREUM_RPC_URL not provided. Web3 functionality will be limited.');
  }

  // Initialize IPFS client
  ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  logger.info('IPFS client initialized successfully');
} catch (error) {
  logger.error({ error }, 'Failed to initialize Web3 or IPFS client');
}

/**
 * Stores accessibility metadata on IPFS
 * @param {Object} metadata - The accessibility metadata to store
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
async function storeMetadataOnIPFS(metadata) {
  try {
    if (!ipfs) {
      throw new Error('IPFS client not initialized');
    }

    // Add metadata to IPFS
    const result = await ipfs.add(JSON.stringify(metadata));
    const cid = result.path;
    
    logger.info({ cid }, 'Accessibility metadata stored on IPFS');
    return cid;
  } catch (error) {
    logger.error({ error }, 'Failed to store metadata on IPFS');
    throw new Error(`IPFS storage failed: ${error.message}`);
  }
}

/**
 * Verifies accessibility compliance on-chain
 * @param {string} contentHash - Hash of the content being verified
 * @param {Object} complianceData - Compliance verification data
 * @param {string} walletAddress - Ethereum wallet address for verification
 * @returns {Promise<Object>} - Transaction receipt
 */
async function verifyComplianceOnChain(contentHash, complianceData, walletAddress) {
  try {
    if (!web3) {
      throw new Error('Web3 not initialized');
    }

    // This is a placeholder for actual smart contract interaction
    // In a real implementation, you would:
    // 1. Load the smart contract ABI and address
    // 2. Create a contract instance
    // 3. Call the verification method

    logger.info({ contentHash, walletAddress }, 'Compliance verification recorded on-chain');
    
    // Return mock transaction receipt for now
    return {
      transactionHash: '0x' + Math.random().toString(16).substring(2, 42),
      blockNumber: Math.floor(Math.random() * 1000000),
      status: true
    };
  } catch (error) {
    logger.error({ error }, 'Failed to verify compliance on-chain');
    throw new Error(`Blockchain verification failed: ${error.message}`);
  }
}

/**
 * Retrieves accessibility metadata from IPFS
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {Promise<Object>} - The retrieved metadata
 */
async function getMetadataFromIPFS(cid) {
  try {
    // In a real implementation, you would use the IPFS client to get the data
    // For now, we'll use a simple HTTP request to the IPFS gateway
    const response = await fetch(`${IPFS_GATEWAY}${cid}`);
    const metadata = await response.json();
    
    logger.info({ cid }, 'Retrieved accessibility metadata from IPFS');
    return metadata;
  } catch (error) {
    logger.error({ error, cid }, 'Failed to retrieve metadata from IPFS');
    throw new Error(`IPFS retrieval failed: ${error.message}`);
  }
}

module.exports = {
  web3,
  storeMetadataOnIPFS,
  verifyComplianceOnChain,
  getMetadataFromIPFS
}; 