import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

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