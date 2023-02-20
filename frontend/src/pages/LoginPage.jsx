import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { TextField, Button } from '@mui/material/';

export default function LoginPage() {
  const { handleLogin } = useContext(AuthContext);

  return (
    <div>
      <form onSubmit={handleLogin}>
        <TextField
          name="username"
          label="Username"
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          required
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
};