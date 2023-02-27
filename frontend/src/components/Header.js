import React, { useContext, useEffect } from 'react';
import { styled, Box, Typography } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PokemonTypography = styled(Typography)({
  fontFamily: 'PokemonSolidNormal, cursive',
  color: '#FFCB05'
});

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user && pathname === '/') {
      navigate('/login')
    }
  }, [user])

  return (
    <Box display="flex" height="100px" justifyContent="space-between" alignItems="center" style={{backgroundColor: "#3466AF"}}>
      {
        user && pathname === '/' && 
        <PokemonTypography variant="h2" style={{ marginLeft: '30px'}}>
          Pokefinder
        </PokemonTypography>
      }
      <Box style={{ marginLeft: 'auto' }} >
        {user && <Typography style={ {cursor: 'pointer', marginRight: '30px', color: "white"} } onClick={handleLogout}>Logout</Typography>}
      </Box>
    </Box>
  )
}

export default Header;