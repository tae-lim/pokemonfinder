import React, { useContext } from 'react';
import { redirect, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Redirect from '../utils/Redirect';

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  if (!user) {
		redirect('/login')
	} 
  
  return (
    <div>
      {user && <p>Hello {user.username}</p>}
      {user ? (
        <p onClick={handleLogout}>Logout</p>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )
      }
    </div>
  )
}

export default Header;