import React, { useState, useCallback } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';

function App() {
  const [settings, setSettings] = useState({
    telegramToken: localStorage.getItem('telegramToken') || '',
    telegramChatId: localStorage.getItem('telegramChatId') || '',
    buyAmount: Number(localStorage.getItem('buyAmount')) || 1,
    slippage: Number(localStorage.getItem('slippage')) || 15,
    priorityFee: Number(localStorage.getItem('priorityFee')) || 5000,
    minContractScore: Number(localStorage.getItem('minContractScore')) || 85,
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSaveSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      // Save to localStorage
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      setNotification({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        open: true,
        message: 'Error saving settings',
        severity: 'error'
      });
    }
  }, [settings]);

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solana Memecoin Bot Settings
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              fullWidth
              label="Telegram Bot Token"
              value={settings.telegramToken}
              onChange={(e) => setSettings({ ...settings, telegramToken: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Telegram Chat ID"
              value={settings.telegramChatId}
              onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
            />
            
            <TextField
              type="number"
              label="Buy Amount (SOL)"
              value={settings.buyAmount}
              onChange={(e) => setSettings({ ...settings, buyAmount: Number(e.target.value) })}
            />
            
            <TextField
              type="number"
              label="Slippage (%)"
              value={settings.slippage}
              onChange={(e) => setSettings({ ...settings, slippage: Number(e.target.value) })}
            />
            
            <TextField
              type="number"
              label="Priority Fee (lamports)"
              value={settings.priorityFee}
              onChange={(e) => setSettings({ ...settings, priorityFee: Number(e.target.value) })}
            />
            
            <TextField
              type="number"
              label="Minimum Contract Score"
              value={settings.minContractScore}
              onChange={(e) => setSettings({ ...settings, minContractScore: Number(e.target.value) })}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
              sx={{ mt: 2 }}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleClose}
        >
          <Alert severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
