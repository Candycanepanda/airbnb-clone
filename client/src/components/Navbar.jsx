import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/'; // Refresh to update nav
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        airbnb
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/add-property">Add Property</Link>
        {token ? (
          <>
            <span>Hi, {username}</span>
            <a href="#" onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;