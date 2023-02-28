import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { handleLogin } = useContext(AuthContext);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4} height="80vh">
      <Paper sx={{ width: '400px', padding: '40px' }}>
        <Typography variant="h4" align="center" mb={4}>
          Welcome Back!
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: 2 }}
            type="submit">
            Login
          </Button>
          <Box display="flex" justifyContent="center">
            <Typography>
              New User? <Link to="/signup"> Register here</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
