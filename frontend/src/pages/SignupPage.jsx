import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const { handleSignup } = useContext(AuthContext);
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4} height="80vh">
      <Paper sx={{ width: '400px', padding: '40px'}}>
        <Typography variant="h4" align="center" mb={4}>Signup</Typography>
        <form onSubmit={handleSignup}>
          <TextField
            name="firstName"
            label="First Name"
            fullWidth
            variant="outlined" 
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            name="lastName"
            label="Last Name"
            fullWidth
            variant="outlined" 
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined" 
            sx={{ marginBottom: 2 }}
            required
          />
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
          <TextField
            name="password2"
            label="Verify Password"
            type="password"
            fullWidth
            variant="outlined" 
            sx={{ marginBottom: 2 }}
            required
          />
          <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }} type="submit">Signup</Button>
          <Box display="flex" justifyContent="center">
            <Typography>Already have an account?{' '} 
              <Link to="/login">Login here!</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  )
};