import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function HomePage() {
	const { user } = useContext(AuthContext);
  return (
		<div>
			Sup
			{user && `Hello ${user.name}`}
		</div>
	)
}