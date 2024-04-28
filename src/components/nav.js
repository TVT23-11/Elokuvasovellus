import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './logout';

export default function NavigationBar({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout = () => {
    setIsAuthenticated(false); // Asetetaan käyttäjän kirjautumistila pois päältä
  };

  return (
    <div className="navigation-bar">
      <div className="nav-links">
        <Link to="/">Etusivu</Link>
        <Link to="/search">Elokuvat</Link>
        <Link to="/teathers">Teatterit</Link>
        <Link to="/groups">Ryhmät</Link>
        <Link to="/reviews">Arvostelut</Link>
        {isAuthenticated && <Link to="/favourites">Suosikit</Link>}
        {!isAuthenticated ? (
           <Link to="/login" className="login-button">Kirjaudu Sisään</Link>
        ) : (
          <div className="dropdown">
            <button className="dropbtn">Dropdownvalikko</button>
            <div className="dropdown-content">
              <Link to="/profile">Profiili</Link>
              <Link to="/groupmanagement">Ryhmien hallinta</Link>
              <LogoutButton onLogout={handleLogout} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}