import { createContext, useState,  } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
	const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
	
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch('http://127.0.0.1:8000/api/token/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
			});
			if (res.status === 200) {
				const data = await res.json();
				setAuthTokens(data);
				setUser(jwt_decode(data.access));
				localStorage.setItem('authTokens', JSON.stringify(data));
				navigate('/');
			} else {
				throw Error('Login was unsuccessful');
			}
		} catch(e) {
			console.error(e);
		}
	}

	const handleLogout = () => {
		setAuthTokens(null)
		setUser(null);
		localStorage.removeItem('authTokens');
		navigate('/login');
	}

	const contextData = {
		user: user,
		handleLogin: handleLogin,
		handleLogout: handleLogout
	}

	return (
		<AuthContext.Provider value={contextData}>
			{children}
		</AuthContext.Provider>
	)
};