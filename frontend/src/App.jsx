import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SpeedIcon from '@mui/icons-material/Speed';

function App() {
  const [settings, setSettings] = useState({
    telegramToken: localStorage.getItem('telegramToken') || '',
    telegramChatId: localStorage.getItem('telegramChatId') || '',
    buyAmount: Number(localStorage.getItem('buyAmount')) || 1,
    slippage: Number(localStorage.getItem('slippage')) || 15,
    priorityFee: Number(localStorage.getItem('priorityFee')) || 5000,
    minContractScore: Number(localStorage.getItem('minContractScore')) || 85,
  });

  const [botStatus, setBotStatus] = useState({
    isRunning: false,
    lastScan: null,
    tokensDiscovered: 0,
    successfulTrades: 0,
    totalProfit: 0,
    walletBalance: 0
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

  const toggleBot = () => {
    setBotStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  // Simulated data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (botStatus.isRunning) {
        setBotStatus(prev => ({
          ...prev,
          lastScan: new Date().toLocaleTimeString(),
          tokensDiscovered: prev.tokensDiscovered + Math.floor(Math.random() * 2),
          walletBalance: parseFloat((Math.random() * 10 + 5).toFixed(2))
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [botStatus.isRunning]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <TimelineIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Solana Memecoin Trading Bot
          </Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Status Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Bot Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={botStatus.isRunning}
                        onChange={toggleBot}
                        color="primary"
                      />
                    }
                    label={botStatus.isRunning ? "Running" : "Stopped"}
                  />
                  {botStatus.isRunning && <CircularProgress size={20} sx={{ ml: 2 }} />}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Wallet Balance
                </Typography>
                <Typography variant="h4">
                  {botStatus.walletBalance.toFixed(2)} SOL
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Tokens Discovered
                </Typography>
                <Typography variant="h4">
                  {botStatus.tokensDiscovered}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Last Scan
                </Typography>
                <Typography variant="h6">
                  {botStatus.lastScan || 'Not started'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Settings Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Bot Configuration
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telegram Bot Token"
                    value={settings.telegramToken}
                    onChange={(e) => setSettings({ ...settings, telegramToken: e.target.value })}
                    type="password"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telegram Chat ID"
                    value={settings.telegramChatId}
                    onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Buy Amount (SOL)"
                    value={settings.buyAmount}
                    onChange={(e) => setSettings({ ...settings, buyAmount: Number(e.target.value) })}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Slippage (%)"
                    value={settings.slippage}
                    onChange={(e) => setSettings({ ...settings, slippage: Number(e.target.value) })}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Priority Fee (lamports)"
                    value={settings.priorityFee}
                    onChange={(e) => setSettings({ ...settings, priorityFee: Number(e.target.value) })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Contract Score"
                    value={settings.minContractScore}
                    onChange={(e) => setSettings({ ...settings, minContractScore: Number(e.target.value) })}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                  startIcon={<SettingsIcon />}
                >
                  Save Settings
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
