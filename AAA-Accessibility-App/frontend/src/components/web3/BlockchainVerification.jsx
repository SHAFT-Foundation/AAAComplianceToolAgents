import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress,
  Alert,
  Link,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';

import WalletConnect from './WalletConnect';

/**
 * BlockchainVerification Component
 * Provides UI for storing accessibility reports on IPFS and verifying on blockchain
 */
const BlockchainVerification = ({ report }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [ipfsResult, setIpfsResult] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const steps = ['Connect Wallet', 'Store on IPFS', 'Verify on Blockchain'];

  // Handle wallet connection
  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    setActiveStep(1);
    setError(null);
  };

  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setActiveStep(0);
  };

  // Handle storing report on IPFS
  const handleStoreOnIPFS = async () => {
    if (!report) {
      setError('No accessibility report to store');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/blockchain/store', {
        report,
        verifyOnChain: false
      });

      if (response.data.success) {
        setIpfsResult(response.data.data);
        setActiveStep(2);
      } else {
        throw new Error(response.data.error || 'Failed to store report on IPFS');
      }
    } catch (err) {
      console.error('Error storing report on IPFS:', err);
      setError(err.message || 'Failed to store report on IPFS');
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying report on blockchain
  const handleVerifyOnBlockchain = async () => {
    if (!walletAddress || !ipfsResult) {
      setError('Wallet not connected or IPFS storage not completed');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/blockchain/store', {
        report,
        verifyOnChain: true,
        walletAddress
      });

      if (response.data.success) {
        setVerificationResult(response.data.data.verificationResult);
        setActiveStep(3);
      } else {
        throw new Error(response.data.error || 'Failed to verify report on blockchain');
      }
    } catch (err) {
      console.error('Error verifying report on blockchain:', err);
      setError(err.message || 'Failed to verify report on blockchain');
    } finally {
      setLoading(false);
    }
  };

  // Reset the verification process
  const handleReset = () => {
    setActiveStep(0);
    setIpfsResult(null);
    setVerificationResult(null);
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Web3 Verification
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Store your accessibility compliance report on IPFS and verify it on the Ethereum blockchain for permanent, tamper-proof certification.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Connect your Ethereum wallet to begin the verification process
            </Typography>
            <WalletConnect 
              onConnect={handleWalletConnect} 
              onDisconnect={handleWalletDisconnect} 
            />
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Store your accessibility report on IPFS
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={handleStoreOnIPFS}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? 'Storing...' : 'Store on IPFS'}
            </Button>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Verify your accessibility report on the blockchain
            </Typography>
            
            {ipfsResult && (
              <Card variant="outlined" sx={{ mb: 2, textAlign: 'left' }}>
                <CardContent>
                  <Typography variant="subtitle2">IPFS Storage Result:</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    Content Hash: {ipfsResult.contentHash}
                  </Typography>
                  <Typography variant="body2">
                    IPFS URL: <Link href={ipfsResult.ipfsUrl} target="_blank" rel="noopener">{ipfsResult.ipfsUrl}</Link>
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
              onClick={handleVerifyOnBlockchain}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify on Blockchain'}
            </Button>
          </Box>
        )}
        
        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Verification completed successfully!
            </Alert>
            
            {verificationResult && (
              <Card variant="outlined" sx={{ mb: 2, textAlign: 'left' }}>
                <CardContent>
                  <Typography variant="subtitle2">Blockchain Verification Result:</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    Transaction Hash: {verificationResult.transactionHash}
                  </Typography>
                  <Typography variant="body2">
                    Block Number: {verificationResult.blockNumber}
                  </Typography>
                  <Typography variant="body2">
                    Status: {verificationResult.status ? 'Success' : 'Failed'}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ mt: 1 }}
            >
              Start New Verification
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BlockchainVerification;

 