
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setIsAuthenticated }) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.setItem('token', ''); // Tyhjentää tokenin session storagessa
    console.log('Token tyhjennetty:', sessionStorage.getItem('token')); 
    navigate('/login');
  };

  return (
    <div>
      <button className= "logout-button" onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
};

export default LogoutButton;