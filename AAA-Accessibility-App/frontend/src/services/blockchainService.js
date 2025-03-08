/**
 * Blockchain Service
 * Provides API methods for interacting with blockchain functionality
 */

import axios from 'axios';

const API_URL = '/api/blockchain';

/**
 * Store accessibility report on IPFS
 * @param {Object} report - The accessibility report to store
 * @param {boolean} verifyOnChain - Whether to verify the report on the blockchain
 * @param {string} walletAddress - Ethereum wallet address (required if verifyOnChain is true)
 * @returns {Promise<Object>} - The response data
 */
export const storeAccessibilityReport = async (report, verifyOnChain = false, walletAddress = null) => {
  try {
    const response = await axios.post(`${API_URL}/store`, {
      report,
      verifyOnChain,
      walletAddress: verifyOnChain ? walletAddress : undefined
    });

    return response.data;
  } catch (error) {
    console.error('Error storing accessibility report:', error);
    throw error;
  }
};

/**
 * Retrieve accessibility report from IPFS
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {Promise<Object>} - The response data
 */
export const getAccessibilityReport = async (cid) => {
  try {
    const response = await axios.get(`${API_URL}/report/${cid}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving accessibility report:', error);
    throw error;
  }
};

/**
 * Check if Web3 features are available
 * @returns {Promise<boolean>} - Whether Web3 features are available
 */
export const checkWeb3Availability = async () => {
  try {
    const response = await axios.get('/api/health');
    return response.data.features?.web3 === 'connected';
  } catch (error) {
    console.error('Error checking Web3 availability:', error);
    return false;
  }
};

export default {
  storeAccessibilityReport,
  getAccessibilityReport,
  checkWeb3Availability
}; 