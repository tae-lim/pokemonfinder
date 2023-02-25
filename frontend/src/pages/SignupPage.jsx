import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const handleSubmit = async e => {
    e.preventDefault();
    console.log({ 
      'username': e.target.username.value, 
      'password1': e.target.password1.value,
      'password2': e.target.password2.value
    })
		try {
			const res = await fetch('http://127.0.0.1:8000/api/register/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
          'username': e.target.username.value, 
          'password1': e.target.password1.value,
          'password2': e.target.password2.value
        })
      });
			if (res.status === 200) {
				const data = await res.json();
				// setAuthTokens(data);
				// setUser(jwt_decode(data.access));
				// localStorage.setItem('authTokens', JSON.stringify(data));
				// navigate('/');
			} else {
				throw Error('Signup was unsuccessful');
			}
		} catch(e) {
			console.error(e);
	  }
  }
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4} height="80vh">
      <Paper sx={{ width: '400px', padding: '40px'}}>
        <Typography variant="h4" align="center" mb={4}>Signup</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            variant="outlined" 
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            name="password1"
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