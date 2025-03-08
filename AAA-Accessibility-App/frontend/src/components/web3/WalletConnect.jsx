import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Typography, Box, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * WalletConnect Component
 * Provides UI for connecting to Ethereum wallets
 */
const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await ethProvider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setProvider(ethProvider);
            if (onConnect) onConnect(accounts[0].address, ethProvider);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, [onConnect]);

  // Handle wallet connection
  const connectWallet = async () => {
    setConnecting(true);
    setError(null);

    try {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethProvider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(ethProvider);
          if (onConnect) onConnect(accounts[0], ethProvider);
        }
      } else {
        setDialogOpen(true);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    if (onDisconnect) onDisconnect();
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      {!account ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={connecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
          onClick={connectWallet}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label={formatAddress(account)}
            color="success"
            variant="outlined"
            onDelete={disconnectWallet}
            deleteIcon={<LinkOffIcon />}
          />
          <Typography variant="caption" color="textSecondary">
            Wallet Connected
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ErrorIcon fontSize="small" />
          {error}
        </Typography>
      )}

      {/* No wallet detected dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>No Ethereum Wallet Detected</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            To connect your wallet, you need to install a Web3 wallet browser extension or use a Web3-enabled browser.
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Popular wallet options:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="MetaMask" 
                secondary="Most popular Ethereum wallet extension"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Coinbase Wallet" 
                secondary="User-friendly wallet by Coinbase"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Brave Browser" 
                secondary="Privacy-focused browser with built-in wallet"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button 
            color="primary" 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            Get MetaMask
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletConnect; 